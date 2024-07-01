import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Signup.css';

const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const mapAnimationPath = `${process.env.PUBLIC_URL}/MapArrowAnimation.gif`;
    const staticMapPath = `${process.env.PUBLIC_URL}/StaticBackgroundMap.svg`;

    const [backgroundSrc, setBackgroundSrc] = useState(mapAnimationPath);

    const handleBackgroundError = () => {
        setBackgroundSrc(staticMapPath);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5002/register', {
                username,
                email,
                password,
            });
            console.log('Signup successful:', response.data);
            // Redirect or display success message
            navigate('/login');
        } catch (error) {
            console.error('Signup failed:', error);
            setError('Signup failed. Please try again.');
        }
    };

    return (
        <div className="signup-container">
            <div className="background" style={{ backgroundImage: `url(${backgroundSrc})` }} onError={handleBackgroundError}></div>
            <div className="signup-card">
                <h2 className="title">
                    <div className="text">
                        <span className="welcome-text">Welcome to</span>
                        <br />
                        <span className="grocery-haul-text">Grocery-Haul!</span>
                    </div>
                </h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSignup}>
                    <div className="user-input">
                        <div className="username">
                            <label className="subtitle">Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="email">
                            <label className="subtitle">Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="password">
                            <label className="subtitle">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="signup-page-btn" type="submit">Sign Up</button>
                    </div>
                </form>
                <div className="signup-btn">
                    <Link to="/login" style={{ color: '#007bff' }}>
                        Already have an account? Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;