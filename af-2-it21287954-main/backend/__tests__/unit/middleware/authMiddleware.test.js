// File: backend/__tests__/unit/middleware/authMiddleware.test.js
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { protect } = require('../../../middleware/authMiddleware');
const User = require('../../../models/userModel');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../../models/userModel');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer fake-token-123'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should call next() if token is valid', async () => {
    const mockUserId = new mongoose.Types.ObjectId().toString();
    const mockUser = { _id: mockUserId, name: 'Test User', email: 'test@example.com' };

    // Setup mocks for successful authentication
    jwt.verify.mockReturnValue({ id: mockUserId });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });

    await protect(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('fake-token-123', process.env.JWT_SECRET);
    expect(User.findById).toHaveBeenCalledWith(mockUserId);
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });

  it('should return a 401 if token is invalid', async () => {
    // Setup mocks for failed token verification
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await protect(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('fake-token-123', process.env.JWT_SECRET);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe('Not authorized, token failed');
  });

  it('should return a 401 if no token is provided', async () => {
    // Remove authorization header
    req.headers.authorization = undefined;

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe('Not authorized, no token');
  });

  it('should return a 401 if auth header does not start with Bearer', async () => {
    // Invalid auth header format
    req.headers.authorization = 'Basic fake-token-123';

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe('Not authorized, no token');
  });
});