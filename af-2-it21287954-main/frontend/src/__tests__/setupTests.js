// frontend/setupTests.js
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Helper to reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Add any other global test setup here