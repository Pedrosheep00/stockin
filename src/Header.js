import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { auth } from './firebase'; 
import { signOut } from 'firebase/auth';
import './CSSs/Header.css'; 

function Header() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to close the overlay if clicked outside
    const handleOutsideClick = (event) => {
      if (event.target.closest('.hamburger-icon')) return; // Ignore clicks on hamburger icon
      if (!event.target.closest('.overlay')) {
        setOverlayVisible(false);
      }
    };

    // If the overlay is visible, then listen for outside clicks
    if (overlayVisible) {
      window.addEventListener('click', handleOutsideClick);
    }

    // Cleanup function to remove the listener
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [overlayVisible]); // Only re-run the effect if overlayVisible changes


  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error', error);
    }
  };

  return (
    <header>
      <FontAwesomeIcon
        icon={faBars}
        className="hamburger-icon"
        onClick={() => setOverlayVisible(!overlayVisible)}
      />
      <div className={`overlay ${overlayVisible ? 'visible' : ''}`}>
        <ul>
          <li><Link to="/" onClick={() => setOverlayVisible(false)}>Dashboard</Link></li>
          <li><Link to="/about" onClick={() => setOverlayVisible(false)}>Staff</Link></li>
          <li><Link to="/categories" onClick={() => setOverlayVisible(false)}>Categories</Link></li>
          <li><Link to="/contact" onClick={() => setOverlayVisible(false)}>Insights</Link></li>
          <li><Link to="/contact" onClick={() => setOverlayVisible(false)}>Settings</Link></li>


          <li><button className="sign-out" onClick={handleLogout}>Log Out</button></li>
        </ul>
      </div>
      <img src="path_to_your_image.jpg" alt="Profile" className="profile-image" />
      <h1>Inventory Management System</h1>
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
