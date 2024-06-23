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
import Friends from './components/Friends';
import EventsPerso from './components/EventsPerso';
import Notif from './components/Notif';
import MobileDownload from './components/MobileDownload';
import Messagerie from './components/Messagerie';

import axios from 'axios';
import { MDBContainer, MDBCard } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './css/App.css';
import { Modal, Ripple, initMDB } from "mdb-ui-kit";

initMDB({ Modal, Ripple });

function App() {
  const [theme, setTheme] = useState('light');
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme === 'dark' ? 'dark-theme' : 'light-theme';
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.body.className = newTheme === 'dark' ? 'dark-theme' : 'light-theme';
      return newTheme;
    });
  };

  const handleModalToggle = () => {
    setIsOpen(!isOpen);
  };

  const mainContentStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflowY: 'auto',
    paddingLeft: '28px',
  };

  return (
    <Router>
      <MDBContainer fluid className="vh-100 p-0 d-flex">
        <div className={`modal show ${isOpen ? '' : 'fade'}`} id="navbar" tabIndex="-1" aria-labelledby="navbarLabel" aria-hidden="true">
          <div className="modal-dialog modal-start modal-fullscreen custom-modal">
            <div className="modal-content">
              <NavBar toggleTheme={toggleTheme} handleModalToggle={handleModalToggle} theme={theme} isOpen={isOpen} />
            </div>
          </div>
        </div>
        <div style={mainContentStyle}>
          <MDBCard className="h-100 bg-theme">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/Admin" element={<Admin />} />
              <Route path="/Account/:emailurl" element={<Account />} />
              <Route path="/Catalogue" element={<Catalogue />} />
              <Route path="/Activite" element={<Activite />} />
              <Route path="/Evenements" element={<Evenements />} />
              <Route path="/MoodTracker" element={<MoodTracker />} />
              <Route path="/Friends/:emailurl" element={<Friends />} />
              <Route path="/EventsPerso/:email" element={<EventsPerso />} />
              <Route path="/Notif" element={<Notif />} />
              <Route path="/event/:activityName/:idEvent" element={<Messagerie />} />
              <Route path="*" element={<Home />} />
              <Route path="/MobileDownload" element={<MobileDownload />} />
            </Routes>
          </MDBCard>
        </div>
      </MDBContainer>
    </Router>
  );
}

export default App;