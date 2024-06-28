import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = async () => {
        try {
            const response = await axios.post('http://localhost:5002/auth/forgot-password', { email });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error requesting password reset:', error);
            setMessage('Error: Could not request password reset');
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={handleForgotPassword}>Submit</button>
            <p>{message}</p>
        </div>
    );
};

export default ForgotPassword;