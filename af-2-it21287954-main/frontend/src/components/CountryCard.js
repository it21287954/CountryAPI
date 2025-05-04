// File: frontend/src/components/CountryCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';

const CountryCard = ({ country }) => {
  return (
    <Card sx={{ maxWidth: 345, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
      <CardActionArea component={Link} to={`/country/${country.cca3}`}>
        <CardMedia
          component="img"
          height="160"
          image={country.flags.svg}
          alt={`Flag of ${country.name.common}`}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" fontWeight={800}>
            {country.name.common}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <span>Population:</span> {country.population.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <span>Region:</span> {country.region}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <span>Capital:</span> {country.capital?.[0] || 'N/A'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CountryCard;