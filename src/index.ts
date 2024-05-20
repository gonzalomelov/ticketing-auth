import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
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