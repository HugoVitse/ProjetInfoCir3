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
        <MDBListGroupItem tag="a" action href="/category-1" className="d-flex align-items-center">
          <MDBIcon fas icon="chart-area me-3" />
          Category 1
          <MDBIcon fas icon="angle-down ms-auto" />
        </MDBListGroupItem>
        <MDBCollapse show>
          <MDBListGroupItem tag="a" action href="/category-1/link-2" className="ms-4">
            Link 2
          </MDBListGroupItem>
          <MDBListGroupItem tag="a" action href="/category-1/link-3" className="ms-4">
            Link 3
          </MDBListGroupItem>
        </MDBCollapse>
        <MDBListGroupItem tag="a" action href="/category-2" className="d-flex align-items-center">
          <MDBIcon fas icon="cog me-3" />
          Category 2
          <MDBIcon fas icon="angle-down ms-auto" />
        </MDBListGroupItem>
        <MDBCollapse show>
          <MDBListGroupItem tag="a" action href="/category-2/link-4" className="ms-4">
            Link 4
          </MDBListGroupItem>
          <MDBListGroupItem tag="a" action href="/category-2/link-5" className="ms-4">
            Link 5
          </MDBListGroupItem>
        </MDBCollapse>
        <MDBListGroupItem tag="a" action href="/settings" className="d-flex align-items-center">
          <MDBIcon fas icon="cog me-3" />
          Settings
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
