import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
    MDBCard,
    MDBCardImage,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBRow,
    MDBCol,
    MDBBtn
} from 'mdb-react-ui-kit';
import axios from 'axios';
import Config from '../config.json'

const Catalogue = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state
    const [error, setError] = useState(null); // Add error state
    const navigate = useNavigate();
    const [activities,setActivities] = useState([])
    const [componentActivities,setComponentActivities] = useState([])

    const openPopup = (title, description, img) => {
        setSelectedCard({ title, description, img });
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
                cardImg: selectedCard.img
            }
        });
    };

    const a = "this card";
    const url = 'https://www.lilletourism.com/api/render/website_v2/lille-tourisme/playlist/48080/fr_FR/json?page=17&randomSeed=5e0ec7ac-791f-4329-946f-42f86c093f5a&confId=48080';

    const login = async () => {
        try {
            setLoading(true);
            const response = await axios.post(url);
            console.log(response.data);
        } catch (error) {
            console.error('There was an error logging in!', error);
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=>{
        const getActivities = async() => {
            const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/activities`,{withCredentials:true})
            setActivities(response.data)
        }
        getActivities()
    },[])

    useEffect(()=>{
        if(activities.length >0){
            let tmpComp = []
            for(let i=0; i< activities.length;i++){
                console.log(i)
                console.log(activities[i])
                const newCard = <MDBCol>
                                    <MDBCard className='h-100 shadow bg-image hover-zoom' style={{ cursor: 'pointer' }} onClick={() => openPopup('Card title', 'This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.', 'https://mdbootstrap.com/img/new/standard/city/041.webp')}>
                                        <MDBCardImage
                                            src={activities[i].image}
                                            alt='...'
                                            position='top'
                                        />
                                        <MDBCardBody>
                                            <MDBCardTitle>{activities[i].name}</MDBCardTitle>
                                            <MDBCardText>
                                                {activities[i].description}
                                            </MDBCardText>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                tmpComp.push(newCard)
            }
            setComponentActivities(tmpComp)
        }
    },[activities])

    return (
        <>
            <MDBRow className='row-cols-1 row-cols-md-3 g-4'>
                {/* <MDBCol>
                    <MDBCard className='h-100 shadow bg-image hover-zoom' style={{ cursor: 'pointer' }} onClick={() => openPopup('Card title', 'This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.', 'https://mdbootstrap.com/img/new/standard/city/041.webp')}>
                        <MDBCardImage
                            src='https://mdbootstrap.com/img/new/standard/city/041.webp'
                            alt='...'
                            position='top'
                        />
                        <MDBCardBody>
                            <MDBCardTitle>Card title</MDBCardTitle>
                            <MDBCardText>
                                This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
                            </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol> */}
                {componentActivities}
            </MDBRow>

            {/* Popup */}
            {showPopup && selectedCard && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '60%', maxHeight: '90%', overflow: 'auto', backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', width: 'calc(100% - 40px)' }}>
                    <MDBCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <MDBCardImage
                            className='h-10'
                            src={selectedCard.img}
                            alt='...'
                            position='top'
                            style={{ maxWidth: '100%' }}
                        />
                        <MDBCardBody>
                            <MDBCardTitle>{selectedCard.title}</MDBCardTitle>
                            <MDBCardText style={{ overflowWrap: 'break-word', wordWrap: 'break-word', wordBreak: 'break-word' }}>
                                {selectedCard.description}
                            </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <MDBBtn color='secondary' onClick={closePopup}>Fermer</MDBBtn>
                        <MDBBtn color='primary' onClick={Activite}>S'inscrire à l'activité</MDBBtn>
                    </div>
                </div>
            )}
        </>
    );
};

export default Catalogue;
