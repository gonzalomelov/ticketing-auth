import express, { Request, Response } from 'express';

const router = express.Router();

const signout = (req: Request, res: Response) => {
  req.session = null;
  res.send({});
};

router.post('/api/users/signout', signout);

export { router as signoutRouter };