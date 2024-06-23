import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { MDBContainer, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBRow, MDBCarousel, MDBCarouselItem, MDBCarouselCaption } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Config from '../config.json';
import MobileDownload from './MobileDownload';
import { UserAgent } from "react-useragent";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const retrieveCookie = () => {
    const token = Cookies.get("jwt");
    console.log(token);
    try {
      const decodedToken = jwtDecode(token);
      navigate("/");
      console.log(decodedToken);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    retrieveCookie();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }

    setLoading(true); // Set loading state

    try {
      const response = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/login`, { email, password }, { withCredentials: true });
      console.log(response.data);
      console.log(response.status);
      if (response.status === 200) {
        // Redirection vers la page d'accueil
         window.location.href = '/'; // Redirection vers la page d'accueil
      } else {
        console.log(response.status);
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('There was an error logging in!', error);
      setError('Incorrect email or password. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <UserAgent>
    {({ ua }) => {
      return ua.mobile ? <MobileDownload /> :
    <MDBContainer fluid className="bg-theme d-flex align-items-center justify-content-center vh-100">
      <MDBCard className="w-100 w-md-75" style={{ maxHeight: '90%' }}>
        <MDBRow className="g-0 h-100">
          <MDBCol md="6" className="d-none d-md-flex align-items-center justify-content-center p-0 h-100">
            {/* Caroussel */}
            <MDBCarousel showControls showIndicators className="w-100 h-100">
              <MDBCarouselItem itemId={1}>
                <img
                  src='https://img.freepik.com/photos-gratuite/reve-nenuphar-pourpre-genere-par-ia_268835-8270.jpg?size=626&ext=jpg&ga=GA1.1.632798143.1713312000&semt=ais'
                  className='d-block w-100'
                  alt='First slide'
                  style={{ height: '100%', objectFit: 'cover' }}
                />
                <MDBCarouselCaption>
                  <h5>Bienvenue sur Linx</h5>
                  <p>Connectez vous pour vivre une expérience unique !</p>
                </MDBCarouselCaption>
              </MDBCarouselItem>
              <MDBCarouselItem itemId={2}>
                <img
                  src='https://img.freepik.com/premium-photo/group-purple-water-lilies-floating-top-pond-ai_431161-6222.jpg'
                  className='d-block w-100'
                  alt='Second slide'
                  style={{ height: '100%', objectFit: 'cover' }}
                />
                <MDBCarouselCaption>
                  <h5>Bienvenue sur Linx</h5>
                  <p>Connectez vous pour vivre une expérience unique !</p>
                </MDBCarouselCaption>
              </MDBCarouselItem>
              <MDBCarouselItem itemId={3}>
                <img
                  src='https://img.freepik.com/photos-premium/ciel-reve-faisant-tournoyer-fleurs_975256-616.jpg'
                  className='d-block w-100'
                  alt='Third slide'
                  style={{ height: '100%', objectFit: 'cover' }}
                />
                <MDBCarouselCaption>
                  <h5>Bienvenue sur Linx</h5>
                  <p>Connectez vous pour vivre une expérience unique !</p>
                </MDBCarouselCaption>
              </MDBCarouselItem>
            </MDBCarousel>
            {/* Fin Caroussel */}
          </MDBCol>
          <MDBCol size="12" md="6" className="d-flex align-items-center justify-content-center">
      <MDBCard className="shadow-3 w-100 m-0 h-100">
        <MDBCardBody className="p-5 d-flex flex-column justify-content-center bg-theme-nuance text-theme">
          <h4 className="text-center mb-4">
            <strong>Connexion</strong> à votre compte
          </h4>
          <form onSubmit={handleSubmit}>
            {error && <div className="text-danger mb-3">{error}</div>}
            <div className="form-group mb-4">
              <MDBInput
                label="Username"
                type="text"
                name="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control bg-light"
                style={{
                  borderBottom: '2px solid #563d7c',
                  borderRadius: '0',
                  boxShadow: 'none'
                }}
              />
            </div>
            <div className="form-group mb-4">
              <MDBInput
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control bg-light"
                style={{
                  borderBottom: '2px solid #563d7c',
                  borderRadius: '0',
                  boxShadow: 'none'
                }}
              />
            </div>
            <div className="text-center mb-2">
              <MDBBtn color="primary" className="custom-btn custom-btn-primary" style={{width:'100%'}} type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </MDBBtn>
            </div>
          </form>
          <div className="text-center mt-3">
            <Link to="/forgot-password" style={{ color: '#563d7c' }}>Mot de passe oublié ?</Link>
          </div>
          <div className="text-center mt-3">
            <Link to="/Register" className='text-theme'><strong>Inscrivez-vous</strong></Link>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
    }}
    </UserAgent>
  );
}

export default Login;
