import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5002/login', { username, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="title">
                    <div className="text">
                        {/* <span className="letter">L</span>
                        <span className="letter">o</span>
                        <span className="letter">g</span>
                        <span className="letter">i</span>
                        <span className="letter">n</span> */}
                        <span className="letter">W</span>
                        <span className="letter">e</span>
                        <span className="letter">l</span>
                        <span className="letter">c</span>
                        <span className="letter">o</span>
                        <span className="letter">m</span>
                        <span className= "letter" id="letter-before-space">e</span>
                        <span className="letter"> </span>
                        <span className="letter">B</span>
                        <span className="letter">a</span>
                        <span className="letter">c</span>
                        <span className="letter">k</span>
                    </div>
                </h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
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
                        <div className="password">
                            <label className="subtitle">Password:</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button className="login-btn" type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;