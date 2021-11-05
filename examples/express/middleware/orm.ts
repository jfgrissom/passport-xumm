import { Request, Response, NextFunction } from 'express'
import { Connection } from 'typeorm'

export interface iOrmProps {
  database: Connection
}

export const typeOrm = (props: iOrmProps) => {
  const { database } = props

  // Middleware that injects our database ORM into the request context.
  return (req: Request, res: Response, next: NextFunction) => {
    req.context.db = database
    next()
  }
}
