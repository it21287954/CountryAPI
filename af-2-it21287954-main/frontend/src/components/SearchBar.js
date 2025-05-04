// File: frontend/src/components/SearchBar.js
import React from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 14px 14px 50px;
  border-radius: 5px;
  border: none;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  background-color: var(--primary-color);
  color: var(--text-color);
  font-family: inherit;
  &::placeholder {
    color: var(--input-color);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--input-color);
`;

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <SearchContainer>
      <SearchIcon>🔍</SearchIcon>
      <SearchInput
        type="text"
        placeholder="Search for a country..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </SearchContainer>
  );
};

export default SearchBar;