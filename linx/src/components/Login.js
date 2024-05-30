import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import { MDBContainer, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";


const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const retrieveCookie = ()=>{
    const token = Cookies.get("jwt")
    console.log(token)
    try{
      const decodedToken = jwtDecode(token);
      navigate("/")
      console.log(decodedToken)
    }
    catch{
      
    }


  }

  useEffect(()=>{
    retrieveCookie()
  },[])

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }
  
    setLoading(true); // Set loading state
  
    try {
      const response = await axios.post('http://localhost/login',{ email: email, password: password },{withCredentials:true});
      console.log(response.data);
      console.log(response.status)
      if (response.status === 200) {
        // Redirection vers la page d'accueil
        window.location.href = '/'; // Redirection vers la page d'accueil
      } else {
        console.log(response.status)
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
    <MDBContainer fluid className="d-flex align-items-center justify-content-center h-100 mt-5">
      <MDBCol md="7" lg="7" className="mx-auto">
        <MDBCard className={`shadow ${error ? 'w-100' : ''}`}>
          <MDBCardBody className="p-5">
            <h2 className="text-center mb-4">Login</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-4 mt-4">
                <MDBInput
                  label="Email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                />
              </div>
              <div className="text-center mb-2">
                <MDBBtn color="primary" type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </MDBBtn>
              </div>
            </form>
            <div className="text-center mt-3">
              <Link to="/Register">Don't have an account? Sign Up</Link>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBContainer>
  );
}

export default Login;