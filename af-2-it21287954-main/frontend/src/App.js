// File: frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import CountryDetailsPage from './pages/CountryDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem('userInfo'));
    if (userFromStorage) {
      setUser(userFromStorage);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <Layout user={user} logoutHandler={logoutHandler}>
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/country/:code" element={<CountryDetailsPage />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <LoginPage setUser={setUser} />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/" /> : <RegisterPage setUser={setUser} />} 
        />
      </Routes>
    </Layout>
  );
}

export default App;