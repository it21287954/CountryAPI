// File: frontend/src/pages/CountryDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CountryDetail from '../components/CountryDetail';
import Loader from '../components/Loader';
import { fetchCountryByCode, fetchCountriesByCodes } from '../services/api';
import styled from 'styled-components';

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--primary-color);
  color: var(--text-color);
  padding: 8px 24px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  margin-top: 40px;
  cursor: pointer;
`;

const CountryDetailsPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getCountryDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch country details
        const countryData = await fetchCountryByCode(code);
        setCountry(countryData[0]);
        
        // Fetch border countries if available
        if (countryData[0]?.borders?.length > 0) {
          const borders = await fetchCountriesByCodes(countryData[0].borders);
          setBorderCountries(borders);
        } else {
          setBorderCountries([]);
        }
      } catch (err) {
        setError('Failed to fetch country details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    getCountryDetails();
  }, [code]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <BackButton onClick={handleGoBack}>
        ← Back
      </BackButton>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <p style={{ textAlign: 'center', marginTop: '40px' }}>{error}</p>
      ) : country ? (
        <CountryDetail country={country} borderCountries={borderCountries} />
      ) : (
        <p style={{ textAlign: 'center', marginTop: '40px' }}>Country not found</p>
      )}
    </div>
  );
};

export default CountryDetailsPage;