import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
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

const Catalogue = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const navigate = useNavigate();

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

    return (
        <>
            <MDBRow className='row-cols-1 row-cols-md-3 g-4'>
                <MDBCol>
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
                </MDBCol>
                <MDBCol>
                    <MDBCard className='h-100 shadow bg-image hover-zoom' style={{ cursor: 'pointer' }} onClick={() => openPopup('Card title', a, 'https://mdbootstrap.com/img/new/standard/city/042.webp')}>
                        <MDBCardImage
                            src='https://mdbootstrap.com/img/new/standard/city/042.webp'
                            alt='...'
                            position='top'
                        />
                        <MDBCardBody>
                            <MDBCardTitle>Card title</MDBCardTitle>
                            <MDBCardText style={{ overflowWrap: 'break-word', wordWrap: 'break-word', wordBreak: 'break-word' }}>{a}</MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol>
                    <MDBCard className='h-100 shadow bg-image hover-zoom' style={{ cursor: 'pointer' }}>
                        <MDBCardImage
                        src='https://mdbootstrap.com/img/new/standard/city/043.webp'
                        alt='...'
                        position='top'
                        />
                        <MDBCardBody>
                        <MDBCardTitle>Card title</MDBCardTitle>
                        <MDBCardText>
                            This is a longer card with supporting text below as a natural lead-in to additional content.
                        </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol>
                    <MDBCard className='h-100 shadow bg-image hover-zoom' style={{ cursor: 'pointer' }}>
                        <MDBCardImage
                        src='https://mdbootstrap.com/img/new/standard/city/044.webp'
                        alt='...'
                        position='top'
                        />
                        <MDBCardBody>
                        <MDBCardTitle>Card title</MDBCardTitle>
                        <MDBCardText>
                            This is a longer card with supporting text below as a natural lead-in to additional content.
                            This content is a little bit longer.
                        </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol>
                    <MDBCard className='h-100 shadow bg-image hover-zoom' style={{ cursor: 'pointer' }}>
                        <MDBCardImage
                        src='https://mdbootstrap.com/img/new/standard/city/041.webp'
                        alt='...'
                        position='top'
                        />
                        <MDBCardBody>
                        <MDBCardTitle>Card title</MDBCardTitle>
                        <MDBCardText>
                            This is a longer card with supporting text below as a natural lead-in to additional content.
                            This content is a little bit longer.
                        </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol>
                    <MDBCard className='h-100 shadow bg-image hover-zoom' style={{ cursor: 'pointer' }}>
                        <MDBCardImage
                        src='https://mdbootstrap.com/img/new/standard/city/042.webp'
                        alt='...'
                        position='top'
                        />
                        <MDBCardBody>
                        <MDBCardTitle>Card title</MDBCardTitle>
                        <MDBCardText>This is a short card.</MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
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
