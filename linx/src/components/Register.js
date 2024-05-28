import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MDBRow, MDBCheckbox, MDBRadio, MDBRange, MDBContainer, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
} from 'mdb-react-ui-kit';
import { Modal, Ripple, initMDB } from 'mdb-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import axios from 'axios';
initMDB({ Modal, Ripple });

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Partie questionnaire en dessous
    activities: [],
    note: 10,
    preferredTime: '',
    groupSize: '',
    placeType: '',
    budget: '',
    favoriteCuisine: '',
    travelDistance: 25,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Partie handle du questionnaire :
  const handleCheckboxChange = (activity) => {
    setFormData((prevData) => ({
      ...prevData,
      activities: prevData.activities.includes(activity)
        ? prevData.activities.filter((a) => a !== activity)
        : [...prevData.activities, activity],
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://localhost/register', formData);
      console.log(response.data);
      toggleModal(); // Ouvrir la fenêtre modale après l'inscription
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initMDB({ Modal, Ripple });
  }, []);

  return (
    <MDBContainer fluid className="d-flex align-items-center justify-content-center vh-100" style={{ background: 'linear-gradient(#2e006c, #003399)' }}>
      <MDBCard className="w-50">
        <MDBCardBody>
          <h2 className="text-center mb-4">Inscription</h2>
          <form onSubmit={handleSubmit}>
            <MDBRow className="mb-4">
              <MDBCol>
                <MDBInput label="First Name" type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </MDBCol>
              <MDBCol>
                <MDBInput label="Last Name" type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </MDBCol>
            </MDBRow>
            <MDBInput label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="mb-4" />
            <MDBInput label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required className="mb-4" />
            <MDBInput label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required className="mb-4" />
            <MDBInput label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="mb-4" />

            {/* Pop-up Questionnaire !!! */}
            <button type="button" className="btn btn-primary w-100" data-mdb-ripple-init data-mdb-modal-init data-mdb-target="#exampleModal" disabled={loading}>
              Valider
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Questionnaire</h5>
                    <button type="button" className="btn-close" data-mdb-ripple-init data-mdb-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="container">
                      <div className="row">
                        <div className="col-md-10 mx-auto">
                          <div className="mb-4">
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
                              <label className="form-label">Quelle est votre cuisine préférée ?</label>
                              <input
                                type="text"
                                className="form-control"
                                id="favoriteCuisine"
                                value={formData.favoriteCuisine}
                                onChange={(e) => handleInputChange('favoriteCuisine', e.target.value)}
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
                 </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" data-mdb-ripple-init onClick={handleSubmit}>Finaliser</button>
      </div>
    </div>
  </div>
</div>
            {/* Fin Pop-up */}

          </form>
          {error && <div className="text-danger text-center mt-3">{error}</div>}
          <div className="text-center mt-3">
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </MDBCardBody>
      </MDBCard>

      <MDBModal show={modalOpen} getOpenState={(e) => setModalOpen(e)} tabIndex="-1">
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Registration Successful</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={toggleModal}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <p>Your registration was successful!</p>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleModal}>Close</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </MDBContainer>
  );
}

export default Register;
