import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { UnauthorizedError } from '../errors/unauthorized-error';
import { User } from '../models/user';
import { Password } from '../services/password.service';
import { generateJwt } from '../services/jwt.service';
import { validateRequest } from '../middlewares/validate-request.factory';
import { setJwtSession } from '../services/session.service';

const router = express.Router();

const signInValidations = [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
];

const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new UnauthorizedError();
  }

  const passwordsMatch = await Password.compare(existingUser.password, password);
  if (!passwordsMatch) {
    throw new UnauthorizedError();
  }

  const userJwt = generateJwt({
    id: existingUser.id,
    email: existingUser.email
  });

  setJwtSession(req, userJwt);

  res.send(existingUser);
};

router.post('/api/users/signin', validateRequest(signInValidations), signIn);

export { router as signInRouter };