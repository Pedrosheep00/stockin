// src/useAuth.js
import { useContext } from 'react';
import { AuthContext } from './AuthContext'; // This is if AuthContext.js is in the same directory

export const useAuth = () => useContext(AuthContext);
