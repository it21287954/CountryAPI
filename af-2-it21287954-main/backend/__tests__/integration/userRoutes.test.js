// File: backend/__tests__/integration/userRoutes.test.js
const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const User = require('../../models/userModel');
const userRoutes = require('../../routes/userRoutes');
const { errorHandler } = require('../../middleware/errorMiddleware');
const dbHandler = require('../db-handler');

// Create an express app for testing
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use(errorHandler);

describe('User Routes Integration Tests', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  beforeEach(async () => {
    // Clear users collection before each test
    await dbHandler.clearDatabase();
  });

  describe('POST /api/users (Register)', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Integration Test User',
        email: 'integration@test.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/users')
        .send(userData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', userData.name);
      expect(res.body).toHaveProperty('email', userData.email);
      expect(res.body).toHaveProperty('token');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should not register a user with an existing email', async () => {
      // First create a user
      const userData = {
        name: 'Existing User',
        email: 'existing@test.com',
        password: 'password123'
      };

      await User.create(userData);

      // Try to create another user with the same email
      const res = await request(app)
        .post('/api/users')
        .send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should not register a user with missing fields', async () => {
      const userDataWithoutEmail = {
        name: 'Incomplete User',
        password: 'password123'
      };

      let res = await request(app)
        .post('/api/users')
        .send(userDataWithoutEmail);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');

      const userDataWithoutPassword = {
        name: 'Another Incomplete User',
        email: 'incomplete@test.com',
      };

      res = await request(app)
        .post('/api/users')
        .send(userDataWithoutPassword);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');

      const userDataWithoutName = {
        email: 'yet.another@test.com',
        password: 'securepassword'
      };

      res = await request(app)
        .post('/api/users')
        .send(userDataWithoutName);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/login (Login)', () => {
    it('should login an existing user', async () => {
      // First create a user
      const userData = {
        name: 'Login Test User',
        email: 'login@test.com',
        password: 'password123'
      };

      await User.create(userData);

      // Now try to login
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', userData.name);
      expect(res.body).toHaveProperty('email', userData.email);
      expect(res.body).toHaveProperty('token');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should not login with incorrect password', async () => {
      // First create a user
      const userData = {
        name: 'Wrong Password User',
        email: 'wrong@test.com',
        password: 'password123'
      };

      await User.create(userData);

      // Try to login with wrong password
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });
  });

  describe('GET /api/users/profile (Get User Profile)', () => {
    it('should get profile for authenticated user', async () => {
      // First create and login a user to get token
      const userData = {
        name: 'Profile Test User',
        email: 'profile@test.com',
        password: 'password123'
      };

      const user = await User.create(userData);
      const token = await request(app)
        .post('/api/users/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .then(res => res.body.token);

      // Get user profile with token
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id', user._id.toString());
      expect(res.body).toHaveProperty('name', userData.name);
      expect(res.body).toHaveProperty('email', userData.email);
      expect(res.body).not.toHaveProperty('password');
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app)
        .get('/api/users/profile');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Not authorized, no token');
    });

    it('should return 401 for invalid token', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Not authorized, token failed');
    });
  });
});