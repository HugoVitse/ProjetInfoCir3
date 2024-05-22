//import logo from '../public/Ad';
import './css/App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Admin from './components/Admin';
import Account from './components/Account';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Account" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;
