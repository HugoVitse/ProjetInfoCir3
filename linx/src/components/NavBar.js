import React from 'react';
import { MDBIcon, MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{ width: '220px', height: '100vh', position: 'fixed' }}>
      <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <img src="https://brand.riotgames.com/static/a91000434ed683358004b85c95d43ce0/8a20a/lol-logo.png" alt="Logo" style={{ width: '40px', height: '40px' }} />
      </Link>

      <hr />
      <MDBListGroup>
        <MDBListGroupItem tag={Link} action to="/" className="d-flex align-items-center">
          <MDBIcon fas icon="home me-3" />
          Home
        </MDBListGroupItem>
        <MDBListGroupItem tag={Link} action to="/Login" className="d-flex align-items-center">
          <MDBIcon fas icon="address-book me-3" />
          Login
        </MDBListGroupItem>
        <MDBListGroupItem tag={Link} action to="/Register" className="d-flex align-items-center">
          <MDBIcon fas icon="far fa-file-lines me-3" />
          Register
        </MDBListGroupItem>
        <MDBListGroupItem tag={Link} action to="/Account" className="d-flex align-items-center">
          <MDBIcon fas icon="far fa-address-card me-3" />
          Account
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
