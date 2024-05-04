import express, { Request, Response } from 'express';

const router = express.Router();

const currentUserHandler = (req: Request, res: Response) => {
  return res.send({ currentUser: req.currentUser });
};

router.get('/api/users/current-user', currentUserHandler);

export { router as currentUserRouter };