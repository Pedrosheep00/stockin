import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import MainContent from './MainContent';
import Footer from './Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<MainContent />} />
        {/* Add more routes if needed */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
