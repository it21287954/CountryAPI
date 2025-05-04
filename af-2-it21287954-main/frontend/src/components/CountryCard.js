// File: frontend/src/components/CountryCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled(Link)`
  background-color: var(--primary-color);
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  display: block;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CardImage = styled.div`
  height: 160px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardContent = styled.div`
  padding: 24px;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 16px;
`;

const CardInfo = styled.div`
  margin-bottom: 8px;
  
  span {
    font-weight: 600;
  }
`;

const CountryCard = ({ country }) => {
  return (
    <Card to={`/country/${country.cca3}`}>
      <CardImage>
        <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} />
      </CardImage>
      <CardContent>
        <CardTitle>{country.name.common}</CardTitle>
        <CardInfo>
          <span>Population:</span> {country.population.toLocaleString()}
        </CardInfo>
        <CardInfo>
          <span>Region:</span> {country.region}
        </CardInfo>
        <CardInfo>
          <span>Capital:</span> {country.capital?.[0] || 'N/A'}
        </CardInfo>
      </CardContent>
    </Card>
  );
};

export default CountryCard;