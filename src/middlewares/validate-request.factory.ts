import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

import { RequestValidationError } from '../errors/request-validation-error';

export const validateRequest = (validations: ValidationChain[]) => {
  return [
    ...validations,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
    
      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
      }
    
      next();
    }
  ]
}