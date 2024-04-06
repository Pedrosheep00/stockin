import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; // Adjust the import path as necessary
import './CSSs/Login.css'; 
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/home'); // Redirect if user is already signed in
            }
        });
        return () => unsubscribe(); // Cleanup subscription
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home'); // Redirect after successful login
        } catch (error) {
            setError('Error logging in: ' + error.message);
        }
    };

    return (
        <div className="Page">
            <div className="header">
                <h3>Inventory Management System</h3>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
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
                    {error && <p className="error-message">{error}</p>}
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
                        <Link to="/register">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
