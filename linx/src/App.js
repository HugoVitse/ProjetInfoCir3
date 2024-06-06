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
import Evenements from './components/Evenements';
import { MDBRow, MDBCol, MDBContainer } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

function App() {
  return (
    <Router>
      <MDBContainer fluid className="vh-100 p-0">
        <MDBRow className="h-100 m-0">
          <MDBCol md="2" className="bg-dark" style={{ minWidth: '200px' ,zIndex:4,position:'relative'}}>
            <NavBar />
          </MDBCol>
          <MDBCol className="p-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/Admin" element={<Admin />} />
              <Route path="/Account" element={<Account />} />
              <Route path="/Catalogue" element={<Catalogue />} />
              <Route path="/Activite" element={<Activite />} />
              <Route path="/MoodTracker" element={<MoodTracker />} />
              <Route path="/Evenements" element={<Evenements />} />
            </Routes>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </Router>
  );
}

export default App;