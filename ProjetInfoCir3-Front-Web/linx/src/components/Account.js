import React from 'react';
import { Link } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

const Account = () => {
  return (
    <MDBContainer fluid className="py-5">
      <MDBRow className="justify-content-center">
        <MDBCol md="10" lg="8">
          <MDBCard className="mb-4 shadow-3">
            <MDBCardBody>
              <h2 className="text-center mb-4">Mon Compte</h2>
              <MDBRow>
                <MDBCol md="4" className="text-center">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="Profile"
                    className="img-fluid rounded-circle mb-3"
                  />
                  <h4>John Doe</h4>
                  <p className="text-muted">johndoe@example.com</p>
                  <MDBBtn color="primary" className="mb-2">Edit Profile</MDBBtn>
                  <MDBBtn color="danger">Logout</MDBBtn>
                </MDBCol>
                <MDBCol md="8">
                  <MDBListGroup flush>
                    <MDBListGroupItem>
                      <strong>Nom : </strong>Doe
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <strong>Prénom : </strong>John
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <strong>Âge : </strong>34
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <strong>Description : </strong>
                      <p>
                        Passionné par la technologie et les voyages. Toujours curieux d'apprendre de nouvelles choses et de rencontrer de nouvelles personnes.
                      </p>
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <strong>Gouts : </strong>
                      <ul>
                        <li>Lecture</li>
                        <li>Voyages</li>
                        <li>Musique</li>
                        <li>Sport</li>
                      </ul>
                    </MDBListGroupItem>
                  </MDBListGroup>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
          <MDBCard className="mb-4 shadow-3">
            <MDBCardBody>
              <h4>Historique des événements</h4>
              <MDBListGroup flush>
                <MDBListGroupItem>
                  <strong>Événement 1 : </strong>Participation à la conférence sur la technologie
                </MDBListGroupItem>
                <MDBListGroupItem>
                  <strong>Événement 2 : </strong>Voyage d'affaires à Paris
                </MDBListGroupItem>
                <MDBListGroupItem>
                  <strong>Événement 3 : </strong>Webinaire sur le développement personnel
                </MDBListGroupItem>
              </MDBListGroup>
            </MDBCardBody>
          </MDBCard>
          <MDBCard className="shadow-3">
            <MDBCardBody>
              <h4>Account Settings</h4>
              <MDBListGroup flush>
                <MDBListGroupItem>
                  <Link to="/change-password" className="text-decoration-none">Change Password</Link>
                </MDBListGroupItem>
                <MDBListGroupItem>
                  <Link to="/privacy-settings" className="text-decoration-none">Privacy Settings</Link>
                </MDBListGroupItem>
                <MDBListGroupItem>
                  <Link to="/notification-settings" className="text-decoration-none">Notification Settings</Link>
                </MDBListGroupItem>
                <MDBListGroupItem>
                  <Link to="/delete-account" className="text-decoration-none text-danger">Delete Account</Link>
                </MDBListGroupItem>
              </MDBListGroup>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Account;
