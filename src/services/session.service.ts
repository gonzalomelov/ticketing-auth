import { Request } from "express"

export const setJwtSession = (req: Request, userJwt: string) => {
  req.session = {
    ...req.session,
    jwt: userJwt
  }
}