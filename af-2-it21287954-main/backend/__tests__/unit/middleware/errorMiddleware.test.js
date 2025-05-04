// File: backend/__tests__/unit/middleware/errorMiddleware.test.js
const { notFound, errorHandler } = require('../../../middleware/errorMiddleware');

describe('Error Middleware', () => {
  describe('notFound Middleware', () => {
    it('should create a 404 error for non-existent routes', () => {
      const req = {
        originalUrl: '/non-existent-route'
      };
      const res = {
        status: jest.fn()
      };
      const next = jest.fn();

      notFound(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Not Found - /non-existent-route');
    });
  });

  describe('errorHandler Middleware', () => {
    it('should return error response with status code from response', () => {
      const err = new Error('Test error');
      const req = {};
      const res = {
        statusCode: 400,
        status: jest.fn(),
        json: jest.fn()
      };
      const next = jest.fn();

      process.env.NODE_ENV = 'production';

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Test error',
        stack: null
      });
    });

    it('should return 500 if status code is 200', () => {
      const err = new Error('Server error');
      const req = {};
      const res = {
        statusCode: 200,
        status: jest.fn(),
        json: jest.fn()
      };
      const next = jest.fn();

      process.env.NODE_ENV = 'production';

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error',
        stack: null
      });
    });

    it('should include stack trace in development environment', () => {
      const err = new Error('Development error');
      err.stack = 'Error stack trace';
      const req = {};
      const res = {
        statusCode: 400,
        status: jest.fn(),
        json: jest.fn()
      };
      const next = jest.fn();

      process.env.NODE_ENV = 'development';

      errorHandler(err, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Development error',
        stack: 'Error stack trace'
      });
    });
  });
});