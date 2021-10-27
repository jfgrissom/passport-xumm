import { Request, Response } from 'express'
import { menu } from './menu'
import { COOKIE_NAME } from '../constants'

export const logout = (req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: '/' })
  req.session.destroy(() => {})
  res.send(`
    <h1>You're Logged Out!</h1>
    ${menu()}
    <p>Check your cookies you're logged out!</p>
  `)
}
