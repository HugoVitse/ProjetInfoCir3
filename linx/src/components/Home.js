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
import Config from '../config.json'


const Home = () => {
  const [basicModal, setBasicModal] = useState(false);
  const toggleOpen = () => setBasicModal(!basicModal);
  const [lastName, setLastName] = useState('');
  const [email, setemail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedUnInterests, setSelectedUnInterests] = useState([]);
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

  const interestsList = [
    'Cinéma', 'Attractions', 'Animaux', 'Théâtre', 'Danse', 'Manga/Anime', 'Séries', 'Échecs',
    'Moto', 'Lecture', 'Jeux vidéos', 'Musique', 'BD/Comics', 'Voyager', 'Musées', 'Sortir entre amis',
    'Sport', 'Nourriture', 'La mode'
  ];

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
      await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/fillquestionnaire`, formData, { withCredentials: true });

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
    } catch {
      navigate("/Login");
    }
  };

  useEffect(() => {
    const fnc = async () => {
      retrieveCookie();
      try {
        const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`, { withCredentials: true });
        setFirstName(response.data.firstName || '');
        setLastName(response.data.lastName || '');
        setSelectedInterests(response.data.activities || []);
        setSelectedUnInterests(interestsList.filter((interest)=>!response.data.activities.includes(interest)) || []);
        setemail(response.data.email || '')
        setPp(response.data.image || '');
        if (response.data.firstLogin) {
          toggleOpen();
        }

        const eventsResponse = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/evenements`, { withCredentials: true });

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
      await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/ParticipantDelete`, { withCredentials: true });

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
    try {
      await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/EventDelete`, {id: id}, { withCredentials: true });

      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const interestEmojis = {
    Cinéma: '🎬',
    Attractions: '🎡',
    Animaux: '🐾',
    Théâtre: '🎭',
    Danse: '💃',
    
    'Manga/Anime': '📚',
    Séries: '📺',
    Échecs: '♟️',
    Moto: '🏍️',
    Lecture: '📖',
    'Jeux vidéos': '🎮',
    Musique: '🎵',
    'BD/Comics': '📚',
    Voyager: '✈️',
    Musées: '🏛️',
    'Sortir entre amis': '👫',
    Sport: '🏅',
    Nourriture: '🍔',
    'La mode': '👗'
  };

  const renderInterestCards = () => {
    return selectedInterests.map((interest, index) => (
      <MDBCol md="6" className="mb-4" key={index}>
        <MDBCard className="text-theme border border-primary">
          <MDBCardBody className="p-4 bg-theme-nuance2 text-theme">
            <div className="d-flex align-items-center mb-3">
              <span role="img" aria-label={interest} style={{ fontSize: '2rem', marginRight: '10px' }}>
                {interestEmojis[interest]}
              </span>
              <MDBTypography tag="h4" className="text-theme font-weight-bold">
                {interest}
              </MDBTypography>
            </div>
            <hr className='barreHr' /> 
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

  const renderUnInterestCards = () => {
    return selectedUnInterests.map((interest, index) => (
      <MDBCol md="6" className="mb-4" key={index}>
        <MDBCard className="text-theme border border-primary">
          <MDBCardBody className="p-4 bg-theme-nuance2 text-theme">
            <div className="d-flex align-items-center mb-3">
              <span role="img" aria-label={interest} style={{ fontSize: '2rem', marginRight: '10px' }}>
                {interestEmojis[interest]}
              </span>
              <MDBTypography tag="h4" className="text-theme font-weight-bold">
                {interest}
              </MDBTypography>
            </div>
            <hr className='barreHr' /> 
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
                    backgroundImage: 'url(https://i.gifer.com/5Jau.gif)',
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
                    overflow: 'hidden',
                    boxShadow: '0 10px 10px 5px #aaaaaa'
                  }}>
                    <div>
                      <h1>Bienvenue sur Linx, {firstName} {lastName}.</h1>
                      <h2>Le lieu parfait pour se faire des amis !</h2>
                    </div>
                  </header>
                </MDBCol>
                <MDBCol lg="8" className="mb-4 ">
                  <MDBCard className="text-theme border border-primary">
                    <MDBCardBody className="p-4 bg-theme-nuance">
                      <MDBTypography tag="h4" className="text-theme font-weight-bold">
                        <strong>Vos intérêts sélectionnés</strong>
                      </MDBTypography>
                      <hr />
                      <MDBRow>
                        {renderInterestCards()}
                      </MDBRow>
              
                    </MDBCardBody>
                  </MDBCard>
                  <MDBCard className="mt-5 text-theme border border-primary">
                    <MDBCardBody className="p-4 bg-theme-nuance">
                      <MDBTypography tag="h4" className="text-theme font-weight-bold">
                        <strong>Autres intérêts</strong>
                      </MDBTypography>
                      <hr />
                      <MDBRow>
                        {renderUnInterestCards()}
                      </MDBRow>
              
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBContainer>

            {/* Pop-up Questionnaire !!! */}
      <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
        <MDBModalDialog size="xl" className="vh-80">
          <MDBModalContent>
            <MDBModalHeader className='bg-theme-nuance'>
              <MDBModalTitle><strong>Questionnaire</strong></MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>

            <MDBModalBody className='bg-theme'>
              <MDBRow className="w-100">
                <MDBCol md="10" lg="8" className="mx-auto">
                  <MDBCard>
                    <MDBCardBody className="p-5 bg-theme-nuance2 text-theme">
                      <h3 className="text-center mb-4"><strong>Questionnaire</strong></h3>
                      <hr className='barreHr'/>
                      <div className="mb-4">
                        <label className="form-label text-theme"><strong>Quelles activités aimez-vous ?</strong></label>
                        {['Cinéma', 'Attractions', 'Animaux', 'Théâtre', 'Danse', 'Manga/Anime', 'Séries', 'Échecs', 'Moto', 'Lecture', 'Jeux vidéos', 'Musique', 'BD/Comics', 'Voyager', 'Musées', 'Sortir entre amis', 'Sport', 'Nourriture', 'La mode'].map((activity) => (
                          <MDBCheckbox
                            key={activity}
                            label={activity}
                            id={activity.toLowerCase()}
                            onChange={() => handleCheckboxChange(activity)}
                          />
                        ))}
                      </div>

                      <div className="mb-4">
                        <label className="form-label text-theme"><strong>Notez votre état actuel :</strong></label>
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
                        <label className="form-label text-theme"><strong>Préférez-vous les activités en petit ou en grand groupe ?</strong></label>
                        <MDBRadio name="groupSize" label="Petit groupe" id="petitcomite" value="petitcomite" onChange={(e) => handleRadioChange('groupSize', e.target.value)} />
                        <MDBRadio name="groupSize" label="Grand groupe" id="grandcomite" value="grandcomite" onChange={(e) => handleRadioChange('groupSize', e.target.value)} />
                      </div>

                      <div className="mb-4">
                        <label className="form-label text-theme"><strong>Quel moment de la journée préférez-vous pour les sorties ?</strong></label>
                        <MDBRadio name="preferredTime" label="Matin" id="morning" value="morning" onChange={(e) => handleRadioChange('preferredTime', e.target.value)} />
                        <MDBRadio name="preferredTime" label="Après-midi" id="afternoon" value="afternoon" onChange={(e) => handleRadioChange('preferredTime', e.target.value)} />
                        <MDBRadio name="preferredTime" label="Soir" id="evening" value="evening" onChange={(e) => handleRadioChange('preferredTime', e.target.value)} />
                      </div>

                      <div className="mb-4">
                        <label className="form-label text-theme"><strong>Préférez-vous les activités en intérieur ou en extérieur ?</strong></label>
                        <MDBRadio name="placeType" label="Intérieur" id="indoor" value="indoor" onChange={(e) => handleRadioChange('placeType', e.target.value)} />
                        <MDBRadio name="placeType" label="Extérieur" id="outdoor" value="outdoor" onChange={(e) => handleRadioChange('placeType', e.target.value)} />
                      </div>

                      <div className="mb-4">
                        <label className="form-label text-theme"><strong>Quel est votre budget pour les sorties ?</strong></label>
                        <MDBRadio name="budget" label="Bas" id="low" value="low" onChange={(e) => handleRadioChange('budget', e.target.value)} />
                        <MDBRadio name="budget" label="Moyen" id="medium" value="medium" onChange={(e) => handleRadioChange('budget', e.target.value)} />
                        <MDBRadio name="budget" label="Élevé" id="high" value="high" onChange={(e) => handleRadioChange('budget', e.target.value)} />
                      </div>

                      <div className="mb-4">
                        <label className="form-label text-theme"><strong>Donner une description pour votre profile :</strong></label>
                        <input
                          type="text"
                          className="form-control"
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label text-theme"><strong>Quelle est la distance maximale que vous êtes prêt(e) à parcourir pour une sortie ? (en km)</strong></label>
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

                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBModalBody>
            <MDBModalFooter className='bg-theme-nuance'>
              <MDBBtn onClick={handleSubmit} disabled={!isFormComplete()}>Finaliser</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
          </div>;
      }}
    </UserAgent>
  );
};

export default Home;
