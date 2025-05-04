// File: frontend/src/components/LoginForm.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../services/authService';

const LoginForm = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const userData = await loginUser(email, password);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="form-button" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      <div className="form-text">
        New to Countries Explorer?{' '}
        <Link to="/register">Create an account</Link>
      </div>
    </form>
  );
};

export default LoginForm;