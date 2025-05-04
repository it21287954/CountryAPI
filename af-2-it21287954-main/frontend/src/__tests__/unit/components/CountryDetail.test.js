import React from 'react';
import { render, screen } from '@testing-library/react';
import CountryDetail from '../../../components/CountryDetail';

// Mock styled-components to avoid styled-component specific issues in tests
jest.mock('styled-components', () => ({
  ...jest.requireActual('styled-components'),
}));

describe('CountryDetail Component', () => {
  const mockCountry = {
    name: {
      common: 'Finland',
      nativeName: {
        fin: { common: 'Suomi' }
      }
    },
    population: 5536146,
    region: 'Europe',
    subregion: 'Northern Europe',
    capital: ['Helsinki'],
    tld: ['.fi'],
    currencies: {
      EUR: { name: 'Euro', symbol: '€' }
    },
    languages: {
      fin: 'Finnish',
      swe: 'Swedish'
    },
    flags: { svg: 'https://flagcdn.com/fi.svg' },
    cca3: 'FIN',
    borders: ['SWE', 'NOR', 'RUS']
  };

  const mockBorderCountries = [
    { name: { common: 'Sweden' }, cca3: 'SWE' },
    { name: { common: 'Norway' }, cca3: 'NOR' },
    { name: { common: 'Russia' }, cca3: 'RUS' }
  ];

  const mockCountryIncomplete = {
    name: {
      common: 'Island Nation'
    },
    population: 100000,
    region: 'Oceania',
    flags: { svg: 'https://flagcdn.com/xx.svg' },
    cca3: 'XXX'
  };

  it('renders detailed country information correctly', () => {
    render(<CountryDetail country={mockCountry} borderCountries={mockBorderCountries} />);
    
    // Check if country name is displayed
    expect(screen.getByText('Finland')).toBeInTheDocument();
    
    // Check basic information
    expect(screen.getByText('Native Name:')).toBeInTheDocument();
    expect(screen.getByText('Suomi')).toBeInTheDocument();
    
    expect(screen.getByText('Population:')).toBeInTheDocument();
    expect(screen.getByText('5,536,146')).toBeInTheDocument();
    
    expect(screen.getByText('Region:')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    
    expect(screen.getByText('Sub Region:')).toBeInTheDocument();
    expect(screen.getByText('Northern Europe')).toBeInTheDocument();
    
    expect(screen.getByText('Capital:')).toBeInTheDocument();
    expect(screen.getByText('Helsinki')).toBeInTheDocument();
    
    // Check additional information
    expect(screen.getByText('Top Level Domain:')).toBeInTheDocument();
    expect(screen.getByText('.fi')).toBeInTheDocument();
    
    expect(screen.getByText('Currencies:')).toBeInTheDocument();
    expect(screen.getByText('Euro')).toBeInTheDocument();
    
    expect(screen.getByText('Languages:')).toBeInTheDocument();
    expect(screen.getByText('Finnish, Swedish')).toBeInTheDocument();
    
    // Check border countries
    expect(screen.getByText('Border Countries:')).toBeInTheDocument();
    expect(screen.getByText('Sweden')).toBeInTheDocument();
    expect(screen.getByText('Norway')).toBeInTheDocument();
    expect(screen.getByText('Russia')).toBeInTheDocument();
    
    // Check flag image
    const flagImage = screen.getByAltText('Flag of Finland');
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).toHaveAttribute('src', mockCountry.flags.svg);
  });

  it('handles missing data properly', () => {
    render(<CountryDetail country={mockCountryIncomplete} borderCountries={[]} />);
    
    // Check if country name is displayed
    expect(screen.getByText('Island Nation')).toBeInTheDocument();
    
    // For missing properties, should display N/A
    expect(screen.getByText('Native Name:')).toBeInTheDocument();
    expect(screen.getByText('Island Nation')).toBeInTheDocument(); // should use common name when native name is missing
    
    expect(screen.getByText('Sub Region:')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
    
    expect(screen.getByText('Capital:')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
    
    expect(screen.getByText('Top Level Domain:')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
    
    expect(screen.getByText('Currencies:')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
    
    expect(screen.getByText('Languages:')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
    
    // Border countries section should show no border countries
    expect(screen.getByText('Border Countries:')).toBeInTheDocument();
    expect(screen.getByText('No border countries')).toBeInTheDocument();
  });
});