import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ComparePage from './ComparePage';
import LogsPage from './LogsPage';
import NavBar from '../components/NavBar';
import axios from 'axios';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axios.get('http://localhost:8000/get/me', {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
        .then(response => {
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

  if (isLoading) {
    return <div>Loading...</div>; // You can add a loading spinner here
  }

  return (
    <Router>
      <NavBar username={username} userRole={userRole} />
      <Routes>
        <Route path="/" element={<ComparePage token={token} setToken={handleSetToken} />} />
        <Route path="/logs" element={<LogsPage token={token!} />} />
      </Routes>
    </Router>
  );
}

export default App;
