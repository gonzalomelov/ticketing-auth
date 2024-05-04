import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import 'express-async-errors';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true); 
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
    httpOnly: true
  })
)

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', () => {
  throw new NotFoundError();
})

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MongoDb');
  } catch (err) {
    console.log(err);
  }

  const server = app.listen(3000, () => {
    console.log('Listening on 3000');
  });

  process.on('SIGINT', () => {
    console.log('Express server has stopped listening on port 3000');
    server.close();
  });
  
  process.on('SIGTERM', () => {
    console.log('Express server has stopped listening on port 3000');
    server.close();
  });
}

start();