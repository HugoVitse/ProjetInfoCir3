import React, { useState, useEffect } from 'react';
import {
  MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardText,
  MDBTypography, MDBRadio, MDBRange, MDBModalFooter, MDBBtn, MDBModalTitle,
  MDBCheckbox, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalBody
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [basicModal, setBasicModal] = useState(false);
  const toggleOpen = () => setBasicModal(!basicModal);
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    const fnc = async () => {
      retrieveCookie();
      try {
        const response = await axios.get('http://localhost/infos', { withCredentials: true });
        setFirstName(response.data.firstName || '');
        setLastName(response.data.lastName || '');
        setSelectedInterests(response.data.activities || []);
        if (response.data.firstLogin) {
          toggleOpen();
        }

        const eventsResponse = await axios.get('http://localhost/getEvents', { withCredentials: true });
        console.log(eventsResponse.data);
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

  const renderInterestCards = () => {
    return selectedInterests.map((interest, index) => (
      <MDBCol md="6" className="mb-4" key={index}>
        <MDBCard className="text-theme custom-card">
          <MDBCardBody className="p-4 custom-card">
            <MDBTypography tag="h5">{interest}</MDBTypography>
            <hr/>
            {events
              .filter(events => events.types === interest)
              .slice(0, 5)
              .map((events, index) => (
                <MDBCardText key={index} className="fw-bold mb-0">Titre de l'événement: {events.activity.title}</MDBCardText>
              ))}
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    ));
  };

  return (
    <div className="flex-grow-1 vh-100">
      <MDBContainer fluid className="py-5 vh-100 bg-theme" style={{ height: '100%' }}>
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7" className='w-100'>
            <MDBCard className="mb-4 custom-card">
              <MDBCardBody className="p-4 text-black custom-card">
                <MDBCardText className="lead fw-normal mb-1" style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>
                  Bonjour {firstName} {lastName} ! Bienvenue sur Linx
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>

            <MDBRow className="mt-4">
              <MDBCol md="6" className="mb-4">
                <MDBCard className="custom-card">
                  <MDBCardBody className="p-4 text-theme custom-card">
                    <MDBTypography tag="h5" > <strong>Prochains événements</strong></MDBTypography>
                    <hr />
                    <MDBCardText>Contenu des prochains événements</MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              {renderInterestCards()}
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {/* Pop-up Questionnaire !!! */}
      <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
        <MDBModalDialog size="xl" className="vh-80">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Questionnaire</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>

            <MDBModalBody>
              <MDBRow className="w-100">
                <MDBCol md="10" lg="8" className="mx-auto">
                  <MDBCard>
                    <MDBCardBody className="p-5">
                      <h3 className="text-center mb-4">Questionnaire</h3>
                      <div className="mb-4">
                        <label className="form-label">Quelles activités aimez-vous ?</label>
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
                        <MDBRadio name="groupSize" label="Petit groupe" id="petitcomite" value="petitcomite" onChange={(e) => handleRadioChange('groupSize', e.target.value)} />
                        <MDBRadio name="groupSize" label="Grand groupe" id="grandcomite" value="grandcomite" onChange={(e) => handleRadioChange('groupSize', e.target.value)} />
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Quel moment de la journée préférez-vous pour les sorties ?</label>
                        <MDBRadio name="preferredTime" label="Matin" id="morning" value="morning" onChange={(e) => handleRadioChange('preferredTime', e.target.value)} />
                        <MDBRadio name="preferredTime" label="Après-midi" id="afternoon" value="afternoon" onChange={(e) => handleRadioChange('preferredTime', e.target.value)} />
                        <MDBRadio name="preferredTime" label="Soir" id="evening" value="evening" onChange={(e) => handleRadioChange('preferredTime', e.target.value)} />
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Préférez-vous les activités en intérieur ou en extérieur ?</label>
                        <MDBRadio name="placeType" label="Intérieur" id="indoor" value="indoor" onChange={(e) => handleRadioChange('placeType', e.target.value)} />
                        <MDBRadio name="placeType" label="Extérieur" id="outdoor" value="outdoor" onChange={(e) => handleRadioChange('placeType', e.target.value)} />
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Quel est votre budget pour les sorties ?</label>
                        <MDBRadio name="budget" label="Bas" id="low" value="low" onChange={(e) => handleRadioChange('budget', e.target.value)} />
                        <MDBRadio name="budget" label="Moyen" id="medium" value="medium" onChange={(e) => handleRadioChange('budget', e.target.value)} />
                        <MDBRadio name="budget" label="Élevé" id="high" value="high" onChange={(e) => handleRadioChange('budget', e.target.value)} />
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Donner une description pour votre profile :</label>
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

                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn onClick={handleSubmit} disabled={!isFormComplete()}>Finaliser</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default Home;