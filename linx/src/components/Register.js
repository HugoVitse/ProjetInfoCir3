import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MDBContainer, MDBCol, MDBCardBody, MDBInput, MDBBtn, MDBCard } from 'mdb-react-ui-kit';
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
      <MDBContainer fluid className="vm100 d-flex align-items-center justify-content-center">
        <MDBCol md="8" lg="8" className=" mx-auto">
          <MDBCard className="m-5" shadow="3">
            <MDBCardBody>
              <h2 className="text-center mb-4">Sign Up</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <MDBInput label="Nom" type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                  <MDBInput label="Prénom" type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                  <MDBInput label="Date de naissance" type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                  <MDBInput label="Adresse électronique" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                  <MDBInput label="Mot de passe" type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                  <MDBInput label="Confirmer le mot de passe" type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>
                <div className="text-center mb-2">
                  <MDBBtn type="submit" color="primary" disabled={loading}>Sign Up</MDBBtn>
                </div>
              </form>
              {error && <div className="text-danger text-center mt-3">{error}</div>}
              <div className="text-center mt-3">
                <Link to="/login" className="text-decoration-none" style={{ color: '#8458B3' }}>Already have an account? Login</Link>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBContainer>
  );
}

export default Register;