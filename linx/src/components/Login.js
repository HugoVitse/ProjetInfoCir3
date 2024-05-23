import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }

    setLoading(true); // Set loading state

    try {
      const response = await axios.post('https://localhost/login', {email: email,password: password});
      console.log(response.data);
      if (response.status == 200) {
        alert('Login successful!');
        // Redirect to another page or perform other actions on successful login
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('There was an error logging in!', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <MDBContainer fluid className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <MDBRow>
        <MDBCol md="10" lg="8" className="mx-auto">
          <MDBCard className="shadow-3">
            <MDBCardBody className="p-5">
              <h2 className="text-center mb-4">Login</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                  <MDBInput label="Email" type="email" id="email" required />
                </div>
                <div className="mb-4">
                  <MDBInput label="Password" type="password" id="password" required />
                </div>
                <MDBBtn type="submit" color="primary" className="w-100">Login</MDBBtn>
              </form>
              <div className="text-center mt-3">
                <Link to="/signup" className="text-decoration-none">Don't have an account? Sign Up</Link>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
