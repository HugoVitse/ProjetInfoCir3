import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import axios from 'axios';
import Config from '../config.json';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [basicModal, setBasicModal] = useState(false);

  const toggleOpen = () => setBasicModal(!basicModal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const wrapper = () => {
  //   toggleOpen();
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/register`, formData);
      console.log(response.data);
      navigate('/Login');

    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { }, []);

  return (

  
<MDBContainer fluid className="d-flex align-items-center justify-content-center vh-100 bg-theme">
      <MDBCard className="w-100 w-md-75" style={{ maxHeight: '90%' }}>
        <MDBRow className="g-0 h-100">

        <MDBCol md="6" className="d-none d-md-flex align-items-center justify-content-center p-0" style={{ maxHeight: '90vh' }}>
  <img src="https://cdn.shopify.com/s/files/1/0549/9614/0083/files/amis-en-boite-de-nuit.jpg?v=1653648187" alt="Sample" className="img-fluid" style={{ height: '100%', objectFit: 'cover' }} />
</MDBCol>

          <MDBCol size="12" md="6" className="d-flex align-items-center justify-content-center">
       <MDBCard className="shadow-3 w-100 m-0 h-100">
        <MDBCardBody className="p-5 d-flex flex-column justify-content-center">
          <h4 className="text-center mb-4" style={{ color: '#563d7c' }}>
            <strong>Inscription</strong> à Linx
          </h4>
          <form onSubmit={handleSubmit}>
                <MDBRow className="mb-4">
                  <MDBCol>
                    <MDBInput
                      label="First Name"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      style={{ borderBottom: '2px solid #563d7c', borderRadius: '0', boxShadow: 'none' }}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      label="Last Name"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      style={{ borderBottom: '2px solid #563d7c', borderRadius: '0', boxShadow: 'none' }}
                    />
                  </MDBCol>
                </MDBRow>
                <MDBInput
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="mb-4"
                  style={{ borderBottom: '2px solid #563d7c', borderRadius: '0', boxShadow: 'none' }}
                />
                <MDBInput
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mb-4"
                  style={{ borderBottom: '2px solid #563d7c', borderRadius: '0', boxShadow: 'none' }}
                />
                <MDBInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mb-4"
                  style={{ borderBottom: '2px solid #563d7c', borderRadius: '0', boxShadow: 'none' }}
                />
                <MDBInput
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mb-4"
                  style={{ borderBottom: '2px solid #563d7c', borderRadius: '0', boxShadow: 'none' }}
                />
                <MDBBtn
                  type="submit"
                  disabled={loading}
                  className="custom-btn custom-btn-primary mb-4" 
                  style={{width:'100%'}}
                >
                  {loading ? 'Registering...' : 'Register'}
                </MDBBtn>
                {error && <div className="text-danger text-center mt-3">{error}</div>}
                
              </form>
          <div className="text-center mt-3">
            <Link to="/Login" style={{ color: '#563d7c' }}><strong>Connectez-vous</strong></Link>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>

        </MDBRow>
        {/* <MDBModal show={basicModal} onHide={() => setBasicModal(false)} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle></MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>Inscription réussie !</MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={wrapper}>
                Continuer
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal> */}
      </MDBCard>
    </MDBContainer>

  );
};

export default Register;
