// File: frontend/src/components/Layout.js
import React from 'react';
import Header from './Header';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const Main = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3), // Example padding
  margin: '0 auto', // Center the content horizontally
  maxWidth: theme.breakpoints.values.lg, // Example max width (adjust as needed)
}));

const Layout = ({ children, user, logoutHandler }) => {
  return (
    <>
      <Header user={user} logoutHandler={logoutHandler} />
      <Main component="main">
        {children}
      </Main>
    </>
  );
};

export default Layout;