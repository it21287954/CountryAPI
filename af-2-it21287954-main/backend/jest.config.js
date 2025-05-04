// File: backend/jest.config.js
module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    coveragePathIgnorePatterns: ['/node_modules/', '/config/'],
    testMatch: ['**/__tests__/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
    verbose: true
  };