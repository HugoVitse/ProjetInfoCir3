import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState,useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import {
    MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol, MDBBtn, 
    MDBInput, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon,MDBContainer,MDBRipple,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
} from 'mdb-react-ui-kit';
import axios from 'axios';
import Config from '../config.json';



const Evenements = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortCriteria, setSortCriteria] = useState('date');
    const navigate = useNavigate();
    const [evenements, setEvenements] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [actualIndex, setActualIndex] = useState(0)
    const [initialZoom,setInitialZoom] = useState("13")

    const [basicModal, setBasicModal] = useState(false);

    const toggleOpen = () => setBasicModal(!basicModal)

    const [transform,setTransform] = useState("")

    const [latlog,setlatlong] = useState({})
    const googlekey = "AIzaSyAOpVdDvYUvbIB_u_d6k_HVfw13_Vux0K0"

    const mapRef = useRef(null);
    const pingRef = useRef(null);


    const openPopup = (title, description, img, date) => {
        setSelectedCard({ title, description, img, date });
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const Activite = () => {
        navigate('/Activite', {
            state: {
                cardTitle: selectedCard.title,
                cardDescription: selectedCard.description,
                cardImg: selectedCard.img,
                cardDate: selectedCard.date
            }
        });
    };

    const retrieveCookie = () => {
        const token = Cookies.get("jwt");
        if (!token) {
            navigate("/Login");
            return false;
        }
        try {
            const decodedToken = jwtDecode(token);
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
                const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/evenements`, { withCredentials: true });
                console.log(response.data)
                setEvenements(response.data);
            } catch (error) {
                console.error('Error fetching activities', error);
            }
        };

        const element = pingRef.current;
        const elementMap = mapRef.current

        const updateTransform = () => {
            const transform = window.getComputedStyle(element).transform;
            const zoom = (elementMap.attributes.zoom.value-8)/5;
            console.log(zoom)
            setTransform(`${transform} translate(110%,${100*((1-zoom)/2)}%) scale(${zoom})`)
        };

      

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if(mutation.type === 'attributes'){
                    updateTransform()
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



    useEffect(()=>{
        const wrap = async()=>{
            if(evenements.length>0){
                const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(evenements[0].activity.adresse)}&key=${googlekey}`);
                console.log(response.data)
                setlatlong(response.data.results[0].geometry.location)
          
                // const realtab = activities.reduce(async(acc,value,index)=>{
                //     const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?addres=${encodeURI(value.adresse)}`);
                    
                //     const returns = {
                //         ...value,
                //         realadress:response.data
                //     }
                //     return returns
    
                // })
                // console.log(realtab)
            }
        }
        wrap()
        
    },[evenements])

    useEffect(() => {    
        const sortedActivities = [...evenements].sort((a, b) => {
            if (sortCriteria === 'name') {
                return sortOrder === 'asc'
                    ? a.activity.name.localeCompare(b.name)
                    : b.activity.name.localeCompare(a.name);
            }
        });
    
        setFilteredActivities(
            sortedActivities.filter(evenement =>
                evenement.activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                evenement.activity.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, evenements, sortOrder, sortCriteria]);

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
    };

    const handleSortCriteriaChange = (criteria) => {
        setSortCriteria(criteria);
    };

    

    const selectedBtn = async(e) =>{
        const ide = e.target.id
        setActualIndex(ide)
        setInitialZoom("13")
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(evenements[ide].activity.adresse)}&key=${googlekey}`);
        console.log(response.data)
        setlatlong(response.data.results[0].geometry.location)
        console.log(ide)
    }   

    const customEvent = ()=>{
        navigate('/Activite', {
            state: {
                cardTitle: "",
                cardDescription: "",
                cardImg: "",
                cardDate: "",
                adresse:"",     
                custom:true
            },
        });
    }

   

    return (
        <MDBRow className='mx-0 vh-100'>
            <MDBCol size='3' className='vh-100' style={{borderBottom:"2px solid black",overflow:"scroll"}}>
                <MDBRow style={{height:"7%", borderBottom:"2px solid black"}}>
                    <MDBCol  size='9' className='vh-20'>

                    </MDBCol>
                    <MDBCol size='3' className='vh-20 d-flex align-items-center justify-content-center'>
                        <MDBDropdown>
                            <MDBDropdownToggle floating><MDBIcon fab icon='plus' /></MDBDropdownToggle>
                            <MDBDropdownMenu>
                                <MDBDropdownItem link onClick={customEvent} >Créer un évènement personnalisé</MDBDropdownItem>
                                <MDBDropdownItem link onClick={()=>{navigate("/Catalogue")}}>Choisir une activité dans le catalog</MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>
                        {/* <MDBBtn className='ms-2' tag='a' color='dark' floating>
                            <MDBIcon fab icon='plus' />
                        </MDBBtn> */}
                    </MDBCol>
                </MDBRow>
                <MDBRow style={{height:"93%"}}>
                    <MDBCol className='vh-80'>
                        {filteredActivities.map((activity, index) => (
                            <MDBBtn id={index} onClick={selectedBtn} style={{width:"100%",marginTop:"10px"}}>{activity.activity.title}</MDBBtn>
                        ))}
                    </MDBCol>
                </MDBRow>
                
            </MDBCol>
            <MDBCol size='9' className='px-0' style={{border:"2px solid black"}}>
                <gmp-map ref={mapRef} center={`${latlog.lat}, ${latlog.lng}`} zoom={initialZoom} map-id="DEMO_MAP_ID">
                    <gmp-advanced-marker ref={pingRef} position={`${latlog.lat}, ${latlog.lng}`} title="My location"></gmp-advanced-marker>
                </gmp-map>
                <MDBCard style={{width:"20%",position:"absolute",top:0,transform:transform,height: '45%'}}>
                    <MDBRipple rippleColor='light' rippleTag='div' className='bg-image hover-overlay'>
                        <MDBCardImage src={evenements[actualIndex]?evenements[actualIndex].activity.image:""} fluid alt='...' />
                        <a>
                        <div className='mask' style={{ backgroundColor: 'rgba(251, 251, 251, 0.15)' }}></div>
                        </a>
                    </MDBRipple>
                    <MDBCardBody>
                        <MDBCardTitle>{evenements[actualIndex]?evenements[actualIndex].activity.title:""}</MDBCardTitle>
                        <MDBCardText>
                            {evenements[actualIndex]?evenements[actualIndex].activity.description:""}
                        </MDBCardText>
                        <MDBBtn onClick={toggleOpen}>S'inscrire</MDBBtn>
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Modal title</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>...</MDBModalBody>

                        <MDBModalFooter>
                            <MDBBtn color='secondary' onClick={toggleOpen}>
                                Close
                            </MDBBtn>
                            <MDBBtn>Save changes</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </MDBRow>
    );
};

export default Evenements;