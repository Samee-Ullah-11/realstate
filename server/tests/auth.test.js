import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { connectTestDb, disconnectTestDb } from './helpers';

let app;

beforeAll(async () => {
  await connectTestDb();
  const createApp = (await import('../app')).default;
  app = createApp();
  const authService = (await import('../services/auth.service')).default;
  await authService.createUser({
    email: 'admin@test.local',
    password: 'correct-horse-9',
    name: 'Test Admin',
    role: 'admin',
  });
  await authService.createUser({
    email: 'user@test.local',
    password: 'plain-user-pw-9',
    name: 'Test User',
    role: 'user',
  });
});

afterAll(disconnectTestDb);

function cookieOf(res) {
  return res.headers['set-cookie'][0].split(';')[0];
}

describe('auth', () => {
  it('rejects a wrong password with the same message as a wrong email', async () => {
    const wrongPassword = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.local', password: 'nope-nope-nope' });
    const wrongEmail = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'ghost@test.local', password: 'nope-nope-nope' });
    expect(wrongPassword.status).toBe(401);
    expect(wrongEmail.status).toBe(401);
    expect(wrongPassword.body.error).toBe(wrongEmail.body.error);
  });

  it('rejects malformed input', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'not-an-email', password: '' });
    expect(res.status).toBe(400);
  });

  it('logs in and sets an httpOnly cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.local', password: 'correct-horse-9' });
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('admin');
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.headers['set-cookie'][0]).toMatch(/HttpOnly/i);
  });

  it('blocks admin routes without a cookie', async () => {
    const res = await request(app).get('/api/v1/admin/properties');
    expect(res.status).toBe(401);
  });

  it('blocks admin routes for the user role', async () => {
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@test.local', password: 'plain-user-pw-9' });
    const res = await request(app)
      .get('/api/v1/admin/properties')
      .set('Cookie', cookieOf(login));
    expect(res.status).toBe(403);
  });

  it('allows admin routes with an admin cookie', async () => {
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.local', password: 'correct-horse-9' });
    const res = await request(app)
      .get('/api/v1/admin/properties')
      .set('Cookie', cookieOf(login));
    expect(res.status).toBe(200);
  });

  it('changes the password and invalidates the old one', async () => {
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.local', password: 'correct-horse-9' });
    const cookie = cookieOf(login);

    const change = await request(app)
      .patch('/api/v1/auth/password')
      .set('Cookie', cookie)
      .send({ currentPassword: 'correct-horse-9', newPassword: 'brand-new-pw-10' });
    expect(change.status).toBe(200);

    const oldLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.local', password: 'correct-horse-9' });
    expect(oldLogin.status).toBe(401);

    const newLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.local', password: 'brand-new-pw-10' });
    expect(newLogin.status).toBe(200);
  });

  it('logout clears the cookie', async () => {
    const res = await request(app).post('/api/v1/auth/logout');
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie'][0]).toMatch(/token=;/);
  });
});
