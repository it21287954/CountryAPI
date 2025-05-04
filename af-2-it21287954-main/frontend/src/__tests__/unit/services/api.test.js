import axios from 'axios';
import {
  fetchAllCountries,
  fetchCountriesByRegion,
  searchCountriesByName,
  fetchCountryByCode,
  fetchCountriesByCodes,
  fetchCountriesByCapital
} from '../../../services/api';

// Mock axios
jest.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCountries = [
    { name: { common: 'Finland' }, capital: ['Helsinki'], population: 5536146, region: 'Europe', flags: { svg: 'flag.svg' }, cca3: 'FIN' }
  ];

  describe('fetchAllCountries', () => {
    it('should fetch all countries successfully', async () => {
      axios.get.mockResolvedValueOnce({ data: mockCountries });
      
      const result = await fetchAllCountries();
      
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/all?fields=name,capital,population,region,flags,cca3');
      expect(result).toEqual(mockCountries);
    });

    it('should handle errors when fetching all countries', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(fetchAllCountries()).rejects.toThrow(errorMessage);
    });
  });

  describe('fetchCountriesByRegion', () => {
    it('should fetch countries by region successfully', async () => {
      axios.get.mockResolvedValueOnce({ data: mockCountries });
      
      const result = await fetchCountriesByRegion('Europe');
      
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/region/Europe?fields=name,capital,population,region,flags,cca3');
      expect(result).toEqual(mockCountries);
    });

    it('should handle errors when fetching countries by region', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(fetchCountriesByRegion('Europe')).rejects.toThrow(errorMessage);
    });
  });

  describe('searchCountriesByName', () => {
    it('should search countries by name successfully', async () => {
      axios.get.mockResolvedValueOnce({ data: mockCountries });
      
      const result = await searchCountriesByName('Finland');
      
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/name/Finland?fields=name,capital,population,region,flags,cca3');
      expect(result).toEqual(mockCountries);
    });

    it('should handle errors when searching countries by name', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(searchCountriesByName('Finland')).rejects.toThrow(errorMessage);
    });
  });

  describe('fetchCountryByCode', () => {
    it('should fetch country by code successfully', async () => {
      axios.get.mockResolvedValueOnce({ data: mockCountries });
      
      const result = await fetchCountryByCode('FIN');
      
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/alpha/FIN');
      expect(result).toEqual(mockCountries);
    });

    it('should handle errors when fetching country by code', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(fetchCountryByCode('FIN')).rejects.toThrow(errorMessage);
    });
  });

  describe('fetchCountriesByCodes', () => {
    it('should fetch countries by codes successfully', async () => {
      axios.get.mockResolvedValueOnce({ data: mockCountries });
      
      const result = await fetchCountriesByCodes(['FIN', 'SWE']);
      
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/alpha?codes=FIN,SWE&fields=name,cca3');
      expect(result).toEqual(mockCountries);
    });

    it('should handle errors when fetching countries by codes', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(fetchCountriesByCodes(['FIN', 'SWE'])).rejects.toThrow(errorMessage);
    });
  });

  describe('fetchCountriesByCapital', () => {
    it('should fetch countries by capital successfully', async () => {
      axios.get.mockResolvedValueOnce({ data: mockCountries });
      
      const result = await fetchCountriesByCapital('Helsinki');
      
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/capital/Helsinki');
      expect(result).toEqual(mockCountries);
    });

    it('should handle errors when fetching countries by capital', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(fetchCountriesByCapital('Helsinki')).rejects.toThrow(errorMessage);
    });
  });
});