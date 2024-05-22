// components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Account = () => {
  return (
    <div className="home-container">
      <h1>Bienvenue sur notre site</h1>
      <p>Nous sommes ravis de vous voir ici.</p>
      <nav>
        <ul>
          <li><Link to="/Login">Login</Link></li>
          <li><Link to="/Register">Register</Link></li>
          <li><Link to="/Admin">Admin</Link></li>
          <li><Link to="/Account">Account</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Account;
