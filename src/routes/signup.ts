import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';

import { BadRequestError, validateRequest, generateJwt } from '@gmvticketing/common';

import { User } from '../models/user'
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
