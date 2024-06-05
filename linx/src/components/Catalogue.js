import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import {
    MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol, MDBBtn, 
    MDBInput, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon
} from 'mdb-react-ui-kit';
import axios from 'axios';
import Config from '../config.json';

const Catalogue = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortCriteria, setSortCriteria] = useState('date');
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);

    const openPopup = (title, description, img, date,adresse) => {
        setSelectedCard({ title, description, img, date,adresse });
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
                cardDate: selectedCard.date,
                adresse:selectedCard.adresse,
                custom:false
            },
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
                const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/activities`, { withCredentials: true });
                setActivities(response.data);
            } catch (error) {
                console.error('Error fetching activities', error);
            }
        };

        fetchActivities();
    }, []);

    useEffect(() => {    
        const sortedActivities = [...activities].sort((a, b) => {
            if (sortCriteria === 'name') {
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            }
        });
    
        setFilteredActivities(
            sortedActivities.filter(activity =>
                activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                activity.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, activities, sortOrder, sortCriteria]);

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
    };

    const handleSortCriteriaChange = (criteria) => {
        setSortCriteria(criteria);
    };

    return (
        <div className="container mt-4 mb-4">
            <MDBInput
                label="Rechercher une activité"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="m-4"
            />

            <MDBRow className="mb-4">
                <MDBCol size="4">
                    <MDBDropdown>
                        <MDBDropdownToggle color="primary" className="d-flex align-items-center">
                            Trier par {sortCriteria === 'name' ? 'ordre alphabétique' : 'date'}
                            <MDBIcon icon={sortCriteria === 'name' ? 'sort-alpha-down' : 'sort-numeric-down'} className="ms-2" />
                        </MDBDropdownToggle>
                        <MDBDropdownMenu>
                            <MDBDropdownItem style={{ cursor: 'pointer' }} onClick={() => handleSortCriteriaChange('name')}>
                                <MDBIcon icon="sort-alpha-down" className="me-2" /> Par nom
                            </MDBDropdownItem>
                            <MDBDropdownItem style={{ cursor: 'pointer' }} onClick={() => handleSortCriteriaChange('date')}>
                                <MDBIcon icon="sort-numeric-down" className="me-2" /> Par date
                            </MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </MDBCol>
                <MDBCol size="4">
                    <MDBDropdown>
                        <MDBDropdownToggle color="primary" className="d-flex align-items-center">
                            {sortOrder === 'asc' ? 'Ascendant' : 'Descendant'}
                            <MDBIcon icon={sortOrder === 'asc' ? 'sort-amount-down' : 'sort-amount-up'} className="ms-2" />
                        </MDBDropdownToggle>
                        <MDBDropdownMenu>
                            <MDBDropdownItem style={{ cursor: 'pointer' }} onClick={() => handleSortOrderChange('asc')}>
                                <MDBIcon icon="sort-amount-down" className="me-2" /> Ascendant
                            </MDBDropdownItem>
                            <MDBDropdownItem style={{ cursor: 'pointer' }} onClick={() => handleSortOrderChange('desc')}>
                                <MDBIcon icon="sort-amount-up" className="me-2" /> Descendant
                            </MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </MDBCol>
            </MDBRow>

            <MDBRow className='row-cols-1 row-cols-md-3 g-4'>
                {filteredActivities.map((activity, index) => (
                    <MDBCol key={index}>
                        <MDBCard className='h-100 shadow bg-image hover-zoom' style={{ cursor: 'pointer' }} onClick={() => openPopup(activity.name, activity.description, activity.image, activity.date, activity.adresse)}>
                            <MDBCardImage
                                src={activity.image}
                                alt='...'
                                position='top'
                            />
                            <MDBCardBody>
                                <MDBCardTitle>{activity.name}</MDBCardTitle>
                                <MDBCardText>
                                    {activity.description}
                                </MDBCardText>
                                <MDBCardText>
                                    <small className="text-muted">{activity.date}</small>
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                ))}
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
                            <MDBCardText>
                                <small className="text-muted">{selectedCard.date}</small>
                            </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <MDBBtn color='secondary' onClick={closePopup}>Fermer</MDBBtn>
                        <MDBBtn color='primary' onClick={Activite}>S'inscrire à l'activité</MDBBtn>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Catalogue;