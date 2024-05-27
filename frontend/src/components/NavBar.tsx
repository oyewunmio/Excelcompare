import React from 'react';

interface NavBarProps {
    username: string | null;
}

const NavBar: React.FC<NavBarProps> = ({ username }) => {
    return (
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">File Compare App</div>
                {username && <div className="text-white">Welcome, {username}</div>}
            </div>
        </nav>
    );
};

export default NavBar;
