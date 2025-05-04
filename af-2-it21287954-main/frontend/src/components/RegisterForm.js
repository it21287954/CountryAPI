// File: frontend/src/components/RegisterForm.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  styled,
} from '@mui/material';

const AuthFormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 400,
  margin: '0 auto',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.paper,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const FormText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const RegisterForm = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const userData = await registerUser(name, email, password);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);
      navigate('/'); // Redirect to home page after successful registration
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormContainer component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" component="h1" gutterBottom>
        Create Account
      </Typography>
      {error && <Alert severity="error" sx={{ marginBottom: '15px' }}>{error}</Alert>}
      <StyledTextField
        label="Name"
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        variant="outlined"
      />
      <StyledTextField
        label="Email Address"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        variant="outlined"
      />
      <StyledTextField
        label="Password"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        variant="outlined"
      />
      <StyledTextField
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        fullWidth
        variant="outlined"
      />
      <StyledButton type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
      </StyledButton>
      <FormText variant="body2" align="center">
        Already have an account?{' '}
        <Link to="/login">Sign In</Link>
      </FormText>
    </AuthFormContainer>
  );
};

export default RegisterForm;