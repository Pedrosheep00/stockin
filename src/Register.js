import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import './CSSs/Register.css';
import { useNavigate } from 'react-router-dom';
import login_page_image from './assets/login_page_image.png';

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/login');
    } catch (error) {
      console.error('Error registering:', error.message);
    }
  };

  return (
    <div className="Page">
      <div className="header">
        <h3>Inventory Management System</h3>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </div>

      <div className="mid_Content">
        <img src={login_page_image} alt="Inventory Management System" />
        <div className="register-square">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div>
              <label>First Name:</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <label>Last Name:</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="RegisterBtn" type="submit">Register</button>
          </form>
          <div className="signup-link">
            <p>Already registered?</p>
            <button onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
