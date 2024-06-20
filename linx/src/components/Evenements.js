import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import {
    MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol, MDBBtn, 
    MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon, MDBRipple,
    MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody,
    MDBModalFooter,
} from 'mdb-react-ui-kit';
import axios from 'axios';
import Config from '../config.json';

const Evenements = () => {
    const navigate = useNavigate();
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [Activitiess, setActivities] = useState([]);
    const [actualIndex, setActualIndex] = useState(0);
    const [initialZoom, setInitialZoom] = useState("13");
    const [jwt, setJwt] = useState("");
    const [basicModal, setBasicModal] = useState(false);
    const [error, setError] = useState("");
    const toggleOpen = () => setBasicModal(!basicModal);
    const [transform, setTransform] = useState("");
    const [latlog, setlatlong] = useState({});
    const googlekey = "AIzaSyAOpVdDvYUvbIB_u_d6k_HVfw13_Vux0K0";
    const mapRef = useRef(null);
    const pingRef = useRef(null);

    const inscription = async () => {
        const data = {
            id: Activitiess[actualIndex]._id
        };
        try {
            const reponse = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/EventRegister`, data, { withCredentials: true });
            if (reponse.status === 200) {
                toggleOpen();
            }
        } catch (err) {
            switch (err.response.status) {
                case 503:
                    setError("L'évènement est plein");
                    break;
                case 504:
                    setError("Vous êtes déjà inscrit à l'évènement.");
                    break;
                default:
                    setError("Un problème est survenu");
                    break;
            }
        }
    };
    
    const retrieveCookie = () => {
        const token = Cookies.get("jwt");
        if (!token) {
            navigate("/Login");
            return false;
        }
        try {
            const decodedToken = jwtDecode(token);
            setJwt(decodedToken);
            console.log(decodedToken);
            return true;
        } catch {
            navigate("/Login");
            return false;
        }
    };

    useEffect(() => {
        const fetchActivities = async () => {
            if (!retrieveCookie()) return;

            try {
                const responses = await axios.get('http://localhost/infos', { withCredentials: true });
                setSelectedInterests(responses.data.activities || []);
                console.log(responses.data.activities);

                const eventsResponse = await axios.get('http://localhost/evenements', { withCredentials: true });
                setActivities(eventsResponse.data.filter(activity => new Date(activity.date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)));
                console.log(eventsResponse.data);

            } catch (error) {
                console.error('Error fetching activities', error);
            }
        };

        const element = pingRef.current;
        const elementMap = mapRef.current;

        const updateTransform = () => {
            const transform = window.getComputedStyle(element).transform;
            const zoom = (elementMap.attributes.zoom.value - 8) / 5;
            setTransform(`${transform} translate(140%,${100 * ((1 - zoom) / 2)}%) scale(${zoom})`);
        };

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    updateTransform();
                }
                if (mutation.attributeName === 'style') {
                    updateTransform();
                }
            });
        });

        observer.observe(element, {
            attributes: true,
            attributeFilter: ['style'],
        });

        // Initial check
        updateTransform();

        fetchActivities();
    }, []);

    useEffect(() => {
        const wrap = async () => {
            if (Activitiess.length > 0) {
                const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(Activitiess[0].activity.adresse)}&key=${googlekey}`);
                setlatlong(response.data.results[0].geometry.location);
            }
        };
        wrap();

    }, [Activitiess]);

    const selectedBtn = async (e) => {
        const ide = e.target.id;
        setActualIndex(ide);
        setInitialZoom("13");
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(Activitiess[ide].activity.adresse)}&key=${googlekey}`);
        setlatlong(response.data.results[0].geometry.location);
    };

    const customEvent = () => {
        navigate('/Activite', {
            state: {
                cardTitle: "",
                cardDescription: "",
                cardImg: "",
                cardDate: "",
                adresse: "",
                custom: true
            },
        });
    };

    return (
        <MDBRow className='mx-0 vh-100'>
            <MDBCol size='4' className='vh-100' style={{ borderBottom: "2px solid black" }}>
                <MDBRow className='bg-theme-nuance' style={{ height: "7%", borderBottom: "2px solid black", alignItems: 'center'}}>
                <MDBCol size='9' className='d-flex align-items-center'>
                    <h4 className="text-theme font-weight-bold mb-0">Créer un événement</h4>
                </MDBCol>
                <MDBCol size='3' className='d-flex align-items-center justify-content-center'>
                    <MDBDropdown>
                        <MDBDropdownToggle floating className="custom-btn-primary text-theme-inv">
                            <MDBIcon icon='plus' />
                        </MDBDropdownToggle>
                        <MDBDropdownMenu className="bg-white shadow rounded">
                            <MDBDropdownItem link onClick={customEvent} className="text-primary d-flex align-items-center">
                                <MDBIcon icon="pencil-alt" className="me-2" />Créer un événement personnalisé
                            </MDBDropdownItem>
                            <MDBDropdownItem link onClick={() => { navigate("/Catalogue") }} className="text-primary d-flex align-items-center">
                                <MDBIcon icon="book" className="me-2" />Choisir une activité dans le catalogue
                            </MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </MDBCol>
            </MDBRow>


                <MDBRow className='recommendations' style={{ maxHeight: 'calc(100vh - 22rem)', overflowY: 'auto'}}>
                    <h6 className='text-center mt-3 mb-2'><strong>Recommandations</strong></h6>
                    <MDBCol className='vh-80'>
                        {Activitiess
                            .filter((activity) => selectedInterests.includes(activity.type))
                            .map((activity, index) => (
                                <MDBBtn className="custom-btn-primary" key={`rec-${index}`} id={index} onClick={selectedBtn} style={{width:"100%",marginTop:"10px"}}>{activity.activity.title}</MDBBtn>
                            ))}
                    </MDBCol>
                </MDBRow>

                <hr className='barreHr mb-3'/>

                <MDBRow className='recommendations' style={{ maxHeight: 'calc(100vh - 18rem)', overflowY: 'auto' }}>
                    <h6 className='text-center mb-2'><strong>Liste</strong></h6>
                    <MDBCol className='vh-80'>
                        {Activitiess
                            .map((activity, index) => (
                                <MDBBtn className="custom-btn-primary" key={`list-${index}`} id={index} onClick={selectedBtn} style={{width:"100%",marginTop:"10px"}}>{activity.activity.title}</MDBBtn>
                            ))}
                    </MDBCol>
                </MDBRow>
            </MDBCol>

            <MDBCol size='8' className='px-0' style={{border:"2px solid black"}}>
                <gmp-map ref={mapRef} center={`${latlog.lat + 2/100}, ${latlog.lng}`} zoom={initialZoom} map-id="DEMO_MAP_ID">
                    <gmp-advanced-marker ref={pingRef} position={`${latlog.lat}, ${latlog.lng}`} title="My location"></gmp-advanced-marker>
                </gmp-map>
                <MDBCard style={{
                    width: "20%", 
                    position: "absolute", 
                    top: 0, 
                    transform: transform, 
                    height: '45%', 
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)', 
                    borderRadius: '10px', 
                    overflow: 'auto'
                }}>
                    <MDBRipple rippleColor='light' rippleTag='div' className='bg-image hover-overlay'>
                        <MDBCardImage 
                            src={Activitiess[actualIndex] ? Activitiess[actualIndex].activity.image : ""} 
                            fluid alt='Event Image' 
                            style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                        />
                        <a>
                            <div className='mask' style={{ backgroundColor: 'rgba(251, 251, 251, 0.15)' }}></div>
                        </a>
                    </MDBRipple>
                    <MDBCardBody className='bg-theme-nuance text-theme'>
                        <MDBCardTitle>{Activitiess[actualIndex]?Activitiess[actualIndex].activity.title:""}</MDBCardTitle>
                        <MDBCardText>
                            {Activitiess[actualIndex]?Activitiess[actualIndex].activity.description:""}
                        </MDBCardText>
                        <MDBCardText>
                            {Activitiess[actualIndex]?(Activitiess[actualIndex].participants.indexOf(jwt.email)==-1?"":"Vous êtes déjà inscrits"):""}
                        </MDBCardText>
                        <MDBCardText>
                            {Activitiess[actualIndex]?(Activitiess[actualIndex].participants.length >= (parseInt(Activitiess[actualIndex].nbinvities) +1)?"Evenement complet":""):""}
                        </MDBCardText>
                        <MDBBtn disabled={Activitiess[actualIndex]?((Activitiess[actualIndex].participants.indexOf(jwt.email)!=-1  || Activitiess[actualIndex].participants.length >= (parseInt(Activitiess[actualIndex].nbinvities) +1))?true:false):false} onClick={toggleOpen}>S'inscrire</MDBBtn>
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Êtes-vous sûr ?</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <MDBCardText>{`Voulez-vous vraiment vous inscrire à l'activité : ${Activitiess[actualIndex] ? Activitiess[actualIndex].activity.title : ""}`}</MDBCardText>
                            {error.length > 0 ? <MDBCardText style={{ color: "#ff3333" }}>{error}</MDBCardText> : ""}
                        </MDBModalBody>

                        <MDBModalFooter>
                            <MDBBtn color='secondary' onClick={toggleOpen}>
                                Annuler
                            </MDBBtn>
                            <MDBBtn onClick={inscription}>S'inscrire</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </MDBRow>   
    );
};

export default Evenements;