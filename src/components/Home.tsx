import React from 'react'
import { Link } from 'react-router-dom';
import '../styles/Home.scss';

function Home(): JSX.Element {
    return ( 
        <div>
            <h1> HOME PAGE</h1>
            <nav> 
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                    <li><Link to="/forgot-password">ForgotPassword</Link></li>
                    <li><Link to="/reset-password">ResetPassword</Link></li>
                </ul>
            </nav>
        </div>
 );
}

export default Home;
