import { NextFunction, Request, Response } from 'express';
import { SerializedError, CustomError } from '../errors/custom-error';
import mongoose from 'mongoose';

const { ValidationError: MongooseValidationError } = mongoose.Error;

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  if (err instanceof MongooseValidationError) {
    const errors = Object.values(err.errors).map((error: any) => ({ message: error.message, field: error.path } as SerializedError));
    return res.status(400).send({ errors });
  }
  
  res.status(400).send({ errors: [{ message: 'Something went wrong' }] });
}