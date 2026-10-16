import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

const app = createApp();

describe('API Health and Public Endpoints', () => {
  it('GET /api/health should return healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toContain('Baba Anandeshwar');
  });

  it('GET /api/settings should return public business settings', async () => {
    const res = await request(app).get('/api/settings');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.business_info).toBeDefined();
    expect(res.body.data.business_info.name).toBe('Baba Anandeshwar Internet Cafe');
    expect(res.body.data.business_info.city).toBe('Kanpur');
  });

  it('POST /api/appointments should reject missing required fields with 400', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({
        customer_name: 'An',
      });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/appointments should reject invalid phone numbers with 400', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({
        customer_name: 'Rahul Sharma',
        customer_phone: '1234567890', // invalid prefix
        service_id: 'c0000000-0000-0000-0000-000000000001',
        appointment_date: '2025-06-01',
        start_time: '10:00',
        consent: true,
      });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/appointments/lookup should reject missing booking reference with 400', async () => {
    const res = await request(app)
      .post('/api/appointments/lookup')
      .send({
        customer_phone: '9876543210',
      });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('GET /api/admin/dashboard should reject unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/admin/dashboard');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHENTICATED');
  });

  it('GET /api/admin/appointments should reject requests without valid token with 401', async () => {
    const res = await request(app).get('/api/admin/appointments');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHENTICATED');
  });
});
