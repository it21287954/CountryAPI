// File: frontend/src/pages/RegisterPage.js
import React from 'react';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = ({ setUser }) => {
  return (
    <div>
      <RegisterForm setUser={setUser} />
    </div>
  );
};

export default RegisterPage;