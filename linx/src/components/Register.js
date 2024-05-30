import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import {
  MDBRow, MDBCheckbox, MDBRadio, MDBRange, MDBContainer, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
} from 'mdb-react-ui-kit';
import { Modal, Ripple, initMDB } from 'mdb-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import axios from 'axios';
initMDB({ Modal, Ripple });

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [basicModal, setBasicModal] = useState(false);

  const toggleOpen = () => setBasicModal(!basicModal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const wrapper = () =>{
    toggleOpen();
    navigate("/")

  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost/register', formData);
      console.log(response.data);
      toggleOpen(); // Ouvrir la fenêtre modale après l'inscription
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
</form>
            
            <button type="button" className="btn btn-primary w-100"  onClick={handleSubmit} disabled={loading}>
              Valider
            </button>
            
        

          
          {error && <div className="text-danger text-center mt-3">{error}</div>}
          <div className="text-center mt-3">
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </MDBCardBody>
      </MDBCard>

      <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle></MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>Inscription réussie !</MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={wrapper}>
                Continuer
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </MDBContainer>
  );
}

export default Register;