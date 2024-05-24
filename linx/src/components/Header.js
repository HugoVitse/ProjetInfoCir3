import React from 'react';
import { MDBIcon, MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import { Dropdown, Collapse, initMDB } from "mdb-ui-kit";

const NavBar = () => {

    initMDB({ Dropdown, Collapse });
    
    return (


  <nav class="navbar navbar-expand-lg navbar-light bg-body-tertiary">
   
    <div class="container-fluid">
      
      <button
        data-mdb-collapse-init
        class="navbar-toggler"
        type="button"
        data-mdb-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <i class="fas fa-bars"></i>
      </button>
  
      
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        
      <Link to='/' style={{width:'5%'}}>
          <img
            src="https://brand.riotgames.com/static/a91000434ed683358004b85c95d43ce0/8a20a/lol-logo.png"
            height="15"
            alt="MDB Logo"
            loading="lazy"
            style={{width:'70%', height:'70%'}}/>
            
        </Link>
        {/* Liste des boutons à gauches */}
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" href="#">5200 £</a>
          </li>
        </ul>
        
      </div>
      
  
      
      <div class="d-flex align-items-center">
       
        {/* Cloche icon */}
        <div class="dropdown">
          <a
            data-mdb-dropdown-init
            class="text-reset me-3 dropdown-toggle hidden-arrow"
            href="#"
            id="navbarDropdownMenuLink"
            role="button"
            aria-expanded="false">
            
            <i class="fas fa-bell"></i>
            
            <span class="badge rounded-pill badge-notification bg-danger">1</span>
          </a>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="navbarDropdownMenuLink">
            <li>
              <a class="dropdown-item" href="#">Some news</a>
            </li>
            <li>
              <a class="dropdown-item" href="#">Another news</a>
            </li>
            <li>
              <a class="dropdown-item" href="#">Something else here</a>
            </li>
          </ul>
        </div>

        {/* Account icon */}
        <div class="dropdown">
        <Link to='/Account' style={{width:'5%'}}>
          <a
            data-mdb-dropdown-init
            class="dropdown-toggle d-flex align-items-center hidden-arrow"
            href="#"
            id="navbarDropdownMenuAvatar"
            role="button"
            aria-expanded="false">
            <img
              src="https://wallpapers-clan.com/wp-content/uploads/2022/09/one-piece-pfp-2.jpg"
              class="rounded-circle"
              height="25"
              alt="Account icon"
              loading="lazy"/>
          </a>
          </Link>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="navbarDropdownMenuAvatar">
            <li>
              <a class="dropdown-item" href="#">My profile</a>
            </li>
            <li>
              <a class="dropdown-item" href="#">Settings</a>
            </li>
            <li>
              <a class="dropdown-item" href="#">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  );
};

export default NavBar;
