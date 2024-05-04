import express, { Request, Response } from 'express';

const router = express.Router();

const signoutHandler = (req: Request, res: Response) => {
  req.session = null;
  res.send({});
};

router.post('/api/users/signout', signoutHandler);

export { router as signoutRouter };