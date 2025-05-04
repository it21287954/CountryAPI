// File: frontend/src/components/FilterRegion.js
import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  position: relative;
  width: 200px;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 14px;
  border-radius: 5px;
  border: none;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  background-color: var(--primary-color);
  color: var(--text-color);
  font-family: inherit;
  appearance: none;
  cursor: pointer;
`;

const FilterIcon = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

const FilterRegion = ({ selectedRegion, onRegionChange }) => {
  return (
    <FilterContainer>
      <FilterSelect 
        value={selectedRegion} 
        onChange={(e) => onRegionChange(e.target.value)}
      >
        <option value="">Filter by Region</option>
        <option value="africa">Africa</option>
        <option value="americas">Americas</option>
        <option value="asia">Asia</option>
        <option value="europe">Europe</option>
        <option value="oceania">Oceania</option>
      </FilterSelect>
      <FilterIcon>▼</FilterIcon>
    </FilterContainer>
  );
};

export default FilterRegion;