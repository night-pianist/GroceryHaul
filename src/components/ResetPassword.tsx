import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = async () => {
        try {
            const response = await axios.post(`http://localhost:5002/auth/reset-password/${token}`, { newPassword });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage('Error: Could not reset password');
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <button onClick={handleResetPassword}>Reset Password</button>
            <p>{message}</p>
        </div>
    );
};

export default ResetPassword;