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
    <div style={{height:'100%'}}>
    <MDBContainer fluid className="align-items-center" style={{height:'100%', background: 'linear-gradient(#2e006c, #003399)'}}>
      <MDBCardBody style={{ height:'100%', borderRadius: '15px' }}>
              <h2 className="text-center mb-4" style={{ color: '#FFFFFF' }}>Sign Up</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <MDBInput label="Nom" type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ borderRadius: '10px', backgroundColor: '#ffffff', color: '#8458B3' }} labelClass="text-dark" />
                </div>

                <div className="mb-4">
                  <MDBInput label="Prénom" type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ borderRadius: '10px', backgroundColor: '#ffffff', color: '#8458B3' }} labelClass="text-dark" />
                </div>

                <div className="mb-4">
                  <MDBInput label="Date de naissance" type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required style={{ borderRadius: '10px', backgroundColor: '#ffffff', color: '#8458B3' }} labelClass="text-dark" />
                </div>

                <div className="mb-4">
                  <MDBInput label="Adresse électronique" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required style={{ borderRadius: '10px', backgroundColor: '#ffffff', color: '#8458B3' }} labelClass="text-dark" />
                </div>

                <div className="mb-4">
                  <MDBInput label="Mot de passe" type="password" id="password" name="password" value={formData.password} onChange={handleChange} required style={{ borderRadius: '10px', backgroundColor: '#ffffff', color: '#8458B3' }} labelClass="text-dark" />
                </div>

                <div className="mb-4">
                  <MDBInput label="Confirmer le mot de passe" type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={{ borderRadius: '10px', backgroundColor: '#ffffff', color: '#8458B3' }} labelClass="text-dark" />
                </div>

                
                <MDBBtn type="submit" color="light" className="w-100" disabled={loading} style={{ backgroundColor: '#8458B3' }}>Sign Up</MDBBtn>
              </form>
              {error && <div className="text-danger text-center mt-3">{error}</div>}
              <div className="text-center mt-3">
                <Link to="/login" className="text-decoration-none" style={{ color: '#8458B3' }}>Already have an account? Login</Link>
              </div>
      </MDBCardBody>
    </MDBContainer>
    </div>
  );
}

export default Register;
