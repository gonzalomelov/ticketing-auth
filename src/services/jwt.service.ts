import jwt from 'jsonwebtoken';

import { UserPayload } from '../middlewares/current-user';

export const generateJwt = (user: UserPayload) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_KEY!
  );
};