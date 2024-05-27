import React from 'react';
import { Link } from 'react-router-dom';

interface NavBarProps {
    username: string | null;
    userRole: string | null;
}

const NavBar: React.FC<NavBarProps> = ({ username, userRole }) => {
    return (
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    <Link to="/">File Compare App</Link>
                </div>
                <div className="flex items-center">
                    {userRole === 'admin' && (
                        <Link to="/logs" className="text-white mr-4">
                            View Logs
                        </Link>
                    )}
                    {username && <div className="text-white">Welcome, {username}</div>}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
