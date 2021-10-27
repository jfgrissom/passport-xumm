import express, { Request, Response, NextFunction } from 'express'
import expressContext from 'express-request-context'
import { ConnectionOptions, createConnection } from 'typeorm'
import 'reflect-metadata'
import session, { SessionOptions } from 'express-session'
import * as dotenv from 'dotenv'

// Pull in the environment variables and account for them before continuing.
dotenv.config()
if (!process.env.SESSION_SECRET) throw Error('Is your session secret in .env?')
const sessionSecret = process.env.SESSION_SECRET

// Functions that handle the routes.
import { qr, xumm, login, home, logout, user } from './route-handlers/'

// Why the ORM? These entities are used by passport via express-session.
import { User } from './entity/user'
import { Token } from './entity/token'
import { Session } from './entity/session'
import { COOKIE_NAME } from './constants'

// Configure the service.
const port = 3000
const service = express()
service.use(expressContext())
service.use(express.json())

// Setup Session support for Passport to leverage.
const sessionConfig: SessionOptions = {
  secret: sessionSecret,
  name: COOKIE_NAME,
  cookie: {
    httpOnly: true // Only let the browser modify this, not JS.
    // These options you'll likely want in production but they aren't available from express-session.
    // secure: true // Only set cookies if the TLS is enabled on the connection.
    // ephemeral: true, // Nukes the cookie when the browser closes.
    // duration: 30 * 60 * 1000,
    // activeDuration: 5 * 60 * 1000,
  }
}

service.use(session(sessionConfig))

const options: ConnectionOptions = {
  type: 'sqlite',
  database: `./data/db.sqlite`,
  entities: [User, Token, Session],
  logging: true,
  synchronize: true
}

const createDatabase = async () => {
  const connection = await createConnection(options)

  // Middleware that sets up our database.
  return (req: Request, res: Response, next: NextFunction) => {
    req.context.db = connection
    next()
  }
}

const main = async () => {
  const database = await createDatabase()
  if (!database) throw Error('Could not connect to the DB.')

  // Add the database to our request context.
  service.use(database)

  // Local API endpoints.
  service.get('/api/qr', qr)
  service.post('/api/xumm', xumm)

  // Local Web endpoints.
  service.get('/', home)
  service.get('/login', login)
  service.get('/logout', logout)
  service.get('/user', user)

  // Local VIEW endpoints.

  // Start the API as a web service.
  service.listen(port, () => {
    console.log(`Example express app listening at http://localhost:${port}`)
  })
}

main()
