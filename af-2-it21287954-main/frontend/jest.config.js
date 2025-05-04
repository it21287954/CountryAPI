// frontend/jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupTests.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '.+\\.(css|scss|png|jpg|svg)$': 'jest-transform-stub'
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/public/src/$1'
  },
  collectCoverageFrom: [
    'public/src/**/*.{js,jsx}',
    '!public/src/**/*.test.{js,jsx}',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
};