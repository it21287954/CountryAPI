import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CountryCard from '../../../components/CountryCard';

// Mock styled-components to avoid styled-component specific issues in tests
jest.mock('styled-components', () => ({
  ...jest.requireActual('styled-components'),
}));

describe('CountryCard Component', () => {
  const mockCountry = {
    name: { common: 'Finland' },
    population: 5536146,
    region: 'Europe',
    capital: ['Helsinki'],
    flags: { svg: 'https://flagcdn.com/fi.svg' },
    cca3: 'FIN'
  };

  const mockCountryNoCapital = {
    name: { common: 'Antarctica' },
    population: 1000,
    region: 'Antarctic',
    capital: [],
    flags: { svg: 'https://flagcdn.com/aq.svg' },
    cca3: 'ATA'
  };

  const renderComponent = (country) => {
    return render(
      <BrowserRouter>
        <CountryCard country={country} />
      </BrowserRouter>
    );
  };

  it('renders the country card with correct information', () => {
    renderComponent(mockCountry);
    
    // Check if country name is displayed
    expect(screen.getByText('Finland')).toBeInTheDocument();
    
    // Check if population is displayed with proper formatting
    expect(screen.getByText('Population:')).toBeInTheDocument();
    expect(screen.getByText('5,536,146')).toBeInTheDocument();
    
    // Check if region is displayed
    expect(screen.getByText('Region:')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    
    // Check if capital is displayed
    expect(screen.getByText('Capital:')).toBeInTheDocument();
    expect(screen.getByText('Helsinki')).toBeInTheDocument();
    
    // Check if flag image exists with correct alt text
    const flagImage = screen.getByAltText('Flag of Finland');
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).toHaveAttribute('src', mockCountry.flags.svg);
    
    // Check if link points to correct country detail page
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/country/FIN');
  });

  it('displays "N/A" when capital is not available', () => {
    renderComponent(mockCountryNoCapital);
    
    expect(screen.getByText('Capital:')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});