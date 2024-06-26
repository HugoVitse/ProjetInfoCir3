import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import {
    MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol, MDBBtn, 
    MDBInput, MDBInputGroup, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon,
    MDBContainer
} from 'mdb-react-ui-kit';
import axios from 'axios';
import Config from '../config.json';
import MobileDownload from './MobileDownload';
import { UserAgent } from "react-useragent";


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
    <UserAgent>
    {({ ua }) => {
      return ua.mobile ? <MobileDownload /> :
      
        <MDBContainer className="mt-4 mb-4" style={{marginLeft:'-24'}}>
            <MDBInputGroup className="mb-3" style={{ borderRadius: '35px', overflow: 'hidden', border: 'none' }}>
                <MDBInput
                label="Recherche"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: '35px', border: 'none' }}
                />
            </MDBInputGroup>

            <MDBRow className="mb-4">
                <MDBCol size="4">
                    <MDBDropdown>
                        <MDBDropdownToggle color="primary" className="d-flex align-items-center custom-btn-primary">
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
                        <MDBDropdownToggle color="primary" className="d-flex align-items-center custom-btn-primary ">
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

            <MDBRow className="custom-row">
                {filteredActivities.map((activity, index) => (
                    <MDBCol key={index} className="custom-col">
                        <MDBCard className='h-100 shadow bg-image hover-zoom custom-card' style={{ cursor: 'pointer' }} onClick={() => openPopup(activity.name, activity.description, activity.image, activity.date, activity.adresse)}>
                            <MDBCardImage
                                src={activity.image}
                                alt='...'
                                position='top'
                                className="custom-image"
                            />
                            <MDBCardBody className="custom-card-body">
                                <MDBCardTitle className="custom-card-title">{activity.name}</MDBCardTitle>
                                <MDBCardText className="custom-card-text">
                                    {activity.description}
                                </MDBCardText>
                                <MDBCardText className="custom-card-date">
                                    <small className="text-muted">{activity.date}</small>
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                ))}
            </MDBRow>

            {/* Popup */}
            {showPopup && selectedCard && (
                <div className="custom-popup">
                    <MDBCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <MDBCardImage
                            className='h-10'
                            src={selectedCard.img}
                            alt='...'
                            position='top'
                            style={{ maxWidth: '100%' }}
                        />
                        <MDBCardBody className='text-theme'>
                            <MDBCardTitle>{selectedCard.title}</MDBCardTitle>
                            <MDBCardText style={{ overflowWrap: 'break-word', wordWrap: 'break-word', wordBreak: 'break-word' }}>
                                {selectedCard.description}
                            </MDBCardText>
                            <MDBCardText>
                                <small className="text-muted">{selectedCard.date}</small>
                            </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                    <div className="custom-popup-buttons">
                        <MDBBtn color='secondary' className="custom-btn custom-btn-secondary" onClick={closePopup}>Fermer</MDBBtn>
                        <MDBBtn color='primary' className="custom-btn custom-btn-primary" onClick={Activite}>S'inscrire à l'activité</MDBBtn>
                    </div>
                </div>
            )}
        </MDBContainer>
     }}
    </UserAgent>
    );
};

export default Catalogue;