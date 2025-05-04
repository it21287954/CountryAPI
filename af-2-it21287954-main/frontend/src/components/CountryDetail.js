// File: frontend/src/components/CountryDetail.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const DetailContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8), // Equivalent to 60px (assuming default theme spacing)
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(8), // Equivalent to 60px
  alignItems: 'center',
  [theme.breakpoints.down('md')]: { // Equivalent to max-width: 768px
    gridTemplateColumns: '1fr',
  },
}));

const FlagImage = styled('img')(({ theme }) => ({
  width: '100%',
  boxShadow: theme.shadows[2], // Example shadow
}));

const InfoContainer = styled(Box)({});

const CountryName = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3), // Equivalent to 24px
}));

const InfoGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(5), // Equivalent to 40px
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

const InfoColumn = styled(Grid)({
  item: true,
  xs: 12,
  md: 6,
});

const InfoItem = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1.25), // Equivalent to 10px
  '& span': {
    fontWeight: 600,
  },
}));

const BorderCountries = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(5), // Equivalent to 40px
}));

const BorderTitle = styled(Typography)(({ theme }) => ({
  display: 'inline-block',
  marginRight: theme.spacing(2), // Equivalent to 16px
}));

const BorderButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.25), // Equivalent to 10px
  marginTop: theme.spacing(2), // Equivalent to 16px
}));

const BorderButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // Using theme's primary color
  color: theme.palette.primary.contrastText, // Ensuring readable text color
  padding: theme.spacing(0.625, 2.5), // Equivalent to 5px 20px
  boxShadow: theme.shadows[1], // Example shadow
  borderRadius: theme.shape.borderRadius, // Using theme's border radius
  fontSize: '0.875rem', // Equivalent to 14px
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

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
        <CountryName variant="h4" component="h1">{country.name.common}</CountryName>
        <InfoGrid container spacing={4}> {/* Using Grid for layout */}
          <InfoColumn item>
            <InfoItem>
              <span>Native Name: </span>
              {country.name.nativeName
                ? Object.values(country.name.nativeName)[0]?.common
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
          <InfoColumn item>
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
          <BorderTitle variant="h6" component="h3">Border Countries:</BorderTitle>
          <BorderButtonsContainer>
            {borderCountries.length > 0 ? (
              borderCountries.map(border => (
                <BorderButton
                  key={border.cca3}
                  component={Link}
                  to={`/country/${border.cca3}`}
                >
                  {border.name.common}
                </BorderButton>
              ))
            ) : (
              <Typography component="span">No border countries</Typography>
            )}
          </BorderButtonsContainer>
        </BorderCountries>
      </InfoContainer>
    </DetailContainer>
  );
};

export default CountryDetail;