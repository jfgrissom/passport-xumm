import { Request, Response } from 'express'
import { menu } from './menu'

export const success = async (req: Request, res: Response) => {
  res.send(`
    <h1>You're Signed In!</h1>
    ${menu()}
    Session: ${req.sessionID}<br/>
    External: ${req.session.external}<br/>
    External Param: ${req.query.external_id}
    <p>Signed in page content.</p>
  `)
}
