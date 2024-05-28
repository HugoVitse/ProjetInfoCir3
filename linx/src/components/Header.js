import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Collapse, initMDB } from "mdb-ui-kit";

const NavBar = () => {

    initMDB({ Dropdown, Collapse });
    
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
            <div className="container-fluid">
                <button
                    data-mdb-collapse-init
                    className="navbar-toggler"
                    type="button"
                    data-mdb-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <i className="fas fa-bars"></i>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <Link to='/' style={{width:'5%'}}>
                        <img
                            src="https://brand.riotgames.com/static/a91000434ed683358004b85c95d43ce0/8a20a/lol-logo.png"
                            height="15"
                            alt="MDB Logo"
                            loading="lazy"
                            style={{width:'70%', height:'70%'}}/>
                    </Link>
                    {/* Liste des boutons à gauches */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <span className="nav-link">5200 £</span>
                        </li>
                    </ul>
                </div>
                <div className="d-flex align-items-center">
                    {/* Cloche icon */}
                    <div className="dropdown">
                        <button
                            data-mdb-dropdown-init
                            className="text-reset me-3 dropdown-toggle hidden-arrow"
                            type="button"
                            id="navbarDropdownMenuLink"
                            aria-expanded="false">
                            <i className="fas fa-bell"></i>
                            <span className="badge rounded-pill badge-notification bg-danger">1</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                            <li>
                                <span className="dropdown-item">Some news</span>
                            </li>
                            <li>
                                <span className="dropdown-item">Another news</span>
                            </li>
                            <li>
                                <span className="dropdown-item">Something else here</span>
                            </li>
                        </ul>
                    </div>
                    {/* Account icon */}
                    <div className="dropdown">
                        <Link to='/Account' style={{width:'5%'}}>
                            <button
                                data-mdb-dropdown-init
                                className="dropdown-toggle d-flex align-items-center hidden-arrow"
                                type="button"
                                id="navbarDropdownMenuAvatar"
                                aria-expanded="false">
                                <img
                                    src="https://wallpapers-clan.com/wp-content/uploads/2022/09/one-piece-pfp-2.jpg"
                                    className="rounded-circle"
                                    height="25"
                                    alt="Account icon"
                                    loading="lazy"/>
                            </button>
                        </Link>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuAvatar">
                            <li>
                                <span className="dropdown-item">My profile</span>
                            </li>
                            <li>
                                <span className="dropdown-item">Settings</span>
                            </li>
                            <li>
                                <span className="dropdown-item">Logout</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
