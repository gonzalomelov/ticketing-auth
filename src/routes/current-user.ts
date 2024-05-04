import express, { Request, Response } from 'express';

const router = express.Router();

const currentUser = (req: Request, res: Response) => {
  return res.send({ currentUser: req.currentUser });
};

router.get('/api/users/current-user', currentUser);

export { router as currentUserRouter };