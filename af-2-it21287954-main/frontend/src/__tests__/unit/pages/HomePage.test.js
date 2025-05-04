import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../../../pages/HomePage';
import * as api from '../../../services/api';
import Loader from '../../../components/Loader'; // Import Loader
import FilterRegion from '../../../components/FilterRegion'; // Import FilterRegion

// Mock the API module
jest.mock('../../../services/api');

// Mock the Loader component
jest.mock('../../../components/Loader', () => () => <div data-testid="loader">Loading...</div>);

// Mock the FilterRegion component
jest.mock('../../../components/FilterRegion', () => ({ onRegionChange, selectedRegion }) => (
  <select
    data-testid="region-select"
    onChange={(e) => onRegionChange(e.target.value)}
    value={selectedRegion}
  >
    <option value="">Filter by Region</option>
    <option value="Europe">Europe</option>
    <option value="Americas">Americas</option>
    <option value="Asia">Asia</option>
    <option value="Africa">Africa</option>
    <option value="Oceania">Oceania</option>
  </select>
));

const mockCountries = [
  {
    name: { common: 'United States' },
    capital: ['Washington, D.C.'],
    population: 331002651,
    region: 'Americas',
    flags: { svg: 'https://example.com/us-flag.svg' },
    cca3: 'USA',
  },
  {
    name: { common: 'Germany' },
    capital: ['Berlin'],
    population: 83240525,
    region: 'Europe',
    flags: { svg: 'https://example.com/germany-flag.svg' },
    cca3: 'DEU',
  },
  {
    name: { common: 'Japan' },
    capital: ['Tokyo'],
    population: 126476461,
    region: 'Asia',
    flags: { svg: 'https://example.com/japan-flag.svg' },
    cca3: 'JPN',
  },
];

describe('HomePage Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Default mock implementation for fetchAllCountries
    api.fetchAllCountries.mockResolvedValue(mockCountries);
    api.fetchCountriesByRegion.mockResolvedValue(mockCountries.filter((c) => c.region === 'Europe'));
  });

  test('renders HomePage with loading state initially', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders country cards after loading', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    // Check if countries are displayed
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('Japan')).toBeInTheDocument();
  });

  test('filters countries by search term', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    // Enter search term
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    fireEvent.change(searchInput, { target: { value: 'japan' } });

    // Check if only Japan is displayed
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.queryByText('United States')).not.toBeInTheDocument();
    expect(screen.queryByText('Germany')).not.toBeInTheDocument();
  });

  test('filters countries by region', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    // Find and change the region dropdown
    const regionSelect = screen.getByTestId('region-select');
    fireEvent.change(regionSelect, { target: { value: 'Europe' } });

    // API should be called with 'Europe'
    expect(api.fetchCountriesByRegion).toHaveBeenCalledWith('Europe');

    // Wait for filtered results
    await waitFor(() => {
      // Only Germany should be in the document (Europe region based on mock)
      expect(screen.getByText('Germany')).toBeInTheDocument();
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
      expect(screen.queryByText('Japan')).not.toBeInTheDocument();
    });
  });

  test('displays error message when API fails', async () => {
    // Mock API to reject
    api.fetchAllCountries.mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch countries. Please try again later.')).toBeInTheDocument();
    });
  });

  test('displays "No countries found" when search has no matches', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    // Enter search term with no matches
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    fireEvent.change(searchInput, { target: { value: 'Nonexistent Country' } });

    // Check for no results message
    expect(screen.getByText('No countries found')).toBeInTheDocument();
  });
});