import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

//component function
function Header() {
  //manage the visibility of the overlay
  const [overlayVisible, setOverlayVisible] = useState(false);

  //switch the visibility of the overlay
  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  // JSX structure for the header
  return (
    <header>
      {/* Hamburger icon with onClick event to overlay visibility */}
      <FontAwesomeIcon
        icon={faBars}
        className="hamburger-icon"
        onClick={toggleOverlay}
      />

      {/* Overlay that appears when the hamburger icon is clicked */}
      {overlayVisible && (
        <div className="overlay">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      )}
      {/* Profile image */}
      <img
        src="path_to_your_image.jpg"
        alt="description"
        className="profile_image"
      />
      {/* Title */}
      <h4>Inventory management system</h4>

      

      {/* Navigation links */}
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

