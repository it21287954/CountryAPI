// File: frontend/src/pages/LoginPage.js
import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = ({ setUser }) => {
  return (
    <div>
      <LoginForm setUser={setUser} />
    </div>
  );
};

export default LoginPage;