import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode = 400;
  
  constructor(public message: string = 'Bad request') {
    super(message);

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}