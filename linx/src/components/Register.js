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
    <MDBContainer fluid className="d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px 0' }}>
      <MDBRow className="w-100">
        <MDBCol md="10" lg="8" className="mx-auto">
          <MDBCard className="shadow-3" style={{ borderRadius: '15px' }}>
            <MDBCardBody className="p-5" style={{ backgroundColor: '#f8f9fa' }}>

              <h2 className="text-center mb-4" style={{ color: '#343a40' }}>Sign Up</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <MDBInput label="Nom" type="text" id="firstName" value={formData.firstName} name="firstName" required style={{ borderRadius: '10px', borderColor: '#ced4da' }} onChange={handleChange} />
                </div>

                <div className="mb-4">
                  <MDBInput label="Prénom" type="text" id="lastName" value={formData.lastName} name="lastName" required style={{ borderRadius: '10px', borderColor: '#ced4da' }} onChange={handleChange} />
                </div>

                <div className="mb-4">
                  <MDBInput label="Date de naissance" type="date" id="datenaissance" value={formData.dateOfBirth} name="dateOfBirth" required style={{ borderRadius: '10px', borderColor: '#ced4da' }} onChange={handleChange} />
                </div>

                <div className="mb-4">
                  <MDBInput label="Adresse électronique" type="email" id="email" value={formData.email} name="email" required style={{ borderRadius: '10px', borderColor: '#ced4da' }} onChange={handleChange} />
                </div>

                <div className="mb-4">
                  <MDBInput label="Mot de passe" type="password" id="password" value={formData.password} name="password" required style={{ borderRadius: '10px', borderColor: '#ced4da' }} onChange={handleChange} />
                </div>

                <div className="mb-4">
                  <MDBInput label="Confirmer le mot de passe" type="password" value={formData.confirmpassword}id="confirmPassword" name="confirmPassword" required style={{ borderRadius: '10px', borderColor: '#ced4da' }} onChange={handleChange} />
                </div>

                <h3 className="text-center mb-4" style={{ color: '#343a40' }}>Questionnaire</h3>

                <div className="mb-4">
                  <label className="form-label" style={{ color: '#343a40' }}>Quelles activités aimez-vous ?</label>
                  <MDBCheckbox label="Cinéma" id="cinema" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="Animaux" id="animaux" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="Théâtre" id="theatre" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="Danse" id="danse" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="Manga/Anime" id="manga" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="Séries" id="series" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="Échecs" id="echecs" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="Moto" id="moto" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="Lecture" id="lecture" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="Jeux vidéos" id="jeuxvideos" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="Musique" id="musique" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="BD/Comics" id="bdcomics" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="Voyager" id="voyager" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="Musées" id="" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="Sortir entre amis" id="sorties" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="Sport" id="" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="Nourriture" id="nourriture" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="La mode" id="mode" style={{ color: '#343a40' }} />
                </div>

                <div className="mb-4">
                  <label className="form-label" style={{ color: '#343a40' }}>Question 2: jqslnc,eqsfc ?</label>
                  <MDBRadio name="q2" id="q2_car" label="zksdfj" style={{ color: '#343a40' }} />
                  <MDBRadio name="q2" id="q2_bike" label="ksfdsvx" style={{ color: '#343a40' }} />
                  <MDBRadio name="q2" id="q2_public" label="rsmdkgjv" style={{ color: '#343a40' }} />
                  <MDBRadio name="q2" id="q2_walk" label="rpsmjdgk" style={{ color: '#343a40' }} />
                </div>

                <div className="mb-4">
                  <label className="form-label" style={{ color: '#343a40' }}>Notez votre état actuel :</label>
                  <div>
                    {[...Array(10)].map((_, index) => (
                      <MDBRadio
                        key={index}
                        name="note"
                        label={`${index + 1}`}
                        style={{ color: '#343a40' }}
                        onClick={() => setFormData({ ...formData, note: index + 1 })}
                      />
                    ))}
                  </div>
                </div>

                <MDBBtn type="submit" color="dark" className="w-100" style={{ backgroundColor: '#343a40' }}>Sign Up</MDBBtn>
              </form>
              <div className="text-center mt-3">
                <Link to="/login" className="text-decoration-none">Already have an account? Login</Link>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Register;

