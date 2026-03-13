import React, { useState } from 'react';
import { login } from '../api';

const Login = ({ setAuth }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login(formData);
            // Store token and role in browser
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('user', data.username);
            
            setAuth(data); // Notify the main App that we are logged in
            window.location.href = "/"; // Redirect to home
        } catch (err) {
            setError(err.response?.data?.msg || "Login Failed");
        }
    };

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>🔐 Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                {error && <p style={{color: 'red'}}>{error}</p>}
                <button className="btn-egg" type="submit">Unlock Admin Access</button>
            </form>
        </div>
    );
};

export default Login;