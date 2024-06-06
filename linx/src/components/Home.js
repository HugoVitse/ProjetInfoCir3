import React, { useState, useEffect } from 'react';
import {
  MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardText,
  MDBTypography, MDBRadio, MDBRange, MDBModalFooter, MDBBtn, MDBModalTitle,
  MDBCheckbox, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalBody
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import {jwtDecode} from "jwt-decode";
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Modal, Ripple, initMDB } from 'mdb-ui-kit';

const Home = () => {
  const [basicModal, setBasicModal] = useState(false);
  const toggleOpen = () => setBasicModal(!basicModal);
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [comptModal, setComptModal] = useState(0)
  const [formData, setFormData] = useState({
    activities: [],
    note: 10,
    preferredTime: '',
    groupSize: '',
    placeType: '',
    budget: '',
    description: '',
    travelDistance: 25,
  });

  const handleCheckboxChange = (activity) => {
    setFormData((prevData) => ({
      ...prevData,
      activities: prevData.activities.includes(activity)
        ? prevData.activities.filter((a) => a !== activity)
        : [...prevData.activities, activity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost/fillquestionnaire', formData, { withCredentials: true });
      toggleOpen()
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
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

  const retrieveCookie = () => {
    const token = Cookies.get("jwt")
    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken)
    }
    catch {
      navigate("/Login")
    }
  }

  useEffect(() => {
    const fnc = async () => {
      retrieveCookie()
      try {
        const response = await axios.get('http://localhost/infos', { withCredentials: true });
        console.log(response.data.firstLogin);
        if (response.data.firstLogin) {
          toggleOpen()
        }
      }
      catch {

      }
    }
    fnc()

  }, [])

  return (
    <div className="flex-grow-1 vh-100">
      <MDBContainer fluid className="py-5 vh-100" style={{ backgroundColor: 'var(--bg-color)',  height: '100%' }}>
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7" className='w-100'>
            <header style={{
              position: 'relative',
              backgroundImage: 'url(https://78.media.tumblr.com/f254105ae6672e6252d171badfe14299/tumblr_mhiz6jgJ7N1rag9fdo1_500.gif)', // Example GIF URL, replace with your own
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '50vh', // Height of the section
              width: '100%',
              color: 'white'
            }}>
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                textAlign: 'right'
              }}>
                <h1><strong>ÇA VA CHAUFFER</strong></h1>
                <p>Nos modèles pour tout changer cet été.</p>
                <div>
                  <button style={{ marginRight: '10px' }}>Acheter</button>
                  <button>Enfant</button>
                </div>
              </div>
            </header>
            <MDBCard className="mb-4 custom-card">
              <MDBCardBody className="p-4 text-black custom-card">
                <MDBCardText className="lead fw-normal mb-1" style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>
                  Bonjour, {firstName} ! Bienvenue sur Linx
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>

            <MDBRow className="mt-4">
              <MDBCol md="6" className="mb-4">
                <MDBCard className="custom-card">
                  <MDBCardBody className="p-4 text-black custom-card">
                    <MDBTypography tag="h5" className="custom-text">Prochains événements</MDBTypography>
                    <hr />
                    <MDBCardText>Contenu des prochains événements</MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              <MDBCol md="6" className="mb-4">
                <MDBCard className="custom-card">
                  <MDBCardBody className="p-4 text-black custom-card">
                    <MDBTypography tag="h5" className="custom-text">Deuxième case</MDBTypography>
                    <hr />
                    <MDBCardText>Contenu de la deuxième case</MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>

            <MDBRow className="mt-4">
              <MDBCol md="6" className="mb-4">
                <MDBCard className="custom-card">
                  <MDBCardBody className="p-4 text-black custom-card">
                    <MDBTypography tag="h5" className="custom-text">Troisième case</MDBTypography>
                    <hr />
                    <MDBCardText>Contenu de la troisième case</MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              <MDBCol md="6" className="mb-4">
                <MDBCard className="custom-card">
                  <MDBCardBody className="p-4 text-black custom-card">
                    <MDBTypography tag="h5" className="custom-text">Quatrième case</MDBTypography>
                    <hr />
                    <MDBCardText>Contenu de la quatrième case</MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>

            <MDBRow className="mt-4">
              <MDBCol md="6" className="mb-4">
                <MDBCard className="custom-card">
                  <MDBCardBody className="p-4 text-black custom-card">
                    <MDBTypography tag="h5" className="custom-text">Cinquième case</MDBTypography>
                    <hr />
                    <MDBCardText>Contenu de la cinquième case</MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              <MDBCol md="6" className="mb-4">
                <MDBCard className="custom-card">
                  <MDBCardBody className="p-4 text-black custom-card">
                    <MDBTypography tag="h5" className="custom-text">Sixième case</MDBTypography>
                    <hr />
                    <MDBCardText>Contenu de la sixième case</MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default Home;
