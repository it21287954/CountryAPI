import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../../../components/SearchBar';

// Mock styled-components to avoid styled-component specific issues in tests
jest.mock('styled-components', () => ({
  ...jest.requireActual('styled-components'),
}));

describe('SearchBar Component', () => {
  const mockOnSearchChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search bar with correct placeholder', () => {
    render(<SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />);
    
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    expect(searchInput).toBeInTheDocument();
  });

  it('displays the search term value', () => {
    render(<SearchBar searchTerm="Finland" onSearchChange={mockOnSearchChange} />);
    
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    expect(searchInput).toHaveValue('Finland');
  });

  it('calls onSearchChange when input value changes', () => {
    render(<SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />);
    
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    
    fireEvent.change(searchInput, { target: { value: 'Finland' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('Finland');
    
    fireEvent.change(searchInput, { target: { value: 'Sweden' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('Sweden');
    
    // Check if function was called correct number of times
    expect(mockOnSearchChange).toHaveBeenCalledTimes(2);
  });

  it('renders search icon', () => {
    render(<SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />);
    
    // Check if search icon is present (this might need to be adjusted based on how you're implementing the icon)
    const searchIcon = screen.getByText('🔍');
    expect(searchIcon).toBeInTheDocument();
  });
});