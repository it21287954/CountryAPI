// File: frontend/src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/users';

// Register a new user
export const registerUser = async (name, email, password) => {
  const response = await axios.post(API_URL, {
    name,
    email,
    password,
  });
  return response.data;
};

// Login user
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  return response.data;
};

// Get user profile
export const getUserProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.get(`${API_URL}/profile`, config);
  return response.data;
};