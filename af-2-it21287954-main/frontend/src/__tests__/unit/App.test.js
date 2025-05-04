import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { AuthProvider } from '../../context/AuthContext';

// Mocking components used in routes
jest.mock('../pages/HomePage', () => {
  return function MockHomePage() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

// Corrected path to CountryDetailsPage
jest.mock('../pages/CountryDetailsPage', () => {
  return function MockCountryDetailsPage() {
    return <div data-testid="country-details-page">Country Details Page</div>;
  };
});

jest.mock('../components/Header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>;
  };
});

jest.mock('../pages/LoginPage', () => {
  return function MockLoginPage() {
    return <div data-testid="login-page">Login Page</div>;
  };
});

jest.mock('../pages/RegisterPage', () => {
  return function MockRegisterPage() {
    return <div data-testid="register-page">Register Page</div>;
  };
});

jest.mock('../pages/NotFoundPage', () => {
  return function MockNotFoundPage() {
    return <div data-testid="not-found-page">Not Found Page</div>;
  };
});

const renderWithRouter = (ui, { route = '/' } = {}) => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[route]}>
        {ui}
      </MemoryRouter>
    </AuthProvider>
  );
};

describe('App Component', () => {
  test('renders the Header on all routes', () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  test('renders HomePage on root route', () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('renders CountryDetailsPage on /country/:code route', () => {
    renderWithRouter(<App />, { route: '/country/USA' });
    expect(screen.getByTestId('country-details-page')).toBeInTheDocument();
  });

  test('renders LoginPage on /login route', () => {
    renderWithRouter(<App />, { route: '/login' });
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('renders RegisterPage on /register route', () => {
    renderWithRouter(<App />, { route: '/register' });
    expect(screen.getByTestId('register-page')).toBeInTheDocument();
  });

  test('renders NotFoundPage on invalid route', () => {
    renderWithRouter(<App />, { route: '/invalid-route' });
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });

  test('renders main container with theme class', () => {
    renderWithRouter(<App />);
    const mainContainer = screen.getByRole('main');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('theme-light'); // Assuming default theme is light
  });
});