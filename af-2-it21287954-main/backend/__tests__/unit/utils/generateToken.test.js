// File: backend/__tests__/unit/utils/generateToken.test.js
const jwt = require('jsonwebtoken');
const generateToken = require('../../../utils/generateToken');

// Mock jwt to avoid actual token generation during tests
jest.mock('jsonwebtoken');

describe('Generate Token Utility', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a token with the correct payload and options', () => {
    // Mock implementation for jwt.sign
    jwt.sign.mockReturnValue('fake-token-123');

    const userId = '123456';
    const token = generateToken(userId);

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    expect(token).toBe('fake-token-123');
  });
});