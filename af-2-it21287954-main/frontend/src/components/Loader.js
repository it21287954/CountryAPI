// File: frontend/src/components/Loader.js
import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

const SpinnerDiv = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid var(--text-color);
  animation: ${spin} 1s linear infinite;
`;

const Loader = () => {
  return (
    <LoaderContainer>
      <SpinnerDiv />
    </LoaderContainer>
  );
};

export default Loader;