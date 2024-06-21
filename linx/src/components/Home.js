import React, { useState, useEffect } from 'react';
import {
  MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardText, MDBIcon,
  MDBTypography, MDBRadio, MDBRange, MDBModalFooter, MDBBtn, MDBModalTitle,
  MDBCheckbox, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalBody,MDBBadge
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';
import { UserAgent } from "react-useragent";
import { useNavigate, Link } from "react-router-dom";
import MobileDownload from './MobileDownload';


const Home = () => {
  const [basicModal, setBasicModal] = useState(false);
  const toggleOpen = () => setBasicModal(!basicModal);
  const [lastName, setLastName] = useState('');
  const [email, setemail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pp, setPp] = useState('');
  const [id, setid] = useState('');
  const [userAgent, setUserAgent] = useState('');
  const [formData, setFormData] = useState({
    activities: [],
    note: 5,
    preferredTime: '',
    groupSize: '',
    placeType: '',
    budget: '',
    description: '',
    travelDistance: 25,
  });

  const handleCheckboxChange = (activity) => {
    setFormData((prevData) => ({
      ...prevData,
      activities: prevData.activities.includes(activity)
        ? prevData.activities.filter((a) => a !== activity)
        : [...prevData.activities, activity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost/fillquestionnaire', formData, { withCredentials: true });
      toggleOpen();
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRadioChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const retrieveCookie = () => {
    const token = Cookies.get("jwt");
    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
    } catch {
      navigate("/Login");
    }
  };

  useEffect(() => {
    const userAgent = Cookies.get("userAgent");
    console.log("User-Agent:", userAgent || "User-Agent non trouvé");
    const fnc = async () => {
      retrieveCookie();
      try {
        const response = await axios.get('http://localhost/infos', { withCredentials: true });
        setFirstName(response.data.firstName || '');
        setLastName(response.data.lastName || '');
        setSelectedInterests(response.data.activities || []);
        setemail(response.data.email || '')
        setPp(response.data.image || '');
        if (response.data.firstLogin) {
          toggleOpen();
        }

        const eventsResponse = await axios.get('http://localhost/evenements', { withCredentials: true });
        setEvents(eventsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fnc();
  }, []);

  const isFormComplete = () => {
    return (Object.values(formData).every(value => value !== '' && value !== undefined)&&
    formData.activities.length > 0);
  }
  
  useEffect(() => {
    const fnc1 = async () => {
      DeleteEvent(id);
      DeleteParticipant(id);
    };
    fnc1();
  }, []);
  
  const DeleteEvent = (id) => {
    setid(id); 
    handleEventDelete(id);
  };

  const DeleteParticipant = (id) => {
    setid(id); 
    handleParticipantDelete(id);
  };
  
  const handleParticipantDelete = async (id) => {
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost/ParticipantDelete', {id: id}, { withCredentials: true });
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventDelete = async (id) => {
    setError('');
    setLoading(true);
    console.log(id)
    try {
      await axios.post('http://localhost/EventDelete', {id: id}, { withCredentials: true });
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderInterestCards = () => {
    return selectedInterests.map((interest, index) => (
      <MDBCol md="6" className="mb-4" key={index}>
        <MDBCard className="text-theme custom-card border border-primary">
          <MDBCardBody className="p-4 custom-card bg-light">
            <MDBTypography tag="h4" className="text-primary font-weight-bold">
              {interest}
            </MDBTypography>
            <hr /> 
            {events
              .filter(event => event.type === interest && new Date(event.date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) &&
                Array.isArray(event.participants) && event.participants.some(participants => participants === email))
              .map((event, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                  <Link to={`/event/${event.activity.title}/${event._id}`} className="text-decoration-none">
                    <MDBCardText className="fw-bold">
                      <MDBBadge color="secondary" className="mr-2">Event</MDBBadge>
                      : {event.activity.title}
                    </MDBCardText>
                  </Link>
                  {event.host === email 
                    ? <button onClick={() => DeleteEvent(event._id)} className="btn btn-danger">Supprimer</button> 
                    : <button onClick={() => DeleteParticipant(event._id)} className="btn btn-danger">Se désinscrire</button>}
                </div>
              ))}
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    ));
  }; 
  

  return (
    <UserAgent>
      {({ ua }) => {
        return ua.mobile ? <MobileDownload /> :
          <div className="vh-100 d-flex flex-column">
            <MDBContainer fluid className="py-3" style={{ overflowY: 'auto' }}>
              <MDBRow className="justify-content-center align-items-center">
                <MDBCol lg="8" className="mb-4">
                  <header style={{
                    backgroundImage: 'url(https://femmedinfluence.fr/wp-content/uploads/2015/07/desperate-houseiwves-hug-1.gif)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '40vh',
                    borderRadius: '15px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      textAlign: 'right',
                      background: 'rgba(0, 0, 0, 0.5)',
                      padding: '10px',
                      borderRadius: '10px'
                    }}>
                      <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}><strong>ÇA VA CHAUFFER</strong></h1>
                      <p style={{ fontSize: '1.5rem', marginBottom: '0' }}>Nos modèles pour tout changer cet été.</p>
                    </div>
                  </header>
                </MDBCol>
              </MDBRow>
  
              <MDBRow className="justify-content-center align-items-center mb-4">
                <MDBCol lg="8">
                  <MDBCard className="mb-4" style={{ borderRadius: '15px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                    <MDBCardBody className="p-4 d-flex justify-content-between align-items-center">
                      <div>
                        <h2 className="fw-bold mb-1" style={{ fontSize: '1.5rem' }}>Bienvenue sur Linx</h2>
                        <p className="mb-0" style={{ fontSize: '1.1rem' }}>Bonjour {firstName} {lastName} !</p>
                      </div>
                      <div>
                        <Link to={`/Account/${encodeURIComponent(email)}`}>
                          <img src={"http://localhost/" + pp} alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                        </Link>
                      </div>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
  
              <MDBRow className="justify-content-center align-items-center mb-4">
                <MDBCol lg="8">
                  <section className="text-center">
                    <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>Événements à venir</h2>
                    <p style={{ fontSize: '1.2rem' }}>Découvrez vos activités en fonction de vos intérêts et de vos inscriptions !</p>
                  </section>
                </MDBCol>
              </MDBRow>
  
              <MDBRow className="justify-content-center">
                {renderInterestCards()}
              </MDBRow>
            </MDBContainer>
  
            <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
              <MDBModalDialog size="xl" className="vh-80">
                <MDBModalContent>
                  <MDBModalHeader>
                    <MDBModalTitle>Questionnaire</MDBModalTitle>
                    <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                  </MDBModalHeader>
  
                  <MDBModalBody>
                    <MDBRow>
                      <MDBCol md="10" lg="8" className="mx-auto">
                        <MDBCard style={{ borderRadius: '15px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                          <MDBCardBody className="p-5">
                            <h3 className="text-center mb-4">Questionnaire</h3>
                            <div className="mb-4">
                              <label className="form-label">Quelles activités aimez-vous ?</label>
                              <div className="d-flex flex-wrap">
                                {['Cinéma', 'Attractions', 'Animaux', 'Théâtre', 'Danse', 'Manga/Anime', 'Séries', 'Échecs', 'Moto', 'Lecture', 'Jeux vidéos', 'Musique', 'BD/Comics', 'Voyager', 'Musées', 'Sortir entre amis', 'Sport', 'Nourriture', 'La mode'].map((activity) => (
                                  <MDBCheckbox
                                    key={activity}
                                    label={activity}
                                    id={activity.toLowerCase()}
                                    onChange={() => handleCheckboxChange(activity)}
                                  />
                                ))}
                              </div>
                            </div>
  
                            <div className="mb-4">
                              <label className="form-label">Notez votre état actuel :</label>
                              <MDBRange
                                defaultValue={10}
                                min="1"
                                max="10"
                                step="1"
                                id="note"
                                value={formData.note}
                                onChange={(e) => handleInputChange('note', e.target.value)}
                              />
                            </div>
  
                            <div className="mb-4">
                              <label className="form-label">Préférez-vous les activités en petit ou en grand groupe ?</label>
                              <div className="d-flex">
                                <MDBRadio name="groupSize" label="Petit groupe" id="petitcomite" value="petitcomite" onChange={(e) => handleRadioChange('groupSize', e.target.value)} />
                                <MDBRadio name="groupSize" label="Grand groupe" id="grandcomite" value="grandcomite" onChange={(e) => handleRadioChange('groupSize', e.target.value)} />
                              </div>
                            </div>
  
                            <div className="mb-4">
                              <label className="form-label">Quel moment de la journée préférez-vous pour les sorties ?</label>
                              <div className="d-flex">
                                <MDBRadio name="preferredTime" label="Matin" id="morning" value="morning" onChange={(e) => handleRadioChange('preferredTime', e.target.value)} />
                                <MDBRadio name="preferredTime" label="Après-midi" id="afternoon" value="afternoon" onChange={(e) => handleRadioChange('preferredTime', e.target.value)} />
                                <MDBRadio name="preferredTime" label="Soir" id="evening" value="evening" onChange={(e) => handleRadioChange('preferredTime', e.target.value)} />
                              </div>
                            </div>
  
                            <div className="mb-4">
                              <label className="form-label">Préférez-vous les activités en intérieur ou en extérieur ?</label>
                              <div className="d-flex">
                                <MDBRadio name="placeType" label="Intérieur" id="indoor" value="indoor" onChange={(e) => handleRadioChange('placeType', e.target.value)} />
                                <MDBRadio name="placeType" label="Extérieur" id="outdoor" value="outdoor" onChange={(e) => handleRadioChange('placeType', e.target.value)} />
                              </div>
                            </div>
  
                            <div className="mb-4">
                              <label className="form-label">Quel est votre budget pour les sorties ?</label>
                              <div className="d-flex">
                                <MDBRadio name="budget" label="Bas" id="low" value="low" onChange={(e) => handleRadioChange('budget', e.target.value)} />
                                <MDBRadio name="budget" label="Moyen" id="medium" value="medium" onChange={(e) => handleRadioChange('budget', e.target.value)} />
                                <MDBRadio name="budget" label="Élevé" id="high" value="high" onChange={(e) => handleRadioChange('budget', e.target.value)} />
                              </div>
                            </div>
  
                            <div className="mb-4">
                              <label className="form-label">Donner une description pour votre profil :</label>
                              <input
                                type="text"
                                className="form-control"
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                              />
                            </div>
  
                            <div className="mb-4">
                              <label className="form-label">Quelle est la distance maximale que vous êtes prêt(e) à parcourir pour une sortie ? (en km)</label>
                              <MDBRange
                                defaultValue={25}
                                min="0"
                                max="100"
                                step="25"
                                id="travelDistance"
                                value={formData.travelDistance}
                                onChange={(e) => handleInputChange('travelDistance', e.target.value)}
                              />
  
                              <div className="d-flex justify-content-between">
                                <span>0km</span>
                                <span>25km</span>
                                <span>50km</span>
                                <span>75km</span>
                                <span>100km</span>
                              </div>
                            </div>
  
                            <MDBBtn className="mt-3 w-100" size='lg' onClick={handleSubmit}>Envoyer</MDBBtn>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    </MDBRow>
                  </MDBModalBody>
                </MDBModalContent>
              </MDBModalDialog>
            </MDBModal>
          </div>
      }}
    </UserAgent>
  );
  
};

export default Home;
