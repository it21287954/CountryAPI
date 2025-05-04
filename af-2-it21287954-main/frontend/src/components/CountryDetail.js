// File: frontend/src/components/CountryDetail.js
import React from 'react';
import styled from 'styled-components';

const DetailContainer = styled.div`
  margin-top: 60px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FlagImage = styled.img`
  width: 100%;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
`;

const InfoContainer = styled.div``;

const CountryName = styled.h1`
  margin-bottom: 24px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoColumn = styled.div``;

const InfoItem = styled.div`
  margin-bottom: 10px;
  
  span {
    font-weight: 600;
  }
`;

const BorderCountries = styled.div`
  margin-top: 40px;
`;

const BorderTitle = styled.h3`
  display: inline-block;
  margin-right: 16px;
`;

const BorderButtonsContainer = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
`;

const BorderButton = styled.a`
  background-color: var(--primary-color);
  padding: 5px 20px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  font-size: 14px;
`;

const CountryDetail = ({ country, borderCountries }) => {
  // Get languages as an array
  const languages = country.languages ? Object.values(country.languages) : [];
  
  // Get currencies as an array
  const currencies = country.currencies 
    ? Object.values(country.currencies).map(currency => currency.name)
    : [];

  return (
    <DetailContainer>
      <FlagImage src={country.flags.svg} alt={`Flag of ${country.name.common}`} />
      <InfoContainer>
        <CountryName>{country.name.common}</CountryName>
        <InfoGrid>
          <InfoColumn>
            <InfoItem>
              <span>Native Name: </span>
              {country.name.nativeName 
                ? Object.values(country.name.nativeName)[0].common 
                : country.name.common}
            </InfoItem>
            <InfoItem>
              <span>Population: </span>
              {country.population.toLocaleString()}
            </InfoItem>
            <InfoItem>
              <span>Region: </span>
              {country.region}
            </InfoItem>
            <InfoItem>
              <span>Sub Region: </span>
              {country.subregion || 'N/A'}
            </InfoItem>
            <InfoItem>
              <span>Capital: </span>
              {country.capital?.[0] || 'N/A'}
            </InfoItem>
          </InfoColumn>
          <InfoColumn>
            <InfoItem>
              <span>Top Level Domain: </span>
              {country.tld?.join(', ') || 'N/A'}
            </InfoItem>
            <InfoItem>
              <span>Currencies: </span>
              {currencies.join(', ') || 'N/A'}
            </InfoItem>
            <InfoItem>
              <span>Languages: </span>
              {languages.join(', ') || 'N/A'}
            </InfoItem>
          </InfoColumn>
        </InfoGrid>
        
        <BorderCountries>
          <BorderTitle>Border Countries:</BorderTitle>
          <BorderButtonsContainer>
            {borderCountries.length > 0 ? (
              borderCountries.map(border => (
                <BorderButton key={border.cca3} href={`/country/${border.cca3}`}>
                  {border.name.common}
                </BorderButton>
              ))
            ) : (
              <span>No border countries</span>
            )}
          </BorderButtonsContainer>
        </BorderCountries>
      </InfoContainer>
    </DetailContainer>
  );
};

export default CountryDetail;