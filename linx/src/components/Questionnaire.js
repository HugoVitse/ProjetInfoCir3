import React, { useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBCheckbox, MDBRadio, MDBRange } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import axios from 'axios';

const Questionnaire = () => {
  const [formData, setFormData] = useState({
    userId: '6650b1770849cca176794430', // Assurez-vous que l'ID utilisateur est correct
    activities: [],
    note: 10,
    preferredTime: '',
    groupSize: '',
    placeType: '',
    budget: '',
    favoriteCuisine: '',
    travelDistance: 25,
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

  const handleInputChange = (name, value) => {
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
      const response = await axios.post('https://localhost/questionnaire', formData);
      console.log(response.data);
      alert(response.data);
    } catch (err) {
      console.log("coucou");
      console.log(formData);
      setError('Une erreur est survenue lors de la soumission du formulaire');
      setLoading(false);
    }
  };

  return (
    <MDBContainer fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', padding: '20px 0', background: '#f8f9fa' }}>
      <MDBRow className="w-100">
        <MDBCol md="10" lg="8" className="mx-auto">
          <MDBCard>
            <MDBCardBody className="p-5">
              <h3 className="text-center mb-4">Questionnaire</h3>
              <form onSubmit={handleSubmit}>

                {/* Question activités/goûts */}
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

                {/* Question Mood Actuel */}
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

                {/* Sorties petit/grand comité */}
                <div className="mb-4">
                  <label className="form-label">Préférez-vous les activités en petit ou en grand groupe ?</label>
                  <MDBRadio name="groupSize" label="Petit groupe" id="petitcomite" value="petitcomite" onChange={(e) => handleRadioChange('groupSize', e.target.value)} />
                  <MDBRadio name="groupSize" label="Grand groupe" id="grandcomite" value="grandcomite" onChange={(e) => handleRadioChange('groupSize', e.target.value)} />
                </div>

                {/* Question moments journée */}
                <div className="mb-4">
                  <label className="form-label">Quel moment de la journée préférez-vous pour les sorties ?</label>
                  <MDBRadio name="preferredTime" label="Matin" id="morning" value="morning" onChange={(e) => handleRadioChange('preferredTime', e.target.value)} />
                  <MDBRadio name="preferredTime" label="Après-midi" id="afternoon" value="afternoon" onChange={(e) => handleRadioChange('preferredTime', e.target.value)} />
                  <MDBRadio name="preferredTime" label="Soir" id="evening" value="evening" onChange={(e) => handleRadioChange('preferredTime', e.target.value)} />
                </div>

                {/* Question intérieur/extérieur */}
                <div className="mb-4">
                  <label className="form-label">Préférez-vous les activités en intérieur ou en extérieur ?</label>
                  <MDBRadio name="placeType" label="Intérieur" id="indoor" value="indoor" onChange={(e) => handleRadioChange('placeType', e.target.value)} />
                  <MDBRadio name="placeType" label="Extérieur" id="outdoor" value="outdoor" onChange={(e) => handleRadioChange('placeType', e.target.value)} />
                </div>

                {/* Question budget */}
                <div className="mb-4">
                  <label className="form-label">Quel est votre budget pour les sorties ?</label>
                  <MDBRadio name="budget" label="Bas" id="low" value="low" onChange={(e) => handleRadioChange('budget', e.target.value)} />
                  <MDBRadio name="budget" label="Moyen" id="medium" value="medium" onChange={(e) => handleRadioChange('budget', e.target.value)} />
                  <MDBRadio name="budget" label="Élevé" id="high" value="high" onChange={(e) => handleRadioChange('budget', e.target.value)} />
                </div>

                {/* Question cuisine préférée */}
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


                {/* Question distance */}
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

                <MDBBtn type="submit" color="primary" className="w-100" disabled={loading}>
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
