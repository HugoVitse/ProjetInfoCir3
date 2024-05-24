import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBCheckbox, MDBRadio } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import axios from 'axios';

const Questionnaire = () => {
  const [formData, setFormData] = useState({
    activities: [],
    note: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Envoyer les données du formulaire à une API ou autre
      await axios.post('/votre-url', formData);
      setLoading(false);
    } catch (err) {
      setError('Une erreur est survenue lors de la soumission du formulaire');
      setLoading(false);
    }
  };

  return (
    <MDBContainer fluid className="d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(#2e006c, #003399)', minHeight: '100vh', padding: '20px 0' }}>
      <MDBRow className="w-100">
        <MDBCol md="10" lg="8" className="mx-auto">
          <MDBCard className="shadow-3" style={{ borderRadius: '15px', backgroundColor: '#d0bdf4' }}>
            <MDBCardBody className="p-5" style={{ borderRadius: '15px', background: 'linear-gradient(#191970, jaune)' }}>
              <h3 className="text-center mb-4" style={{ color: '#8458B3' }}>Questionnaire</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label" style={{ color: '#8458B3' }}>Quelles activités aimez-vous ?</label>
                  {['Cinéma', 'Animaux', 'Théâtre', 'Danse', 'Manga/Anime', 'Séries', 'Échecs', 'Moto', 'Lecture', 'Jeux vidéos', 'Musique', 'BD/Comics', 'Voyager', 'Musées', 'Sortir entre amis', 'Sport', 'Nourriture', 'La mode'].map((activity) => (
                    <MDBCheckbox
                      key={activity}
                      label={activity}
                      id={activity.toLowerCase()}
                      className="text-dark"
                      style={{ color: '#8458B3' }}
                      onChange={() => handleCheckboxChange(activity)}
                    />
                  ))}
                </div>

                <div className="mb-4">
                  <label className="form-label" style={{ color: '#8458B3' }}>Notez votre état actuel :</label>
                  <div className="d-flex justify-content-between">
                    {[...Array(10)].map((_, index) => (
                      <MDBRadio
                        key={index}
                        name="note"
                        label={`${index + 1}`}
                        id={`note_${index + 1}`}
                        value={index + 1}
                        onChange={() => handleRadioChange('note', index + 1)}
                        className="text-dark"
                        style={{ color: '#8458B3' }}
                      />
                    ))}
                  </div>
                </div>

                <MDBBtn type="submit" color="light" className="w-100" disabled={loading} style={{ backgroundColor: '#8458B3' }}>
                  Valider vos réponses
                </MDBBtn>
              </form>
              {error && <div className="text-danger text-center mt-3">{error}</div>}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Questionnaire;
