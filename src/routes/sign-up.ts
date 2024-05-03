import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user'

const router = express.Router();

const validateRequest = [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
  
    next();
  }
]

const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('Email in use');
  }

  const user = await User.build({ email, password });
  await user.save();

  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_KEY!
  )

  req.session = {
    ...req.session,
    jwt: userJwt,
  };
  
  res.status(201).send(user);
}

router.post('/api/users/signup', validateRequest, signUp);

export { router as signUpRouter };
