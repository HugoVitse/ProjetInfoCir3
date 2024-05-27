import React from 'react';
import { MDBIcon, MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    //Column
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{height: '100%', position: 'fixed' }}>
     

      <hr />
      <MDBListGroup>
        <MDBListGroupItem tag={Link} action to="/" className="d-flex align-items-center">
          <MDBIcon fas icon="home" className="me-3"/>
          Home
        </MDBListGroupItem>
        <MDBListGroupItem tag={Link} action to="/Login" className="d-flex align-items-center">
          <MDBIcon fas icon="address-book" className="me-3"/>
          Login
        </MDBListGroupItem>
        <MDBListGroupItem tag={Link} action to="/Questionnaire" className="d-flex align-items-center">
          <MDBIcon fas icon="question-circle" className="me-3" />
          Questionnaire
        </MDBListGroupItem>
        <MDBListGroupItem tag={Link} action to="/Catalogue" className="d-flex align-items-center">
          <MDBIcon fas icon="book" className="me-3" /> 
          Catalogue
        </MDBListGroupItem>
      </MDBListGroup>
      <hr />
      <div className="text-center">
        <p>&copy; 2024 Linx</p>
      </div>
    </div>
  );
};

export default NavBar;