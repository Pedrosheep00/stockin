// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; // Adjust the import path as necessary
import './CSSs/Login.css'; // Ensure CSS styling is consistent with Register.css
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/main'); // Redirect if user is already signed in
            }
        });
        return () => unsubscribe(); // Cleanup subscription
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/main'); // Redirect after successful login
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

            <div className="mid_Content">
                <img
                src={'https://firebasestorage.googleapis.com/v0/b/stokin-try1.appspot.com/o/login_page_image.png?alt=media&token=32d41007-fb71-4aa3-9644-f82fead90f24'}
                alt="Inventory Management System"
                />

                <div className="login-square">
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <div>
                            <label>Email:</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                    <div className="signup-link">
                        <p>Don't have an account?</p>
                        <button onClick={() => navigate('/register')}>Sign up</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
