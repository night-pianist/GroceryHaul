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

<<<<<<< HEAD
  return (
    <div className = "signup-container">
      <div className = "signup-card">
        <h2 className="title">
          <div className="text">
            {/* letter by letter */}
            <span className="letter">W</span>
            <span className="letter">e</span>
            <span className="letter">l</span>
            <span className="letter">c</span>
            <span className="letter">o</span>
            <span className="letter">m</span>
            <span className= "letter" id="letter-before-space">e</span>
            <span className="letter"> </span>
            <span className="letter">t</span>
            <span className="letter" id ="letter-before-space">o</span>
            <span className="letter"> </span>
            <span className="letter">G</span>
            <span className="letter">r</span>
            <span className="letter">o</span>
            <span className="letter">c</span>
            <span className="letter">e</span>
            <span className="letter">r</span>
            <span className="letter">y</span>
            <span className="letter">-</span>
            <span className="letter">H</span>
            <span className="letter">a</span>
            <span className="letter">u</span>
            <span className="letter">l</span>
            <span className="letter">!</span>
            {/* word by word - need to fix because adopting animation from login.css instead of signup.css*/}
            {/* <span className="letter" id = "letter-before-space">Welcome </span>
            <span className="letter"> </span>
            <span className="letter" id = "letter-before-space">to</span>
            <span className="letter"> </span>
            <span className="letter"> Grocery-Haul!</span> */}

          </div>
        </h2>
        <div className = "user-input">
          <div className = "username">
            <label className = "subtitle">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              // placeholder="Username"
            />
          </div>
          <div className="email">
          <label className = "subtitle">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // placeholder="Email"
            />
          </div>
          <div className = "password">
          <label className = "subtitle">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // placeholder="Password"
            />
          </div>
          <button className = "signuppage-btn" type = "submit" onClick={handleSignup}>Sign Up</button>
=======
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
>>>>>>> fcaa80821677c1fd9e59e5c66c993ec5e87cf9e7
        </div>
    );
};

export default Signup;