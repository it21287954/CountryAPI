import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CountryDetailsPage from '../../../pages/CountryDetailsPage';
import { fetchCountryByCode, fetchCountriesByCodes } from '../../../services/api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate directly

// Mock the react-router-dom module
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ code: 'FIN' }),
  useNavigate: jest.fn(), // Mock useNavigate directly as a jest.fn()
}));

// Mock the api service
jest.mock('../../../services/api', () => ({
  fetchCountryByCode: jest.fn(),
  fetchCountriesByCodes: jest.fn(),
}));

// Mock the CountryDetail component
jest.mock('../../../components/CountryDetail', () => ({ country, borderCountries }) => (
  <div data-testid="country-detail">
    <h1>{country.name.common}</h1>
    <div data-testid="border-countries">
      {borderCountries.map(border => (
        <span key={border.cca3} data-testid={`border-country-${border.cca3}`}>
          {border.name.common}
        </span>
      ))}
    </div>
  </div>
));

// Mock the Loader component
jest.mock('../../../components/Loader', () => () => <div data-testid="loader">Loading...</div>);

describe('CountryDetailsPage Component', () => {
  const mockCountry = {
    name: { common: 'Finland' },
    borders: ['SWE', 'NOR', 'RUS'],
    flags: { svg: 'flag.svg' },
    cca3: 'FIN'
  };

  const mockBorderCountries = [
    { name: { common: 'Sweden' }, cca3: 'SWE' },
    { name: { common: 'Norway' }, cca3: 'NOR' },
    { name: { common: 'Russia' }, cca3: 'RUS' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    fetchCountryByCode.mockResolvedValue([mockCountry]);
    fetchCountriesByCodes.mockResolvedValue(mockBorderCountries);
    useNavigate.mockReturnValue(jest.fn()); // Ensure useNavigate mock returns a function
  });

  it('renders loader initially and then country details', async () => {
    render(
      <BrowserRouter>
        <CountryDetailsPage />
      </BrowserRouter>
    );

    // Should show loader initially
    expect(screen.getByTestId('loader')).toBeInTheDocument();

    // After data is loaded, should show country details
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      expect(screen.getByTestId('country-detail')).toBeInTheDocument();
      expect(screen.getByText('Finland')).toBeInTheDocument();
    });
  });

  it('fetches country details and border countries', async () => {
    render(
      <BrowserRouter>
        <CountryDetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(fetchCountryByCode).toHaveBeenCalledWith('FIN');
      expect(fetchCountriesByCodes).toHaveBeenCalledWith(['SWE', 'NOR', 'RUS']);

      // Check that border countries are displayed
      expect(screen.getByTestId('border-country-SWE')).toBeInTheDocument();
      expect(screen.getByTestId('border-country-NOR')).toBeInTheDocument();
      expect(screen.getByTestId('border-country-RUS')).toBeInTheDocument();
    });
  });

  it('handles country without borders', async () => {
    const countryWithoutBorders = { ...mockCountry, borders: undefined };
    fetchCountryByCode.mockResolvedValue([countryWithoutBorders]);

    render(
      <BrowserRouter>
        <CountryDetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(fetchCountryByCode).toHaveBeenCalledWith('FIN');
      expect(fetchCountriesByCodes).not.toHaveBeenCalled();
      expect(screen.getByTestId('border-countries')).toBeInTheDocument();
      expect(screen.queryByTestId('border-country-SWE')).not.toBeInTheDocument();
    });
  });

  it('displays error message when API call fails', async () => {
    fetchCountryByCode.mockRejectedValue(new Error('Network Error'));

    render(
      <BrowserRouter>
        <CountryDetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      expect(screen.getByText('Failed to fetch country details. Please try again later.')).toBeInTheDocument();
    });
  });

  it('displays country not found message when no country is returned', async () => {
    fetchCountryByCode.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <CountryDetailsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      expect(screen.getByText('Country not found')).toBeInTheDocument();
    });
  });

  it('navigates back when back button is clicked', async () => {
    const mockNavigateFn = jest.fn();
    useNavigate.mockReturnValue(mockNavigateFn);

    render(
      <BrowserRouter>
        <CountryDetailsPage />
      </BrowserRouter>
    );

    // Click back button
    const backButton = screen.getByText('← Back');
    fireEvent.click(backButton);

    expect(mockNavigateFn).toHaveBeenCalledWith(-1);
  });
});