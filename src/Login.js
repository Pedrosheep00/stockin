// src/components/Login.js
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app'; // Change this line
import 'firebase/compat/auth';
import './Login.css'; // Import the CSS file for styling
import 'firebase/compat/storage';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



const Login = ({ history }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    useEffect(() => {
      // Check if a user is already signed in
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // Redirect to the main component if the user is signed in
          navigate('/main');
        }
      });
  
      // Cleanup the subscription when the component unmounts
      return () => unsubscribe();
    }, [navigate]);
  
    const handleLogin = async () => {
      try {
        // Sign in with email and password
        await firebase.auth().signInWithEmailAndPassword(email, password);
  
        // Redirect to the main component after successful login
        navigate('/main');
      } catch (error) {
        console.error('Error logging in:', error.message);
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

            <div className='mid_Content'>
                
            <img src={"https://firebasestorage.googleapis.com/v0/b/stokin-try1.appspot.com/o/login_page_image.png?alt=media&token=32d41007-fb71-4aa3-9644-f82fead90f24"} alt="Inventory Management System" />

                <div className="login-square">
                    <h2>Login</h2>
                    <div>
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button onClick={handleLogin}>Login</button>
                    <div className="signup-link">
                        <p>Don't have an account?</p>
                        <Link to="/register"><button>Sign up</button></Link>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Login;
