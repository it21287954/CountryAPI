// File: frontend/src/components/Loader.js
import React from 'react';
import { CircularProgress, Box, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';

const LoaderContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 100,
});

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  animation: `${spin} 1s linear infinite`,
  color: theme.palette.text.primary,
}));

const Loader = () => {
  return (
    <LoaderContainer>
      <StyledCircularProgress />
    </LoaderContainer>
  );
};

export default Loader;