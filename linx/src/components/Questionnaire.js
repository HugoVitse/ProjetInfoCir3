import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBCheckbox, MDBRadio } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: '',
    confirmPassword: '',
    note: null // Ajout de la note dans le state
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://localhost/register', formData);
      console.log(response.data);
      alert(response.data);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
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

                <div className="mb-4">
                  <label className="form-label" style={{ color: '#8458B3' }}>Quelles activités aimez-vous ?</label>
                  {['Cinéma', 'Animaux', 'Théâtre', 'Danse', 'Manga/Anime', 'Séries', 'Échecs', 'Moto', 'Lecture', 'Jeux vidéos', 'Musique', 'BD/Comics', 'Voyager', 'Musées', 'Sortir entre amis', 'Sport', 'Nourriture', 'La mode'].map(activity => (
                    <MDBCheckbox key={activity} label={activity} id={activity.toLowerCase()} className="text-dark" style={{ color: '#8458B3' }} />
                  ))}
                </div>

                <div className="mb-4">
                  <label className="form-label" style={{ color: '#8458B3' }}>Question 2: Quel est votre moyen de transport préféré ?</label>
                  {['Voiture', 'Vélo', 'Transport public', 'À pied'].map((option, index) => (
                    <MDBRadio key={index} name="q2" id={`q2_${option.toLowerCase()}`} label={option} className="text-dark" style={{ color: '#8458B3' }} />
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
                        onChange={() => setFormData({ ...formData, note: index + 1 })}
                        className="text-dark"
                        style={{ color: '#8458B3' }}
                      />
                    ))}
                  </div>
                </div>

                <MDBBtn type="submit" color="light" className="w-100" disabled={loading} style={{ backgroundColor: '#8458B3' }}>Sign Up</MDBBtn>
              </form>
              {error && <div className="text-danger text-center mt-3">{error}</div>}
              <div className="text-center mt-3">
                <Link to="/login" className="text-decoration-none" style={{ color: '#8458B3' }}>Already have an account? Login</Link>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Register;
