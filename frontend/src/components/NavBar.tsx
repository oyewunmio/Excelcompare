import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem,
    ListItemIcon, ListItemText, useMediaQuery, CssBaseline, Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

interface NavBarProps {
    username: string | null;
    userRole: string | null;
}

const drawerWidth = 240;

const NavBar: React.FC<NavBarProps> = ({ username, userRole }) => {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

    const [drawerOpen, setDrawerOpen] = useState(isLargeScreen);

    useEffect(() => {
        setDrawerOpen(isLargeScreen);
    }, [isLargeScreen]);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const drawerList = () => (
        <div
            role="presentation"
            onClick={!isLargeScreen ? toggleDrawer(false) : undefined}
            onKeyDown={!isLargeScreen ? toggleDrawer(false) : undefined}
            style={{ paddingTop: 64 }}
        >
            <List>
                <ListItem button component={Link} to="/">
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                {userRole === 'admin' && (
                    <>
                        <ListItem button component={Link} to="/create-user">
                            <ListItemIcon><PersonAddIcon /></ListItemIcon>
                            <ListItemText primary="Create" />
                        </ListItem>
                        <ListItem button component={Link} to="/users">
                            <ListItemIcon><PeopleIcon /></ListItemIcon>
                            <ListItemText primary="Manage Users" />
                        </ListItem>
                        <ListItem button component={Link} to="/logs">
                            <ListItemIcon><ListAltIcon /></ListItemIcon>
                            <ListItemText primary="View Logs" />
                        </ListItem>
                    </>
                )}
                {/* Additional links can go here */}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, backgroundColor: 'red' }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer(true)}
                        edge="start"
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {username ? `Welcome, ${username}` : 'Welcome'}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant={isLargeScreen ? "persistent" : "temporary"}
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                {drawerList()}
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {/* Main content goes here */}
            </Box>
        </Box>
    );
};

export default NavBar;
