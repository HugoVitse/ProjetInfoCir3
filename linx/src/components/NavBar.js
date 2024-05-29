import React from 'react';
import { MDBIcon, MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    //Column
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{height: '100%', position: 'fixed' }}>
     
     <Link to='/' style={{width:'5%'}}>
                        <img
                            src="https://brand.riotgames.com/static/a91000434ed683358004b85c95d43ce0/8a20a/lol-logo.png"
                            height="15"
                            alt="MDB Logo"
                            loading="lazy"
                            style={{width:'70%', height:'70%'}}/>
                    </Link>
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
        <MDBListGroupItem tag={Link} action to="/MoodTracker" className="d-flex align-items-center">
          <MDBIcon fas icon="book" className="me-3" /> 
          MoodTracker
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