// src/App.js
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './Header';
import MainContent from './MainContent';
import Footer from './Footer';
import Categories from './Categories';
import CategoryItemsPage from './CategoryItemsPage'; // Import the new component
import Login from './Login';
import Register from './Register';

function App() {
  const location = useLocation();
  const noHeaderFooterRoutes = ['/login', '/register']; // Routes without Header and Footer
  const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <div className="App">
      {showHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:categoryName" element={<CategoryItemsPage />} /> {/* New dynamic route for category items */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
