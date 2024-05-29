import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import ComparePage from './ComparePage';
import LogsPage from './LogsPage';
import CreateUserPage from './CreateUserPage';
import UsersPage from './UsersPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axios
        .get('http://localhost:8000/get/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((response) => {
          setToken(storedToken);
          setUsername(response.data.username);
          setUserRole(response.data.user_role);
          setIsLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleSetToken = (token: string, username: string) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUsername(username);
    // Fetch user role after setting the token
    axios.get('http://localhost:8000/get/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setUserRole(response.data.user_role);
      });
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
  };

  if (isLoading) {
    return <div>Loading...</div>; // Add a loading spinner here if desired
  }

  return (
    <Router>
      <NavBar username={username} userRole={userRole} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<ComparePage token={token} setToken={handleSetToken} />} />
        <Route path="/logs" element={<LogsPage token={token} />} />
        <Route path="/create-user" element={<CreateUserPage token={token} />} />
        <Route path="/users" element={<UsersPage token={token} />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
