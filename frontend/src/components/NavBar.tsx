import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, CssBaseline, Box } from '@mui/material';
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

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const drawerList = () => (
        <div
            role="presentation"
            onClick={isLargeScreen ? undefined : toggleDrawer(false)}
            onKeyDown={isLargeScreen ? undefined : toggleDrawer(false)}
            style={{ paddingTop: 64 }}
        >
            <List>
                <ListItem button component={Link} to="/">
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                {userRole === 'admin' && (
                    <>
                        <ListItem button component={Link} to="/logs">
                            <ListItemIcon><ListAltIcon /></ListItemIcon>
                            <ListItemText primary="View Logs" />
                        </ListItem>
                        <ListItem button component={Link} to="/create-user">
                            <ListItemIcon><PersonAddIcon /></ListItemIcon>
                            <ListItemText primary="Create User" />
                        </ListItem>
                        <ListItem button component={Link} to="/users">
                            <ListItemIcon><PeopleIcon /></ListItemIcon>
                            <ListItemText primary="Manage Users" />
                        </ListItem>
                    </>
                )}
            </List>
        </div>
    );

    return (
        <div style={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                style={{ backgroundColor: 'rgb(217,34,41)', zIndex: theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(!drawerOpen)}
                        style={{ marginRight: 20 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Excel Comparator
                    </Typography>
                    {username && (
                        <Typography variant="body1" style={{ marginLeft: 'auto' }}>
                            Welcome, {username}
                        </Typography>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                variant={isLargeScreen ? 'persistent' : 'temporary'}
                style={{ width: drawerWidth }}
                PaperProps={{ style: { width: drawerWidth } }}
            >
                {drawerList()}
            </Drawer>
            <Box component="main" style={{ flexGrow: 1, padding: theme.spacing(3), marginLeft: isLargeScreen && drawerOpen ? drawerWidth : 0, marginTop: 64 }}>
                {/* Page content goes here */}
                <Toolbar />
            </Box>
        </div>
    );
};

export default NavBar;
