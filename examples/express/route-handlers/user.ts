import { Request, Response } from 'express'
import { menu } from './menu'

export const user = (req: Request, res: Response) => {
  res.send(`
    <h1>User Dashboard</h1>
    ${menu()}
    <p>User's Details from the DB.</p>
  `)
}
