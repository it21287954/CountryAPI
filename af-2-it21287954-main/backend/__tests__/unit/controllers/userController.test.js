// File: backend/__tests__/unit/controllers/userController.test.js
const mongoose = require('mongoose');
const { registerUser, authUser, getUserProfile } = require('../../../controllers/userController');
const User = require('../../../models/userModel');
const generateToken = require('../../../utils/generateToken');

// Mock dependencies
jest.mock('../../../models/userModel');
jest.mock('../../../utils/generateToken');

describe('User Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      user: { _id: new mongoose.Types.ObjectId().toString() }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user and return user data with token', async () => {
      // Setup request data
      req.body = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123'
      };

      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValue(null);

      // Mock User.create to return a new user object
      const newUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        name: req.body.name,
        email: req.body.email,
      };
      User.create.mockResolvedValue(newUser);

      // Mock generateToken to return a test token
      const testToken = 'test-token';
      generateToken.mockReturnValue(testToken);

      // Call the controller function
      await registerUser(req, res, next);

      // Assert status code was set to 201
      expect(res.status).toHaveBeenCalledWith(201);

      // Assert res.json was called with the correct user data and token
      expect(res.json).toHaveBeenCalledWith({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: testToken,
      });

      // Assert next was not called
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if user already exists', async () => {
      // Setup request data
      req.body = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123'
      };

      // Mock User.findOne to simulate an existing user (promise resolves with a user)
      User.findOne.mockResolvedValue({ email: req.body.email });

      // Call the controller function
      await registerUser(req, res, next);

      // Assert status code was set to 400
      expect(res.status).toHaveBeenCalledWith(400);

      // Assert next was called with the error
      expect(next).toHaveBeenCalledWith(new Error('User already exists'));

      // Assert res.json was not called
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with an error if user creation fails', async () => {
      // Setup request data
      req.body = {
        name: 'Failed User',
        email: 'failed@example.com',
        password: 'password123'
      };

      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValue(null);

      // Mock User.create to simulate a creation failure (promise rejects)
      const errorMessage = 'Database error during user creation';
      User.create.mockRejectedValue(new Error(errorMessage));

      // Call the controller function
      await registerUser(req, res, next);

      // Assert that res.status was NOT called (because the error middleware handles the response)
      expect(res.status).not.toHaveBeenCalled();

      // Assert that res.json was NOT called
      expect(res.json).not.toHaveBeenCalled();

      // Assert that next was called with the error
      expect(next).toHaveBeenCalledWith(new Error('Invalid user data')); // Matches the error thrown in the controller
    });
  });

  describe('authUser', () => {
    it('should authenticate user and return user data with token', async () => {
      // Setup request data
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock User.findOne to return a user with matchPassword method
      const foundUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        name: 'Test User',
        email: req.body.email,
        matchPassword: jest.fn().mockResolvedValue(true) // Password matches
      };
      User.findOne.mockResolvedValue(foundUser);

      // Mock generateToken to return a test token
      const testToken = 'auth-token';
      generateToken.mockReturnValue(testToken);

      // Call the controller function
      await authUser(req, res, next);

      // Assert res.json was called with the correct user data and token
      expect(res.json).toHaveBeenCalledWith({
        _id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        token: testToken,
      });

      // Assert next was not called
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user does not exist', async () => {
      // Setup request data
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValue(null);

      // Call the controller function
      await authUser(req, res, next);

      // Assert status code was set to 401
      expect(res.status).toHaveBeenCalledWith(401);

      // Assert next was called with the error
      expect(next).toHaveBeenCalledWith(new Error('Invalid email or password'));

      // Assert res.json was not called
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 401 if password is incorrect', async () => {
      // Setup request data
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      // Mock User.findOne to return a user with matchPassword method
      const foundUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        name: 'Test User',
        email: req.body.email,
        matchPassword: jest.fn().mockResolvedValue(false) // Password doesn't match
      };
      User.findOne.mockResolvedValue(foundUser);

      // Call the controller function
      await authUser(req, res, next);

      // Assert status code was set to 401
      expect(res.status).toHaveBeenCalledWith(401);

      // Assert next was called with the error
      expect(next).toHaveBeenCalledWith(new Error('Invalid email or password'));

      // Assert res.json was not called
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile data if authenticated', async () => {
      // Mock User.findById to return a user object
      const foundUser = {
        _id: req.user._id,
        name: 'Authenticated User',
        email: 'auth@example.com',
      };
      User.findById.mockResolvedValue(foundUser);

      // Call the controller function
      await getUserProfile(req, res, next);

      // Assert res.json was called with the user data
      expect(res.json).toHaveBeenCalledWith({
        _id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
      });

      // Assert next was not called
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 404 if user is not found', async () => {
      // Mock User.findById to return null (user not found)
      User.findById.mockResolvedValue(null);

      // Set the user object in the request
      req.user = { _id: 'non-existent-id' };

      // Call the controller function
      await getUserProfile(req, res, next);

      // Assert status code was set to 404
      expect(res.status).toHaveBeenCalledWith(404);

      // Assert next was called with the error
      expect(next).toHaveBeenCalledWith(new Error('User not found'));

      // Assert res.json was not called
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});