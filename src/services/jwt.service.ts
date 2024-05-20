import jwt from 'jsonwebtoken';

import { UserPayload } from '@gmvticketing/common';

export const generateJwt = (user: UserPayload) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_KEY!,
    {
      expiresIn: '1m'
    }
  );
};