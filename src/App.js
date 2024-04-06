// src/App.js
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './Header';
import FrontPage from './FrontPage'; // Make sure this is correctly imported
import MainContent from './MainContent';
import Footer from './Footer';
import Categories from './Categories';
import CategoryItemsPage from './CategoryItemsPage';
import Login from './Login';
import Register from './Register';
import ProfilePage from './ProfilePage';

function App() {
  const location = useLocation();
  const noHeaderFooterRoutes = ['/login', '/register', '/']; // Add the root path to routes without Header and Footer if needed
  const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <div className="App">
      {showHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/home" element={<MainContent />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:categoryName" element={<CategoryItemsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
