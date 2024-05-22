// components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h1 class="display-1">Bienvenue sur notre site</h1>
      <p>Nous sommes ravis de vous voir ici.</p>
      <nav>
        <ul>
          <li><Link to="/Login">Login</Link></li>
          <li><Link to="/Register">Register</Link></li>
          <li><Link to="/Admin">Admin</Link></li>
          <li><Link to="/Account">Account</Link></li>
        </ul>
      </nav>
      <i class="far fa-address-book"></i>
    </div>
  );
}

export default Home;
