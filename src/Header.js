// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

function Header() {
  return (
    <header>
      <FontAwesomeIcon icon={faBars} className="hamburger-icon" />
      <img src="path_to_your_image.jpg" alt="description" className="profile_image" />
      <h4>Inventory management system</h4>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
