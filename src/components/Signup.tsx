import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h2>Sign Up</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Signup;