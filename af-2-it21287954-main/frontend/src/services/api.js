// File: frontend/src/services/api.js
import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1';

// Fetch all countries with essential fields
export const fetchAllCountries = async () => {
  const response = await axios.get(`${BASE_URL}/all?fields=name,capital,population,region,flags,cca3`);
  return response.data;
};

// Fetch countries by region
export const fetchCountriesByRegion = async (region) => {
  const response = await axios.get(`${BASE_URL}/region/${region}?fields=name,capital,population,region,flags,cca3`);
  return response.data;
};

// Search countries by name
export const searchCountriesByName = async (name) => {
  const response = await axios.get(`${BASE_URL}/name/${name}?fields=name,capital,population,region,flags,cca3`);
  return response.data;
};

// Fetch country by alpha code
export const fetchCountryByCode = async (code) => {
  const response = await axios.get(`${BASE_URL}/alpha/${code}`);
  return response.data;
};

// Fetch multiple countries by alpha codes
export const fetchCountriesByCodes = async (codes) => {
  const codesString = codes.join(',');
  const response = await axios.get(`${BASE_URL}/alpha?codes=${codesString}&fields=name,cca3`);
  return response.data;
};

// Fetch countries by capital
export const fetchCountriesByCapital = async (capital) => {
  const response = await axios.get(`${BASE_URL}/capital/${capital}`);
  return response.data;
};