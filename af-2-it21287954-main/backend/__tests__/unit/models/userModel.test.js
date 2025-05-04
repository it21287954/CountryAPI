// File: backend/__tests__/unit/models/userModel.test.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../../models/userModel');
const { MongoMemoryServer } = require('mongodb-memory-server'); // For in-memory testing

// Mock bcrypt to avoid actual hashing during tests
jest.mock('bcryptjs');

describe('User Model Test', () => {
  let mockUser;
  let mongoServer;

  beforeAll(async () => {
    // Start an in-memory MongoDB server for testing
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect Mongoose to the in-memory database
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await User.deleteMany({}); // Deletes all documents in the User collection
    mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    // Mock bcrypt implementations
    bcrypt.compare.mockResolvedValue(true);
    bcrypt.genSalt.mockResolvedValue('mockedSalt');
    bcrypt.hash.mockResolvedValue('hashedPassword');
  });

  afterAll(async () => {
    // Disconnect Mongoose
    await mongoose.disconnect();
    // Stop the in-memory MongoDB server
    await mongoServer.stop();
  });

  it('should create a new user', async () => {
    const userObj = new User(mockUser);
    const savedUser = await userObj.save();

    // Validate the saved user
    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(mockUser.name);
    expect(savedUser.email).toBe(mockUser.email);
    expect(Array.isArray(savedUser.favoriteCountries)).toBe(true);
    expect(savedUser.favoriteCountries.length).toBe(0);
  });

  it('should hash password before saving', async () => {
    const userObj = new User(mockUser);

    // Trigger the pre-save middleware
    await userObj.save();

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 'mockedSalt');
    expect(userObj.password).toBe('hashedPassword');
  });

  it('should correctly match passwords', async () => {
    const userObj = new User(mockUser);
    await userObj.save();

    const isMatch = await userObj.matchPassword('password123');

    expect(bcrypt.compare).toHaveBeenCalledWith('password123', userObj.password);
    expect(isMatch).toBe(true);
  });

  it('should not hash password if it is not modified', async () => {
    const userObj = new User(mockUser);
    await userObj.save();

    // Clear mocks AFTER the initial save
    jest.clearAllMocks();

    // Update a field other than password
    userObj.name = 'Updated Name';
    await userObj.save(); // Save again after modification

    expect(bcrypt.genSalt).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it('should require name field', async () => {
    const userWithoutName = new User({
      email: 'test@example.com',
      password: 'password123'
    });

    let error;
    try {
      await userWithoutName.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
  });

  it('should require email field', async () => {
    const userWithoutEmail = new User({
      name: 'Test User',
      password: 'password123'
    });

    let error;
    try {
      await userWithoutEmail.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it('should require password field', async () => {
    const userWithoutPassword = new User({
      name: 'Test User',
      email: 'test@example.com'
    });

    let error;
    try {
      await userWithoutPassword.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });
});