import { Request, Response } from 'express'
import { menu } from './menu'

export const login = (req: Request, res: Response) => {
  res.send(`
    <h1>Login with Xumm!</h1>
    ${menu()}
    <p>Xumm here!</p>
  `)
}
