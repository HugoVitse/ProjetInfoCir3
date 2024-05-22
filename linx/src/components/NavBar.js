import React from 'react';
import { MDBIcon, MDBCollapse, MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{ width: '220px', height: '100vh', position: 'fixed' }}>
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px' }} />
        <span className="fs-4 ms-2">Admin Dashboard</span>
      </a>
      <hr />
      <MDBListGroup>
        <MDBListGroupItem tag="a" action href="/" className="d-flex align-items-center">
          <MDBIcon fas icon="home me-3" />
          Home
        </MDBListGroupItem>
        <MDBListGroupItem tag="a" action href="/Login" className="d-flex align-items-center">
          <MDBIcon fas icon="address-book me-3" />
          Login
        </MDBListGroupItem>
        <MDBListGroupItem tag="a" action href="/Register" className="d-flex align-items-center">
          <MDBIcon fas icon="far fa-file-lines me-3" />
          Register
        </MDBListGroupItem>
        <MDBListGroupItem tag="a" action href="/Account" className="d-flex align-items-center">
          <MDBIcon fas icon="far fa-address-card me-3" />
          Account
        </MDBListGroupItem>
      </MDBListGroup>
      <hr />
      <div className="text-center">
        <p>&copy; 2024 Your Company</p>
      </div>
    </div>
  );
};

export default NavBar;
