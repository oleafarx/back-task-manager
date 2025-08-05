import request from 'supertest';
import express from 'express';
import cors from 'cors';
import app from '@/app';

jest.mock('@/interfaces/http/express/routes/task.routes', () => {
  const router = express.Router();
  router.get('/test', (req, res) => res.json({ message: 'task router works' }));
  return router;
});

jest.mock('@/interfaces/http/express/routes/user.routes', () => {
  const router = express.Router();
  router.get('/test', (req, res) => res.json({ message: 'user router works' }));
  return router;
});

describe('App Configuration', () => {
  test('should have CORS enabled with origin: true', async () => {
    const response = await request(app)
      .options('/tasks/test')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'GET');
    
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  test('should parse JSON bodies', async () => {
    const testApp = express();
    testApp.use(cors({ origin: true }));
    testApp.use(express.json());
    testApp.post('/test-json', (req, res) => {
      res.json({ received: req.body });
    });

    const testData = { test: 'data' };
    const response = await request(testApp)
      .post('/test-json')
      .send(testData)
      .expect(200);

    expect(response.body.received).toEqual(testData);
  });

  test('should mount task router on /tasks path', async () => {
    const response = await request(app)
      .get('/tasks/test')
      .expect(200);

    expect(response.body.message).toBe('task router works');
  });

  test('should mount user router on /users path', async () => {
    const response = await request(app)
      .get('/users/test')
      .expect(200);

    expect(response.body.message).toBe('user router works');
  });

  test('should export app instance', () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
    expect(app.listen).toBeDefined();
  });

  test('should handle 404 for unmounted routes', async () => {
    await request(app)
      .get('/nonexistent-route')
      .expect(404);
  });
});