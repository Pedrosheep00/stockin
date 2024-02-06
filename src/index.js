// src/index.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App'; 
import Login from './Login';
import { createRoot } from 'react-dom/client';
import Register from './Register';

//firebase importing initialization
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBaEogYIRsIFEl_2wQq2X7rigAAdpMeIBU",
  authDomain: "stokin-try1.firebaseapp.com",
  projectId: "stokin-try1",
  storageBucket: "stokin-try1.appspot.com",
  messagingSenderId: "202631949178",
  appId: "1:202631949178:web:deff7f7813d608ed1684c3",
  measurementId: "G-TW0PMMJVPK"
};

firebase.initializeApp(firebaseConfig);

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <Router>
    <Routes>
      <Route path="/main/*" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
);