import express, { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: string | JwtPayload | null;
    }
  }
}

const router = express.Router();

const tryAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    req.user = payload;
  } catch (err) {
    req.user = null;
  }

  next();
}

const currentUser = (req: Request, res: Response) => {
  return res.send({ currentUser: req.user });
};

router.get('/api/users/currentuser', tryAuthenticate, currentUser);

export { router as currentUserRouter };