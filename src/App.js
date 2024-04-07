
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './Header';
import FrontPage from './FrontPage'; 
import MainContent from './MainContent';
import Footer from './Footer';
import Categories from './Categories';
import CategoryItemsPage from './CategoryItemsPage';
import Login from './Login';
import Register from './Register';
import ProfilePage from './ProfilePage';
import Dashboard from './Dashboard';
import About from './About';
import CookieConsent from './CookieConsent'; 


function App() {
  const location = useLocation();
  const noHeaderFooterRoutes = ['/login', '/register', '/']; 
  const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);
/*--------------------routes to navigate to different pages--------------------------------*/
  return (
    <div className="App">
      {showHeaderFooter && <Header />}
      <CookieConsent /> {/* Display the cookie consent banner */}
      <Routes>
        
        <Route path="/" element={<FrontPage />} />
        <Route path="/home" element={<MainContent />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:categoryName" element={<CategoryItemsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
