import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import CountryDetailsPage from '../../../pages/CountryDetailsPage';
import { AuthProvider } from '../../../context/AuthContext';

// Mock data for Germany
const mockGermanyData = [
  {
    name: {
      common: 'Germany',
      official: 'Federal Republic of Germany',
      nativeName: {
        deu: {
          official: 'Bundesrepublik Deutschland',
          common: 'Deutschland'
        }
      }
    },
    capital: ['Berlin'],
    population: 83240525,
    region: 'Europe',
    subregion: 'Western Europe',
    flags: {
      svg: 'https://restcountries.com/data/deu.svg',
      alt: 'The flag of Germany'
    },
    cca3: 'DEU',
    borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE'],
    tld: ['.de'],
    languages: {
      deu: 'German'
    },
    currencies: {
      EUR: {
        name: 'Euro',
        symbol: '€'
      }
    }
  }
];

// Mock data for border countries
const mockBorderCountries = [
  { name: { common: 'Austria' }, cca3: 'AUT' },
  { name: { common: 'Belgium' }, cca3: 'BEL' },
  { name: { common: 'Czech Republic' }, cca3: 'CZE' },
  { name: { common: 'Denmark' }, cca3: 'DNK' },
  { name: { common: 'France' }, cca3: 'FRA' },
  { name: { common: 'Luxembourg' }, cca3: 'LUX' },
  { name: { common: 'Netherlands' }, cca3: 'NLD' },
  { name: { common: 'Poland' }, cca3: 'POL' },
  { name: { common: 'Switzerland' }, cca3: 'CHE' }
];

// Setup MSW server to intercept API requests
const server = setupServer(
  // Handler for fetching country by alpha code
  rest.get('https://restcountries.com/v3.1/alpha/DEU', (req, res, ctx) => {
    return res(ctx.json(mockGermanyData));
  }),
  
  // Handler for fetching border countries by alpha codes
  rest.get('https://restcountries.com/v3.1/alpha', (req, res, ctx) => {
    // Extract the codes from the query string
    const codes = req.url.searchParams.get('codes');
    
    if (!codes) {
      return res(ctx.status(400), ctx.json({ message: 'Bad Request' }));
    }
    
    const requestedCodes = codes.split(',');
    const filteredBorders = mockBorderCountries.filter(
      country => requestedCodes.includes(country.cca3)
    );
    
    return res(ctx.json(filteredBorders));
  }),
  
  // Handler for non-existent country
  rest.get('https://restcountries.com/v3.1/alpha/XXX', (req, res, ctx) => {
    return res(ctx.status(404), ctx.json({ status: 404, message: 'Not Found' }));
  })
);

// Start the server before all tests
beforeAll(() => server.listen());
// Reset handlers after each test
afterEach(() => server.resetHandlers());
// Close server after all tests
afterAll(() => server.close());

// Helper function to render component with router
const renderWithRouter = (code) => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[`/country/${code}`]}>
        <Routes>
          <Route path="/country/:code" element={<CountryDetailsPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
};

describe('CountryDetailsPage Integration Tests', () => {
  test('loads and displays country details', async () => {
    renderWithRouter('DEU');
    
    // Initially shows loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for country details to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Verify country information is displayed
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('83,240,525')).toBeInTheDocument(); // Formatted population
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('Western Europe')).toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
    
    // Check for additional details
    expect(screen.getByText(/Native Name:/i)).toBeInTheDocument();
    expect(screen.getByText('Deutschland')).toBeInTheDocument();
    expect(screen.getByText(/Top Level Domain:/i)).toBeInTheDocument();
    expect(screen.getByText('.de')).toBeInTheDocument();
    expect(screen.getByText(/Currencies:/i)).toBeInTheDocument();
    expect(screen.getByText('Euro')).toBeInTheDocument();
    expect(screen.getByText(/Languages:/i)).toBeInTheDocument();
    expect(screen.getByText('German')).toBeInTheDocument();
    
    // Check for border countries
    expect(screen.getByText(/Border Countries:/i)).toBeInTheDocument();
    expect(screen.getByText('Austria')).toBeInTheDocument();
    expect(screen.getByText('Belgium')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
    
    // Verify flag image is displayed
    const flagImage = screen.getByAltText('Flag of Germany');
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).toHaveAttribute('src', 'https://restcountries.com/data/deu.svg');
  });
  
  test('handles country with no borders', async () => {
    // Override the handler for a specific country with no borders
    server.use(
      rest.get('https://restcountries.com/v3.1/alpha/ISL', (req, res, ctx) => {
        return res(ctx.json([
          {
            ...mockGermanyData[0],
            name: { common: 'Iceland', official: 'Iceland' },
            borders: [],
            cca3: 'ISL'
          }
        ]));
      })
    );
    
    renderWithRouter('ISL');
    
    // Wait for country details to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Should show "No border countries"
    expect(screen.getByText('No border countries')).toBeInTheDocument();
  });
  
  test('handles API error gracefully', async () => {
    // Override the handler to simulate an error
    server.use(
      rest.get('https://restcountries.com/v3.1/alpha/DEU', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Internal Server Error' }));
      })
    );
    
    renderWithRouter('DEU');
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch country details. Please try again later.')).toBeInTheDocument();
    });
  });
  
  test('handles non-existent country code', async () => {
    renderWithRouter('XXX');
    
    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch country details. Please try again later.')).toBeInTheDocument();
    });
  });
  
  test('back button navigates to previous page', async () => {
    // Mock window.history
    const mockHistoryBack = jest.fn();
    Object.defineProperty(window, 'history', {
      value: { back: mockHistoryBack },
      writable: true
    });
    
    renderWithRouter('DEU');
    
    // Wait for country details to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Find and click back button
    const backButton = screen.getByText('← Back');
    fireEvent.click(backButton);
    
    // Check if history.back was called
    expect(mockHistoryBack).toHaveBeenCalled();
  });
  
  test('border country links have correct href attributes', async () => {
    renderWithRouter('DEU');
    
    // Wait for country details to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Check links to border countries
    const austriaLink = screen.getByText('Austria').closest('a');
    expect(austriaLink).toHaveAttribute('href', '/country/AUT');
    
    const franceLink = screen.getByText('France').closest('a');
    expect(franceLink).toHaveAttribute('href', '/country/FRA');
  });
});