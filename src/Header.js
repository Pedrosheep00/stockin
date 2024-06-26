import React, { useState, useEffect} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { auth } from './firebase'; 
import { signOut } from 'firebase/auth';
import './CSSs/Header.css'; 
import { useUser } from './UserContext'; 
import defaultProfileImage from './assets/profile_image.jpg'; 

function Header() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile } = useUser(); // Use the useUser hook to access user and userProfile

  // Close the overlay when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.closest('.hamburger-icon')) return;
      if (!event.target.closest('.overlay')) {
        setOverlayVisible(false);
      }
    };

    if (overlayVisible) {
      window.addEventListener('click', handleOutsideClick);
    }

    return () => window.removeEventListener('click', handleOutsideClick);
  }, [overlayVisible]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error', error);
    }
  };

  const isFrontPage = location.pathname === '/';

  return (
    <header>
      <FontAwesomeIcon
        icon={faBars}
        className="hamburger-icon"
        onClick={() => setOverlayVisible(!overlayVisible)}
      />
      <div className={`overlay ${overlayVisible ? 'visible' : ''}`}>
        <ul>
           <li><Link to="/home" onClick={() => setOverlayVisible(false)}>Inventory</Link></li>
           <li><Link to="/categories" onClick={() => setOverlayVisible(false)}>Categories</Link></li>     
          <li><Link to="/dashboard" onClick={() => setOverlayVisible(false)}>Dashboard</Link></li>
          <li><Link to="/about" onClick={() => setOverlayVisible(false)}>About</Link></li>               
          <li><button className="sign-out" onClick={handleLogout}>Log Out</button></li>
          
        </ul>
      </div>
      
      <Link to={user ? "/profile" : "/login"}>
        <img src={userProfile?.imageUrl || defaultProfileImage} alt="Profile" className="profile-image" />
        
      </Link>
      
      <h1>Inventory Management System</h1>
      <nav>
        <ul>
          <li><Link to="/" className={isFrontPage ? 'home-link-frontpage' : 'home-link'}>Home</Link></li>
          <li><Link to="/dashboard" className='home-link home-link-red'>Dashboard</Link></li>
          <li><Link to="/home" className='home-link home-link-red'>Inventory</Link></li>

        </ul>
      </nav>
    </header>
  );
}

export default Header;
