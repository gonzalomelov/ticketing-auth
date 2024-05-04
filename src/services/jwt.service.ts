import jwt from 'jsonwebtoken';

export const generateJwt = (user: { id: string; email: string }) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_KEY!
  );
};