import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './Register.css'; // Import the CSS file for styling
import 'firebase/compat/storage';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const Register = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      // Sign up with email and password
      const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);

      // Update the user profile with first and last name
      await user.updateProfile({
        displayName: `${firstName} ${lastName}`,
      });

      // Redirect to the login page after successful registration
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
          <div>
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="RegisterBtn" onClick={handleRegister}>Register</button>
          <div className="signup-link">
            <p>Don't have an account?</p>
            <button onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
