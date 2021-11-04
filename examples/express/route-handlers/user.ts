import { Request, Response } from 'express'
import { menu } from './menu'

export const user = (req: Request, res: Response) => {
  res.send(`
    <h1>User Dashboard</h1>
    ${menu()}
    Session: ${req.sessionID}<br/>
    External: ${req.session.external}
    <p>User's Details from the DB.</p>
  `)
}
