import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MDBRow, MDBCheckbox, MDBRadio, MDBRange, MDBContainer, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
} from 'mdb-react-ui-kit';
import { Modal, Ripple, initMDB } from 'mdb-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import axios from 'axios';
const Home = () => {

  const navigate = useNavigate();
  const [basicModal, setBasicModal] = useState(false);
  const toggleOpen = () => setBasicModal(!basicModal);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [comptModal,setComptModal] = useState(0)
  const [formData, setFormData] = useState({
    activities: [],
    note: 10,
    preferredTime: '',
    groupSize: '',
    placeType: '',
    budget: '',
    description: '',
    travelDistance: 25,
  });
  
   // Partie handle du questionnaire :
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
      const response = await axios.post('http://localhost/fillquestionnaire', formData,{withCredentials:true});
      toggleOpen()
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

  const retrieveCookie = ()=>{
    const token = Cookies.get("jwt")
    try{
      const decodedToken = jwtDecode(token);
      console.log(decodedToken)
    }
    catch{
      navigate("/Login")
    }


  }

  useEffect(()=>{
    const fnc = async ()=>{
      retrieveCookie()
      try{
        const response = await axios.get('http://localhost/infos',{withCredentials:true});
        console.log(response.data.firstLogin);
        if(response.data.firstLogin){
          toggleOpen()
        }
      }
      catch{
  
      }
    }
    fnc()
    
  },[])

 

  return (
    <div className="home-container">
      <div className="jumbotron jumbotron-fluid bg-dark text-light">
        <div className="container">
          <h1 className="display-4">Découvrez les événements à venir !</h1>
          <p className="lead">Explorez notre sélection d'événements passionnants pour des expériences inoubliables.</p>
          <Link to="/Catalogue" className="btn btn-primary">Voir les événements</Link>
        </div>
      </div>
      <div className="container mt-5">
        <h2>Des suggestions pour améliorer votre page d'accueil :</h2>
        <ul>
          <li>Afficher une liste d'événements populaires ou recommandés directement sur la page d'accueil.</li>
          <li>Intégrer un carrousel d'images mettant en valeur les moments forts de vos événements passés.</li>
          <li>Permettre aux utilisateurs de s'abonner à une newsletter pour recevoir des mises à jour sur les événements à venir.</li>
          <li>Inclure des témoignages ou des critiques d'utilisateurs sur des événements précédents pour renforcer la confiance.</li>
          <li>Proposer une fonctionnalité de recherche d'événements par catégorie, lieu ou date.</li>
          <li>Créer une section FAQ pour répondre aux questions courantes des visiteurs.</li>
          <li>Intégrer des boutons de partage sur les réseaux sociaux pour encourager les utilisateurs à partager leurs découvertes.</li>
        </ul>
      </div>
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
                              max="20"
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
                  <MDBBtn onClick={handleSubmit}>Finaliser</MDBBtn>
                </MDBModalFooter>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>
          
      </div>
  );
}

export default Home;
