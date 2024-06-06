import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Admin from './components/Admin';
import Account from './components/Account';
import Login from './components/Login';
import Register from './components/Register';
import NavBar from './components/NavBar';
import Catalogue from './components/Catalogue';
import Activite from './components/Activite';
import Evenements from './components/Evenements';
import MoodTracker from './components/MoodTracker';
import { MDBContainer, MDBCard, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './css/App.css';
import { Modal, Ripple, initMDB } from "mdb-ui-kit";

initMDB({ Modal, Ripple });

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [theme, setTheme] = useState('light');  // State for theme

  useEffect(() => {
    const storedModalOpen = localStorage.getItem('modalOpen') === 'true';
    setModalOpen(storedModalOpen);

    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme === 'dark' ? 'dark-theme' : 'light-theme';
  }, []);

  const handleModalToggle = () => {
    setModalOpen(prevState => {
      const newState = !prevState;
      localStorage.setItem('modalOpen', String(newState));
      return newState;
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    localStorage.setItem('modalOpen', 'false');
  };

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.body.className = newTheme === 'dark' ? 'dark-theme' : 'light-theme';
      return newTheme;
    });
  };

  return (
    <Router>
      <MDBContainer fluid className="vh-100 p-0">
        {modalOpen && (
          <div className="modal show" id="navbar" tabIndex="-1" aria-labelledby="navbarLabel" aria-hidden="true" onClick={handleCloseModal}>
            <div className="modal-dialog modal-start modal-fullscreen custom-modal">
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <NavBar isOpen={modalOpen} closePopup={handleCloseModal} />
              </div>
            </div>
          </div>
        )}
        <MDBCard>
          {/* Bouton NavBar */}
          <button type="button" className="bg-dark" onClick={handleModalToggle}>
            <i className="fas fa-align-justify"></i>
          </button>
          {/* Bouton Thème */}
          <button onClick={toggleTheme} className="bg-theme-inv">
            {theme === 'light' ? <MDBIcon fas icon="sun" /> : <MDBIcon fas icon="moon" />}
          </button>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/Account" element={<Account />} />
            <Route path="/Catalogue" element={<Catalogue />} />
            <Route path="/Activite" element={<Activite />} />
            <Route path="/Evenements" element={<Evenements />} />
            <Route path="/MoodTracker" element={<MoodTracker />} />
          </Routes>
        </MDBCard>
      </MDBContainer>
    </Router>
  );
}

export default App;
