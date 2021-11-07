import { Request, Response } from 'express'
import { menu } from './menu'

export const success = async (req: Request, res: Response) => {
  req.session.external = req.query.external_id as string

  res.send(`
    <h1>You're Signed In!</h1>
    ${menu()}
    Session: ${req.sessionID}<br/>
    External: ${req.session.external}<br/>
    External Param: ${req.query.external_id}
    <p>This page handles binding all the components together that make up an authenticated user.</p>
  `)
}
