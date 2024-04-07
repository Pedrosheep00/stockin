
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import { UserProvider } from './UserContext'; // Import the provider

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <Router>
    <UserProvider> 
      <App />
    </UserProvider>
  </Router>
);
