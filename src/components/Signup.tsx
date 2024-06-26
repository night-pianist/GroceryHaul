import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

//const navigate = useNavigate();

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post<string>('http://localhost:5002/register', {
        username,
        email,
        password,
      });
      console.log('Signup successful:', response.data);
      //navigate('/login');
      // Optionally, redirect to login page or display success message
    } catch (error) {
      console.error('Signup failed:', error);
      // Handle signup failure (e.g., show error message)
    }
  };

  return (
    <div className = "signup-container">
      <div className = "signup-card">
        <h2 className="title">
          <div className="text">
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
        </div>
      </div>
      
    </div>
  );
};

export default Signup;