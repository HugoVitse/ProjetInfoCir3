import React from 'react';
import { MDBIcon, MDBListGroup, MDBListGroupItem, MDBBtn } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const NavBar = () => {

  const logout = ()=>{
    Cookies.set("jwt","")
    window.location.reload()
  }

  return (
    <div className="d-flex flex-column align-items-start text-white p-3 bg-dark h-100">
      <Link to='/' className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <img
          src="https://brand.riotgames.com/static/a91000434ed683358004b85c95d43ce0/8a20a/lol-logo.png"
          alt="Logo"
          loading="lazy"
          style={{ width: '50px', height: '50px' }}
        />
        <span className="fs-4 ms-2">Linx</span>
      </Link>
      <hr className="border-secondary w-100" />
      <MDBListGroup className="mb-auto w-100">
        <MDBListGroupItem tag={Link} action to="/" className="d-flex align-items-center bg-dark text-white border-0">
          <MDBIcon fas icon="home" className="me-3" />
          Home
        </MDBListGroupItem>
        <MDBListGroupItem tag={Link} action to="/Login" className="d-flex align-items-center bg-dark text-white border-0">
          <MDBIcon fas icon="question-circle" className="me-3" />
          Login
        </MDBListGroupItem>
        <MDBListGroupItem tag={Link} action to="/Catalogue" className="d-flex align-items-center bg-dark text-white border-0">
          <MDBIcon fas icon="book-open" className="me-3" />
          Catalogue
        </MDBListGroupItem>
        <MDBListGroupItem tag={Link} action to="/Account" className="d-flex align-items-center bg-dark text-white border-0">
        <MDBIcon fas icon="address-book" className="me-3" />
          Profil
        </MDBListGroupItem>
        <MDBListGroupItem tag={Link} action to="/MoodTracker" className="d-flex align-items-center bg-dark text-white border-0">
          <MDBIcon fas icon="book" className="me-3" />
          Moodtracker
        </MDBListGroupItem>
        <MDBBtn onClick={logout} style={{ background: 'linear-gradient(135deg, #00c6ff, #0072ff)'}}>Logout</MDBBtn>
      </MDBListGroup>
      <hr className="border-secondary w-100" />
      <div className="text-center w-100">
        <p className="text-white">&copy; 2024 Linx</p>
      </div>
    </div>
  );
};

export default NavBar;