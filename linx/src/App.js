import React from 'react';
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

import 'mdb-react-ui-kit/dist/css/mdb.min.css';

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <div style={{ height: '100%', marginLeft: '220px' }}>
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
        </div>
      </div>
    </Router>
  );
}

export default App;
