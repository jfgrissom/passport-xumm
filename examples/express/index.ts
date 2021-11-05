import express from 'express'
import expressContext from 'express-request-context'
import { createConnection } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'
import 'reflect-metadata'
import session, { SessionOptions } from 'express-session'
import { TypeormStore } from 'typeorm-store'
import * as dotenv from 'dotenv'
import { typeOrm } from './middleware/orm'

// Pull in the environment variables and account for them before continuing.
dotenv.config()
if (!process.env.SESSION_SECRET) throw Error('Is your session secret in .env?')
const sessionSecret = process.env.SESSION_SECRET
// Add additional keys to our session.
declare module 'express-session' {
  interface SessionData {
    external?: string
  }
}

// Functions that handle the routes.
import { qr, xumm, login, home, logout, user, success } from './route-handlers/'

// Why the ORM? These entities are used by passport via express-session.
import { Session } from './entities/session'
import { COOKIE_NAME } from './constants'

// Configure the service.
const port = 3000
const service = express()

// Add context to the service so we can add a database to the context.
service.use(expressContext())

// Enable the reading of requests as JSON data.
service.use(express.json())

// Bootstrap the service.
const main = async () => {
  // Create a database connection to be used by request Context and request Session.
  const database = await createConnection()
  if (!database) throw Error('Could not connect to the DB.')

  // Initialize ORM middleware.
  const orm = typeOrm({ database })

  // Apply the ORM middleware to the service.
  service.use(orm)

  // Initialize Session middleware before handing it to the servie.
  const sessionRepository = database.getRepository(Session)
  const sessionConfig: SessionOptions = {
    genid: function (req) {
      return uuidV4() // use UUIDs for session IDs
    },
    secret: sessionSecret,
    name: COOKIE_NAME,
    saveUninitialized: true,
    // Add Session persistence. Later passport will leverage this.
    store: new TypeormStore({ repository: sessionRepository }),
    resave: false,
    cookie: {
      httpOnly: true, // Only let the browser modify this, not JS.
      secure: process.env.NODE_ENV === 'production' ? true : false, // In production only set cookies if the TLS is enabled on the connection.
      sameSite: 'strict' // Only send a cookie if the domain matches the browser url.
    }
  }

  // Apply the Session middleware to the service.
  service.use(session(sessionConfig))

  // Local API endpoints.
  service.get('/api/qr', qr)
  service.post('/api/xumm', xumm)

  // Local Web endpoints.
  service.get('/', home)
  service.get('/login', login)
  service.get('/login-success', success)
  service.get('/logout', logout)
  service.get('/user', user)

  // Start the API as a web service.
  service.listen(port, () => {
    console.log(`Example express app listening at http://localhost:${port}`)
  })
}

main()
