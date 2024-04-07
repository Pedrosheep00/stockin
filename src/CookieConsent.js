import React, { useState, useEffect } from 'react';
import './CSSs/CookieConsent.css';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if the consent has already been given or not
    const consent = localStorage.getItem('cookieConsent');
    if (consent !== 'given') {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Set consent in localStorage and hide the banner
    localStorage.setItem('cookieConsent', 'given');
    setVisible(false);
    // Perform any action after consent is given, like enabling analytics
  };

  const handleDecline = () => {
    // Simply hide the banner without setting the consent
    setVisible(false);
    // You might want to disable certain functionalities based on this
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent-banner">
      <p>We use cookies to improve your experience on our site. By continuing to use our site, you accept our use of cookies.</p>
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleDecline}>Decline</button>
    </div>
  );
};

export default CookieConsent;
