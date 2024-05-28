import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface User {
    id: number;
    user_role: string;
    username: string;
    password: string;
    is_active: boolean;
}

const UsersPage: React.FC<{ token: string }> = ({ token }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            toast.error('Error fetching users.');
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8000/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('User deleted successfully.');
            fetchUsers();
        } catch (error) {
            toast.error('Error deleting user.');
        }
    };

    const handleEditUser = (user: User) => {
        setEditUser(user);
        setIsDialogOpen(true);
    };

    const handleUpdateUser = async () => {
        if (editUser) {
            try {
                await axios.patch(`http://localhost:8000/users`, editUser, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success('User updated successfully.');
                setIsDialogOpen(false);
                fetchUsers();
            } catch (error) {
                toast.error('Error updating user.');
            }
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setEditUser(null);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
        if (editUser) {
            const { name, value } = e.target;

            if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
                setEditUser({
                    ...editUser,
                    [name!]: e.target.checked,
                });
            } else {
                setEditUser({
                    ...editUser,
                    [name!]: value,
                });
            }
        }
    };

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={4}>
                <Typography variant="h4" color="primary">Users</Typography>
                <Button variant="contained" color="primary" href="/create-user">
                    Create User
                </Button>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>User Role</TableCell>
                        <TableCell>Active</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.user_role}</TableCell>
                            <TableCell>{user.is_active ? 'Yes' : 'No'}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleEditUser(user)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteUser(user.id)} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {editUser && (
                <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Username"
                            type="text"
                            fullWidth
                            name="username"
                            value={editUser.username}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            label="Password"
                            type="password"
                            fullWidth
                            name="password"
                            value={editUser.password}
                            onChange={handleChange}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>User Role</InputLabel>
                            <Select
                                label="User Role"
                                name="user_role"
                                value={editUser.user_role}
                                onChange={(e) => handleChange(e as React.ChangeEvent<{ name?: string; value: unknown }>)}
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="user">User</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={editUser.is_active}
                                    onChange={handleChange}
                                    name="is_active"
                                    color="primary"
                                />
                            }
                            label="Active"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateUser} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
};

export default UsersPage;
