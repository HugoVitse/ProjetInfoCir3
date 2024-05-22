import React from 'react';
import { Link } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

const Login = () => {
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
