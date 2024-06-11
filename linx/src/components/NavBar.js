import React from 'react';
import { MDBIcon, MDBListGroup, MDBListGroupItem, MDBBtn } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Container } from '@mui/material';

const NavBar = ({ isOpen, toggleTheme, theme, setTheme, handleModalToggle }) => {
  const logout = () => {
    Cookies.set("jwt", "");
    window.location.reload();
  };

  return (
    <Container className="bg-theme-inv d-flex h-100 p-3 position-relative">
      <div className={`bg-theme-inv d-flex w-100 flex-column align-items-start p-3 h-100 ${isOpen ? 'show' : 'fade'}`} id="navbar">
        <div className="position-relative">
          <Link to='/' className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-theme-inv text-decoration-none">
            <img
              src="https://brand.riotgames.com/static/a91000434ed683358004b85c95d43ce0/8a20a/lol-logo.png"
              alt="Logo"
              loading="lazy"
              style={{ width: '50px', height: '50px' }}
            />
            <span className="fs-4 ms-2">Linx</span>
          </Link>
        </div>
        <hr className="border-secondary w-100" />
        <MDBListGroup className="mb-auto w-100">
          <MDBListGroupItem tag={Link} action to="/" className="d-flex align-items-center bg-theme-inv text-theme-inv border-0">
            <MDBIcon fas icon="home" className="me-3" />
            Home
          </MDBListGroupItem>
          <MDBListGroupItem tag={Link} action to="/Login" className="d-flex align-items-center bg-theme-inv text-theme-inv border-0">
          <MDBIcon fas icon="question-circle" className="me-3" />
          Login
        </MDBListGroupItem>
        <MDBListGroupItem tag={Link} action to="/Catalogue" className="d-flex align-items-center bg-theme-inv text-theme-inv border-0">
          <MDBIcon fas icon="book-open" className="me-3" />
          Catalogue
        </MDBListGroupItem>
        <MDBListGroupItem tag={Link} action to="/Evenements" className="d-flex align-items-center bg-theme-inv text-theme-inv border-0">
          <MDBIcon fas icon="book-open" className="me-3" />
          Evenements
        </MDBListGroupItem>
        <MDBListGroupItem tag={Link} action to="/Account" className="d-flex align-items-center bg-theme-inv text-theme-inv border-0">
          <MDBIcon fas icon="address-book" className="me-3" />
          Profil
        </MDBListGroupItem>
        <MDBListGroupItem tag={Link} action to="/MoodTracker" className="d-flex align-items-center bg-theme-inv text-theme-inv border-0">
          <MDBIcon fas icon="book" className="me-3" />
          Moodtracker
        </MDBListGroupItem>
        <MDBBtn onClick={logout} style={{ background: 'linear-gradient(135deg, #00c6ff, #0072ff)' }}>Logout</MDBBtn>
        </MDBListGroup>
        <hr className="border-secondary w-100" />
        <div className="text-center w-100">
          <p className="text-theme-inv">&copy; 2024 Linx</p>
          <button onClick={toggleTheme} className="bg-theme-inv text-theme-inv">
            {theme === 'light' ? <MDBIcon fas icon="sun" /> : <MDBIcon fas icon="moon" />}
          </button>
        </div>
      </div>
      <button
        type="button"
        className={`position-absolute top-50 end-0 bg-theme-inv text-theme-inv navbar-toggler-close show`} // Retirez la condition et appliquez toujours la classe `show`
        onClick={handleModalToggle}
        style={{ transform: 'translateY(-50%)', padding: '8px' }}
      >
        <i className={`fas ${isOpen ? 'fa-angle-left' : 'fa-angle-right'}`}></i>
      </button>
    </Container>
  );
};

export default NavBar;