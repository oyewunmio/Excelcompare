import React from 'react';
import Login from '../components/Login';

interface LoginPageProps {
    setToken: (token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setToken }) => {
    return (
        <div>
            <Login setToken={setToken} />
        </div>
    );
};

export default LoginPage;
