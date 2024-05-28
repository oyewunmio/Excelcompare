import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

interface NavBarProps {
    username: string | null;
    userRole: string | null;
}

const NavBar: React.FC<NavBarProps> = ({ username, userRole }) => {
    return (
        <AppBar position="static" style={{ backgroundColor: 'rgb(217,34,41)' }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Excel Comparator
                </Typography>
                {username && (
                    <>
                        <Typography variant="body1" style={{ marginRight: '20px' }}>
                            Welcome, {username}
                        </Typography>
                        {userRole === 'admin' && (
                            <>
                                <Button color="inherit" component={Link} to="/logs">
                                    View Logs
                                </Button>
                                <Button color="inherit" component={Link} to="/create-user">
                                    Create User
                                </Button>
                            </>
                        )}
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
