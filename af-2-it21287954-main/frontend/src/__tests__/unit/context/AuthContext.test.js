import React, { createContext, useState, useEffect, useContext } from 'react';
import { registerUser as registerService, loginUser as loginService, getUserProfile as getUserProfileService } from '../../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const profile = await getUserProfileService(parsedUser.token);
          if (profile) {
            setUser(profile);
          } else {
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Error loading user from storage or fetching profile:', error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    loadUserFromStorage();
  }, []);

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const registeredUser = await registerService(username, email, password);
      setUser(registeredUser);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      setLoading(false);
      return registeredUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedInUser = await loginService(email, password);
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setLoading(false);
      return loggedInUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {loading && <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};