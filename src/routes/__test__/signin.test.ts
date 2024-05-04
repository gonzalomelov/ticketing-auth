import request from 'supertest';

import { app } from '../../app';

it('returns 200 on successful signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200);
})

it('returns 400 with an invalid email', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'invalidemail',
      password: 'password'
    })
    .expect(400);
});

it('returns 400 with an incorrect password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'wrongpassword'
    })
    .expect(400);
});

it('returns 400 with missing email', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      password: 'password'
    })
    .expect(400);
});

it('returns 400 with missing password', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com'
    })
    .expect(400);
});

it('returns 400 if email does not exist', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'notexist@test.com',
      password: 'password'
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200);

  expect(response.headers['set-cookie']).toBeDefined();
});