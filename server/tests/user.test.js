const request = require('supertest');

describe('User API', () => {
  test('should register a new user', async () => {
    const res = await request(__TEST__.app)
      .post('/api/users/register')
      .send({ username: 'newtestuser', password: 'newtestuser' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
  });

  test('should not register with missing fields', async () => {
    const res = await request(__TEST__.app)
      .post('/api/users/register')
      .send({ username: '' });
    expect(res.statusCode).toBe(400);
  });

  test('should login with correct credentials', async () => {
    const res = await request(__TEST__.app)
      .post('/api/users/login')
      .send({ username: 'newtestuser', password: 'newtestuser' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
  });

  test('should not login with incorrect credentials', async () => {
    const res = await request(__TEST__.app)
      .post('/api/users/login')
      .send({ username: 'newtestuser', password: 'wrong password' });
    expect(res.statusCode).toBe(409);
  });

  test('should get user by username', async () => {
    const res = await request(__TEST__.app)
      .get(`/api/users/${__TEST__.user.username}`)
      .set('Authorization', `Bearer ${__TEST__.user.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
  });
});