import React from 'react';
import { Link } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBCheckbox, MDBRadio } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

const Register = () => {
  return (
    <MDBContainer fluid className="d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px 0' }}>
      <MDBRow className="w-100">
        <MDBCol md="10" lg="8" className="mx-auto">
          <MDBCard className="shadow-3" style={{ borderRadius: '15px' }}>
            <MDBCardBody className="p-5" style={{ backgroundColor: '#f8f9fa' }}>
              <h2 className="text-center mb-4" style={{ color: '#343a40' }}>Sign Up</h2>
              <form>
                <div className="mb-4">
                  <MDBInput label="First Name" type="text" id="firstName" required style={{ borderRadius: '10px', borderColor: '#ced4da' }} />
                </div>
                <div className="mb-4">
                  <MDBInput label="Last Name" type="text" id="lastName" required style={{ borderRadius: '10px', borderColor: '#ced4da' }} />
                </div>
                <div className="mb-4">
                  <MDBInput label="Date of Birth" type="date" id="dateOfBirth" required style={{ borderRadius: '10px', borderColor: '#ced4da' }} />
                </div>
                <div className="mb-4">
                  <MDBInput label="Email" type="email" id="email" required style={{ borderRadius: '10px', borderColor: '#ced4da' }} />
                </div>
                <div className="mb-4">
                  <MDBInput label="Password" type="password" id="password" required style={{ borderRadius: '10px', borderColor: '#ced4da' }} />
                </div>
                <div className="mb-4">
                  <MDBInput label="Confirm Password" type="password" id="confirmPassword" required style={{ borderRadius: '10px', borderColor: '#ced4da' }} />
                </div>

                <h3 className="text-center mb-4" style={{ color: '#343a40' }}>Questionnaire</h3>

                <div className="mb-4">
                  <label className="form-label" style={{ color: '#343a40' }}>Question 1: Do you like sports?</label>
                  <MDBCheckbox label="Yes" id="q1_yes" style={{ color: '#343a40' }} />
                  <MDBCheckbox label="No" id="q1_no" style={{ color: '#343a40' }} />
                </div>

                <div className="mb-4">
                  <label className="form-label" style={{ color: '#343a40' }}>Question 2: What is your preferred mode of transportation?</label>
                  <MDBRadio name="q2" id="q2_car" label="Car" style={{ color: '#343a40' }} />
                  <MDBRadio name="q2" id="q2_bike" label="Bike" style={{ color: '#343a40' }} />
                  <MDBRadio name="q2" id="q2_public" label="Public Transport" style={{ color: '#343a40' }} />
                  <MDBRadio name="q2" id="q2_walk" label="Walking" style={{ color: '#343a40' }} />
                </div>

                <div className="mb-4">
                  <label className="form-label" htmlFor="q3" style={{ color: '#343a40' }}>Question 3: Tell us about your hobbies.</label>
                  <MDBInput type="textarea" id="q3" rows="4" style={{ borderRadius: '10px', borderColor: '#ced4da' }} />
                </div>

                <MDBBtn type="submit" color="dark" className="w-100" style={{ backgroundColor: '#343a40' }}>Sign Up</MDBBtn>
              </form>
              <div className="text-center mt-3">
                <Link to="/login" className="text-decoration-none" style={{ color: '#343a40' }}>Already have an account? Login</Link>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Register;
