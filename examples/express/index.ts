import express, { Request, Response, NextFunction } from 'express'
import expressContext from 'express-request-context'
import { ConnectionOptions, createConnection } from 'typeorm'
import 'reflect-metadata'
import * as dotenv from 'dotenv'
dotenv.config()

// Functions that handle the routes.
import { qr } from './route-handlers/qr'
import { xumm } from './route-handlers/xumm'

// Why the ORM? These entities are used by passport via express-session.
import { User } from './entity/user'
import { Token } from './entity/token'
import { Session } from './entity/session'

// Configure the service.
const port = 3000
const api = express()
api.use(expressContext())
api.use(express.json())

const options: ConnectionOptions = {
  type: 'sqlite',
  database: `./data/db.sqlite`,
  entities: [User, Token, Session],
  logging: true,
  synchronize: true
}

const main = async () => {
  const connection = await createConnection(options)

  // Middleware that sets up our database.
  const injectDatabase = (req: Request, res: Response, next: NextFunction) => {
    req.context.db = connection
    next()
  }

  // Add the database to our request context.
  api.use(injectDatabase)

  // Local API endpoints.
  api.get('/qr', qr)
  api.post('/xumm', xumm)

  // Local VIEW endpoints.

  // Start the API as a web service.
  api.listen(port, () => {
    console.log(`Example express app listening at http://localhost:${port}`)
  })
}

main()
