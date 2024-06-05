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
import MoodTracker from './components/MoodTracker';
import { MDBContainer, MDBCard } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './css/App.css';
import { Modal, Ripple, initMDB } from "mdb-ui-kit";

initMDB({ Modal, Ripple });

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const isModalOpen = localStorage.getItem('modalOpen') === 'false';
    setModalOpen(isModalOpen);
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

  return (
    <Router>
      <MDBContainer fluid className="vh-100 p-0">
        <div className={`modal ${modalOpen ? 'show' : ''}`} id="navbar" tabIndex="-1" aria-labelledby="navbarLabel" aria-hidden="true" onClick={handleCloseModal}>
          <div className="modal-dialog modal-start modal-fullscreen custom-modal">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <NavBar />
            </div>
          </div>
        </div>
        <MDBCard>
          <button type="button" className="btn btn-primary bg-dark" data-mdb-ripple-init data-mdb-modal-init data-mdb-target="#navbar" onClick={handleModalToggle}>
            <i className="fas fa-align-justify"></i>
          </button>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/Account" element={<Account />} />
            <Route path="/Catalogue" element={<Catalogue />} />
            <Route path="/Activite" element={<Activite />} />
            <Route path="/MoodTracker" element={<MoodTracker />} />
          </Routes>
        </MDBCard>
      </MDBContainer>
    </Router>
  );
}

export default App;
