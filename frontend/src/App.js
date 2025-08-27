import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import axios from 'axios';

// Components
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import NewsForm from './components/NewsForm';
import NewsDetail from './components/NewsDetail';
import Profile from './components/Profile';
import UserManagement from './components/UserManagement';
import CategoryManagement from './components/CategoryManagement';

// API base URL
const API_BASE_URL = 'http://localhost:8000/api';

// Axios interceptor untuk menambahkan token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, tokens) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-warning-brutal">
        <div className="text-center">
          <div className="spinner-border border-brutal" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3 className="mt-3 text-brutal">LOADING...</h3>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App bg-warning-brutal min-vh-100">
        <Navbar user={user} onLogout={handleLogout} />
        <Container className="py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/" /> : <Register onLogin={handleLogin} />} 
            />
            <Route 
              path="/dashboard" 
              element={user?.is_staff ? <Dashboard /> : <Navigate to="/" />} 
            />
            <Route 
              path="/news/create" 
              element={user ? <NewsForm /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/news/edit/:id" 
              element={user ? <NewsForm /> : <Navigate to="/login" />} 
            />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin/users" 
              element={user?.is_staff ? <UserManagement /> : <Navigate to="/" />} 
            />
            <Route 
              path="/admin/categories" 
              element={user?.is_staff ? <CategoryManagement /> : <Navigate to="/" />} 
            />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;