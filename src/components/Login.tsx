import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const mapAnimationPath = `${process.env.PUBLIC_URL}/MapArrowAnimation.gif`;
    const staticMapPath = `${process.env.PUBLIC_URL}/StaticBackgroundMap.svg`;

    const [src, setSrc] = useState(mapAnimationPath);

    const handleError = () => {
        setSrc(staticMapPath);
    };

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
            <div className="background" style={{ backgroundImage: `url(${src})` }} onError={handleError}></div>
            <div className="login-card">
                <h2 className="title">
<<<<<<< HEAD
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
=======
                    <span>W</span>
                    <span>e</span>
                    <span>l</span>
                    <span>c</span>
                    <span>o</span>
                    <span>m</span>
                    <span>e</span>
                    <span className="space"></span>
                    <span>B</span>
                    <span>a</span>
                    <span>c</span>
                    <span>k</span>
>>>>>>> fcaa80821677c1fd9e59e5c66c993ec5e87cf9e7
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
<<<<<<< HEAD
                <button className="signup-btn">
                    <a href="/signup">First time here? Click here to create an account!</a>
                </button>
=======
                <div className="signup-btn">
                    <Link to="/signup" style={{ color: '#007bff' }}>
                        First time here?
                    </Link>
                    <Link to="/signup" style={{ color: '#007bff' }}>
                        Click here to create an account!
                    </Link>
                </div>
>>>>>>> fcaa80821677c1fd9e59e5c66c993ec5e87cf9e7
            </div>
        </div>
    );
};

export default Login;
