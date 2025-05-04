import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import HomePage from '../../../pages/HomePage';
import { AuthProvider } from '../../../context/AuthContext';

// Mock data for countries
const mockCountriesData = [
  {
    name: { common: 'United States', official: 'United States of America' },
    capital: ['Washington, D.C.'],
    population: 331002651,
    region: 'Americas',
    flags: { svg: 'https://restcountries.com/data/usa.svg', alt: 'Flag of USA' },
    cca3: 'USA'
  },
  {
    name: { common: 'Germany', official: 'Federal Republic of Germany' },
    capital: ['Berlin'],
    population: 83240525,
    region: 'Europe',
    flags: { svg: 'https://restcountries.com/data/deu.svg', alt: 'Flag of Germany' },
    cca3: 'DEU'
  },
  {
    name: { common: 'Japan', official: 'Japan' },
    capital: ['Tokyo'],
    population: 126476461,
    region: 'Asia',
    flags: { svg: 'https://restcountries.com/data/jpn.svg', alt: 'Flag of Japan' },
    cca3: 'JPN'
  },
  {
    name: { common: 'Kenya', official: 'Republic of Kenya' },
    capital: ['Nairobi'],
    population: 53771296,
    region: 'Africa',
    flags: { svg: 'https://restcountries.com/data/ken.svg', alt: 'Flag of Kenya' },
    cca3: 'KEN'
  }
];

// Setup MSW server to intercept API requests
const server = setupServer(
  // Handler for fetching all countries
  rest.get('https://restcountries.com/v3.1/all', (req, res, ctx) => {
    return res(ctx.json(mockCountriesData));
  }),
  
  // Handler for fetching countries by region
  rest.get('https://restcountries.com/v3.1/region/:region', (req, res, ctx) => {
    const { region } = req.params;
    const filteredCountries = mockCountriesData.filter(
      country => country.region.toLowerCase() === region.toLowerCase()
    );
    return res(ctx.json(filteredCountries));
  }),
  
  // Handler for searching countries by name
  rest.get('https://restcountries.com/v3.1/name/:name', (req, res, ctx) => {
    const { name } = req.params;
    const filteredCountries = mockCountriesData.filter(
      country => country.name.common.toLowerCase().includes(name.toLowerCase())
    );
    
    if (filteredCountries.length === 0) {
      return res(ctx.status(404), ctx.json({ status: 404, message: 'Not Found' }));
    }
    
    return res(ctx.json(filteredCountries));
  })
);

// Start the server before all tests
beforeAll(() => server.listen());
// Reset handlers after each test
afterEach(() => server.resetHandlers());
// Close server after all tests
afterAll(() => server.close());

describe('HomePage Integration Tests', () => {
  test('loads and displays countries from API', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </AuthProvider>
    );
    
    // Initially shows loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Verify all countries are displayed
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('Kenya')).toBeInTheDocument();
    
    // Verify population formatting
    expect(screen.getByText('331,002,651')).toBeInTheDocument(); // US population with formatting
  });
  
  test('filters countries by region selection', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </AuthProvider>
    );
    
    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Select Europe region
    const regionFilter = screen.getByRole('combobox');
    fireEvent.change(regionFilter, { target: { value: 'Europe' } });
    
    // Wait for filtered results
    await waitFor(() => {
      // Should only show Germany from our mock data
      expect(screen.getByText('Germany')).toBeInTheDocument();
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
      expect(screen.queryByText('Japan')).not.toBeInTheDocument();
      expect(screen.queryByText('Kenya')).not.toBeInTheDocument();
    });
    
    // Change to Asia region
    fireEvent.change(regionFilter, { target: { value: 'Asia' } });
    
    // Wait for filtered results
    await waitFor(() => {
      // Should only show Japan from our mock data
      expect(screen.getByText('Japan')).toBeInTheDocument();
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
      expect(screen.queryByText('Germany')).not.toBeInTheDocument();
      expect(screen.queryByText('Kenya')).not.toBeInTheDocument();
    });
  });
  
  test('searches countries by name', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </AuthProvider>
    );
    
    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Search for "Japan"
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    fireEvent.change(searchInput, { target: { value: 'Japan' } });
    
    // Check filtered results
    await waitFor(() => {
      expect(screen.getByText('Japan')).toBeInTheDocument();
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
      expect(screen.queryByText('Germany')).not.toBeInTheDocument();
      expect(screen.queryByText('Kenya')).not.toBeInTheDocument();
    });
    
    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    
    // All countries should be visible again
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Germany')).toBeInTheDocument();
      expect(screen.getByText('Japan')).toBeInTheDocument();
      expect(screen.getByText('Kenya')).toBeInTheDocument();
    });
  });
  
  test('handles API error gracefully', async () => {
    // Override the default handler to simulate an error
    server.use(
      rest.get('https://restcountries.com/v3.1/all', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Internal Server Error' }));
      })
    );
    
    render(
      <AuthProvider>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </AuthProvider>
    );
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch countries. Please try again later.')).toBeInTheDocument();
    });
  });
  
  test('clicking on a country card navigates to country details', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </AuthProvider>
    );
    
    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Find Japan card and click it
    const japanCard = screen.getByText('Japan').closest('a');
    expect(japanCard).toHaveAttribute('href', '/country/JPN');
    
    // In a real browser this would navigate to the country details page
  });
  
  test('combines region filter and search', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </AuthProvider>
    );
    
    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // First filter by region: Americas
    const regionFilter = screen.getByRole('combobox');
    fireEvent.change(regionFilter, { target: { value: 'Americas' } });
    
    // Then search for "united"
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    fireEvent.change(searchInput, { target: { value: 'united' } });
    
    // Should only show United States
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.queryByText('Germany')).not.toBeInTheDocument();
      expect(screen.queryByText('Japan')).not.toBeInTheDocument();
      expect(screen.queryByText('Kenya')).not.toBeInTheDocument();
    });
    
    // Search for something that doesn't exist in Americas
    fireEvent.change(searchInput, { target: { value: 'germany' } });
    
    // Should show "No countries found"
    await waitFor(() => {
      expect(screen.getByText('No countries found')).toBeInTheDocument();
    });
  });
});