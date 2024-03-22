import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './CSSs/Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await user.updateProfile({
        displayName: `${firstName} ${lastName}`,
      });
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
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </nav>
      </div>

      <div className="mid_Content">
        <img
          src={
            'https://firebasestorage.googleapis.com/v0/b/stokin-try1.appspot.com/o/login_page_image.png?alt=media&token=32d41007-fb71-4aa3-9644-f82fead90f24'
          }
          alt="Inventory Management System"
        />

        <div className="register-square">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
