import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';

interface NavBarProps {
    username: string | null;
    userRole: string | null;
}

const NavBar: React.FC<NavBarProps> = ({ username, userRole }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const drawerList = () => (
        <div
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                <ListItem button component={Link} to="/logs">
                    <ListItemIcon><ListAltIcon /></ListItemIcon>
                    <ListItemText primary="View Logs" />
                </ListItem>
                <ListItem button component={Link} to="/users">
                    <ListItemIcon><PersonAddIcon /></ListItemIcon>
                    <ListItemText primary="Create User" />
                </ListItem>
                <ListItem button component={Link} to="/users">
                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                    <ListItemText primary="Manage Users" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <>
            <AppBar position="static" style={{ backgroundColor: 'rgb(217,34,41)' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Excel Comparator
                    </Typography>
                    {username && (
                        <Typography variant="body1" style={{ marginRight: '20px' }}>
                            Welcome, {username}
                        </Typography>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerList()}
            </Drawer>
        </>
    );
};

export default NavBar;
