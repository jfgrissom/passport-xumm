import { Request, Response } from 'express'
import { menu } from './menu'

export const home = async (req: Request, res: Response) => {
  res.send(`
    <h1>Home Page</h1>
    ${menu()}
    <p>Home page content.</p>
  `)
}
