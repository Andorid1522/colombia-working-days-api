import request from 'supertest';
import express from 'express';
import { calculateWorkingDays } from '../../../src/handlers/api';

const app = express();
app.get('/test', calculateWorkingDays);

describe('API Handler', () => {
  describe('Successful requests', () => {
    it('should return 200 with valid days parameter', async () => {
      const response = await request(app)
        .get('/test')
        .query({ days: '1' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('date');
      expect(typeof response.body.date).toBe('string');
      expect(response.body.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should return 200 with valid hours parameter', async () => {
      const response = await request(app)
        .get('/test')
        .query({ hours: '4' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('date');
      expect(typeof response.body.date).toBe('string');
    });

    it('should return 200 with both days and hours', async () => {
      const response = await request(app)
        .get('/test')
        .query({ days: '2', hours: '3' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('date');
    });

    it('should return 200 with custom start date', async () => {
      const response = await request(app)
        .get('/test')
        .query({ 
          days: '1', 
          date: '2025-01-15T13:00:00.000Z' 
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('date');
    });
  });

  describe('Error handling', () => {
    it('should return 400 when no parameters provided', async () => {
      const response = await request(app)
        .get('/test');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'InvalidParameters');
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid days parameter', async () => {
      const response = await request(app)
        .get('/test')
        .query({ days: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'InvalidParameters');
    });

    it('should return 400 for negative days', async () => {
      const response = await request(app)
        .get('/test')
        .query({ days: '-1' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'InvalidParameters');
    });

    it('should return 400 for invalid hours parameter', async () => {
      const response = await request(app)
        .get('/test')
        .query({ hours: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'InvalidParameters');
    });

    it('should return 400 for invalid date format', async () => {
      const response = await request(app)
        .get('/test')
        .query({ 
          days: '1', 
          date: '2025-01-15' 
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'InvalidParameters');
    });

    it('should return 400 for date without Z suffix', async () => {
      const response = await request(app)
        .get('/test')
        .query({ 
          days: '1', 
          date: '2025-01-15T13:00:00.000' 
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'InvalidParameters');
    });
  });

  describe('Response format', () => {
    it('should return exact response format for success', async () => {
      const response = await request(app)
        .get('/test')
        .query({ days: '1' });

      expect(response.status).toBe(200);
      expect(Object.keys(response.body)).toEqual(['date']);
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should return exact error format', async () => {
      const response = await request(app)
        .get('/test');

      expect(response.status).toBe(400);
      expect(Object.keys(response.body).sort()).toEqual(['error', 'message']);
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });
});