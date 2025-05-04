// File: backend/__tests__/unit/server.test.js
const request = require('supertest');
const express = require('express');
const cors = require('cors');
const userRoutes = require('../../routes/userRoutes');
const { notFound, errorHandler } = require('../../middleware/errorMiddleware');

describe('Server Configuration', () => {
  let app;

  beforeEach(() => {
    // Create a new express app for each test
    app = express();
    app.use(express.json());
    app.use(cors());

    // Define the root path route BEFORE notFound
    app.get('/', (req, res) => {
      res.json({ message: 'API is running' });
    });

    // Define the test endpoint BEFORE other middleware
    app.post('/test-json', (req, res) => {
      res.json({ received: req.body });
    });

    app.use('/api/users', userRoutes);

    // Error middleware should come after your routes
    app.use(notFound);
    app.use(errorHandler);
  });

  it('should return a 200 response for the root path', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'API is running');
  });

  it('should return a 404 response for non-existent routes', async () => {
    const res = await request(app).get('/non-existent-route');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Not Found');
  });

  it('should parse JSON body correctly', async () => {
    const testData = { name: 'Test User', email: 'test@example.com' };
    const res = await request(app)
      .post('/test-json')
      .send(testData)
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('received');
    expect(res.body.received).toEqual(testData);
  });

  it('should handle CORS correctly', async () => {
    const res = await request(app).get('/');

    // Check for CORS headers
    expect(res.headers).toHaveProperty('access-control-allow-origin');
  });

  it('should route /api/users requests to the user routes', async () => {
    // This is a basic connectivity test
    // Complete verification would be done in the integration tests
    const res = await request(app).get('/api/users/non-existent');

    // Since this route doesn't exist in userRoutes, it should return 404
    // But it should be processed by the userRoutes module first
    expect(res.statusCode).toBe(404);
  });
});