import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after being signed out', async () => {
  const signupResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
  
  expect(signupResponse.headers['set-cookie']).toBeDefined();

  const signoutResponse = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);
  
  expect(signoutResponse.headers['set-cookie'][0]).toContain('expires=Thu, 01 Jan 1970 00:00:00 GMT');
})

it('responds with 200 when signed out without being signed in', async () => {
  await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);
});

it('returns a successful message on signout', async () => {
  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(response.body).toEqual({});
});

it('handles multiple signouts gracefully', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);
});
