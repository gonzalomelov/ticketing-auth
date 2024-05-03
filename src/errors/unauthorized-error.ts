import { CustomError } from '../errors/custom-error';

export class UnauthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Invalid email or password');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}