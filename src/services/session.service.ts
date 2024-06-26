import { Request } from "express"

export const setJwtSession = (req: Request, jwt: string) => {
  req.session = { jwt }
}