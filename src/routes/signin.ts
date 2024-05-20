import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { BadRequestError, validateRequest } from '@gmvticketing/common';

import { User } from '../models/user';
import { Password } from '../services/password.service';
import { generateJwt } from '../services/jwt.service';
import { setJwtSession } from '../services/session.service';

const router = express.Router();

const signinValidations = [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
];

const signinHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError('Invalid email or password');
  }

  const passwordsMatch = await Password.compare(existingUser.password, password);
  if (!passwordsMatch) {
    throw new BadRequestError('Invalid email or password');
  }

  const userJwt = generateJwt({
    id: existingUser.id,
    email: existingUser.email
  });

  setJwtSession(req, userJwt);

  res.send(existingUser);
};

router.post('/api/users/signin', validateRequest(signinValidations), signinHandler);

export { router as signinRouter };