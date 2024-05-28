import React, { useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBRange } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

const MoodTrackerQuestionnaire = () => {
  const [formData, setFormData] = useState({
    sleepQuality: null,
    stressLevel: null,
    energyLevel: null,
    socialInteraction: '',
    additionalActivity: '',
  });

  const handleSliderChange = (value, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: parseInt(value),
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData); // Just for testing purposes, replace with your submission logic
  };

  return (
    <MDBContainer fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', padding: '20px 0', background: '#f8f9fa' }}>
      <MDBRow className="w-100">
        <MDBCol md="8" lg="6" className="mx-auto">
          <MDBCard>
            <MDBCardBody className="p-5">
              <h3 className="text-center mb-4">Suivi quotidien de l'humeur</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="sleepQuality" className="form-label">Qualité du sommeil (note sur 10)</label>
                  <MDBRange id="sleepQuality" name="sleepQuality" min="0" max="10" value={formData.sleepQuality} onChange={(e) => handleSliderChange(e.target.value, 'sleepQuality')} />
                </div>
                <div className="mb-3">
                  <label htmlFor="stressLevel" className="form-label">Niveau de stress (note sur 10)</label>
                  <MDBRange id="stressLevel" name="stressLevel" min="0" max="10" value={formData.stressLevel} onChange={(e) => handleSliderChange(e.target.value, 'stressLevel')} />
                </div>
                <div className="mb-3">
                  <label htmlFor="energyLevel" className="form-label">Niveau d'énergie (note sur 10)</label>
                  <MDBRange id="energyLevel" name="energyLevel" min="0" max="10" value={formData.energyLevel} onChange={(e) => handleSliderChange(e.target.value, 'energyLevel')} />
                </div>
                <div className="mb-3">
                  <label htmlFor="socialInteraction" className="form-label">Avez-vous eu des interactions sociales aujourd'hui ? Si oui, décrivez brièvement.</label>
                  <textarea className="form-control" id="socialInteraction" name="socialInteraction" rows="3" value={formData.socialInteraction} onChange={handleInputChange}></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="additionalActivity" className="form-label">Activité(s) supplémentaire(s) réalisée(s) aujourd'hui</label>
                  <input type="text" className="form-control" id="additionalActivity" name="additionalActivity" value={formData.additionalActivity} onChange={handleInputChange} />
                </div>
                <MDBBtn type="submit" color="primary" className="w-100">Soumettre</MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default MoodTrackerQuestionnaire;
