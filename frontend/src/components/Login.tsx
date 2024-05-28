import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    setToken: (token: string, username: string, userRole: string) => void;
}

const Login: React.FC<LoginProps> = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        try {
            const response = await axios.post('http://localhost:8000/auth/login', formData);
            setToken(response.data.access_token, username, response.data.user_role);
            toast.success('Login successful!');
        } catch (error) {
            toast.error('Error logging in. Please check your credentials.');
        }
    };

    return (
        <div className="flex items-center">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl mb-4 text-center">Login</h2>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <button type="submit" className="w-full bg-red-600 text-white py-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
