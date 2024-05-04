import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';

import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user'
import { validateRequest } from '../middlewares/validate-request.factory';
import { generateJwt } from '../services/jwt.service';
import { setJwtSession } from '../services/session.service';

const router = express.Router();

const signupValidations = [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
];

const signupHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('Email in use');
  }

  const user = await User.build({ email, password });
  await user.save();

  const userJwt = generateJwt({
    id: user.id,
    email: user.email,
  });

  setJwtSession(req, userJwt);;
  
  res.status(201).send(user);
}

router.post('/api/users/signup', validateRequest(signupValidations), signupHandler);

export { router as signupRouter };
