import React from 'react';
import { Link } from 'react-router-dom';
import './CSSs/FrontPage.css';
import logoImage from './assets/Stokin_logo.png';
import featureImage1 from './assets/feat1.png';
import featureImage2 from './assets/feat2.png';
import featureImage3 from './assets/feat3.png';

const FrontPage = () => {
  return (
    <div className="front-page-container">
      <nav className="front-page-nav">
        <Link to="/"><img src={logoImage} alt="Stokin Logo" className="logo" /></Link>
        <div className="nav-links">
          <Link to="/home">Inventory</Link>
          <Link to="/features">Features</Link>
          <Link to="/login">LOGIN</Link>
          <Link to="/register" className="register-button-link">
            <button className="register-button">REGISTER</button>
          </Link>
        </div>
      </nav>

      <header className="front-page-header">
        <h1>Inventory Management System</h1>
        <p>Easy to use · Free of charge · Master your Organization</p>
      </header>

      <section className="front-page-main">
        <div className="feature-card">
          <img src={featureImage1} alt="Feature 1" />
          <h3>The inventory management tool indicated for those small businesses and start ups.</h3>
        </div>

        <div className="feature-card">
          <h3>Every information about your items/products in just ONE CLICK</h3>
          <img src={featureImage2} alt="Feature 2" />
        </div>

        <div className="feature-card">
          <img src={featureImage3} alt="Feature 3" />
          <h3>Colour Coding: Set a colour code to alert you when the quantity is lower than it should be</h3>
        </div>

        <Link to="/register" className="register-button-link2">
            <button className="register-button">Register NOW for FREE</button>
          </Link>
        
      </section>

      <footer className="front-page-footer">
        {/* Footer content like contact info, social links, etc. */}
      </footer>
    </div>
  );
};

export default FrontPage;
