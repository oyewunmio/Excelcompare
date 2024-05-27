import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ComparePage from './ComparePage';
import NavBar from '../components/NavBar';
import axios from 'axios';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
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
  };

  if (isLoading) {
    return <div>Loading...</div>; // You can add a loading spinner here
  }

  return (
    <Router>
      <NavBar username={username} />
      <Routes>
        <Route path="/" element={<ComparePage token={token} setToken={handleSetToken} />} />
      </Routes>
    </Router>
  );
}

export default App;
