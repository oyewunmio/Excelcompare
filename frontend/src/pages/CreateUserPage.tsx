import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import { Navigate } from 'react-router-dom';

interface CreateUserPageProps {
    token: string | null;
}

const CreateUserPage: React.FC<CreateUserPageProps> = ({ token }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        if (token) {
            axios
                .get('http://localhost:8000/get/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setIsAdmin(response.data.user_role === 'admin');
                })
                .catch(() => {
                    setIsAdmin(false);
                });
        } else {
            setIsAdmin(false);
        }
    }, [token]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await axios.post(
                'http://localhost:8000/users',
                { username, password, is_active: isActive },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('User created successfully!');
            setUsername('');
            setPassword('');
            setIsActive(true);
        } catch (error) {
            toast.error('Error creating user.');
        }
    };

    if (isAdmin === false) {
        return <Navigate to="/" />;
    }

    if (isAdmin === null) {
        return <div>Loading...</div>; // Add a loading spinner here if desired
    }

    return (
        <Container maxWidth="sm">
            <Box mt={4} mb={4}>
                <Typography variant="h4" color="primary" gutterBottom>
                    Create New User
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box mb={2}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            style={{ backgroundColor: 'rgb(217,34,41)' }}
                        >
                            Create User
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default CreateUserPage;
