// File: frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import CountryCard from '../components/CountryCard';
import SearchBar from '../components/SearchBar';
import FilterRegion from '../components/FilterRegion';
import Loader from '../components/Loader';
import { fetchAllCountries, fetchCountriesByRegion } from '../services/api';

const HomePage = ({ user }) => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch countries based on selected region
  useEffect(() => {
    const getCountries = async () => {
      try {
        setLoading(true);
        setError('');
        
        let data;
        if (selectedRegion) {
          data = await fetchCountriesByRegion(selectedRegion);
        } else {
          data = await fetchAllCountries();
        }
        
        setCountries(data);
        setFilteredCountries(data);
      } catch (err) {
        setError('Failed to fetch countries. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    getCountries();
  }, [selectedRegion]);

  // Filter countries based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country => 
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchTerm, countries]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
  };

  return (
    <div>
      <div className="search-filter-container">
        <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        <FilterRegion selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />
      </div>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <p style={{ textAlign: 'center', marginTop: '40px' }}>{error}</p>
      ) : filteredCountries.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '40px' }}>No countries found</p>
      ) : (
        <div className="countries-grid">
          {filteredCountries.map(country => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;