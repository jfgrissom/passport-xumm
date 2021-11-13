import express from 'express'
import expressContext from 'express-request-context'
import { createConnection } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'
import 'reflect-metadata'
import session, { SessionOptions } from 'express-session'
import { TypeormStore } from 'typeorm-store'
import * as dotenv from 'dotenv'
import { typeOrm } from './middleware/orm'
import { verify } from './shared/verify'
import passport from 'passport'
import { XummStrategy, iXummStrategyProps } from '../../dist/lib/passport-xumm'

// Pull in the environment variables and account for them before continuing.
dotenv.config()
if (!process.env.SESSION_SECRET) throw Error('Is your session secret in .env?')
const sessionSecret = process.env.SESSION_SECRET
// Add additional keys to our session.
declare module 'express-session' {
  interface SessionData {
    externalId?: string
    userToken?: string
    tokenExpiration?: number
  }
}

// Pull in functions to handle the routes.
import { qr, xumm, login, home, logout, user, success } from './route-handlers/'

// Why the session from the ORM? This entity is used by passport via express-session.
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

  // Initialize Session middleware before handing it to the service.
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

  // Create passport for authenticating XummStrategy.
  const pubKey = process.env.XUMM_PUB_KEY
  const pvtKey = process.env.XUMM_PVT_KEY

  // This function is required by passport. It verifies that authentication
  // data coming in through any http request matches up with data you have in your database.
  const strategyProps: iXummStrategyProps = { pubKey, pvtKey, verify }
  passport.use('xumm', new XummStrategy(strategyProps))

  // Initialize passport
  service.use(passport.initialize())

  // Extend express sessions with passport session.
  service.use(passport.session())

  // Local API endpoints
  // Also these don't require auth.
  service.get('/api/qr', qr)
  service.post('/api/xumm', xumm)

  // Public Web endpoints.
  service.get('/', home)
  service.get(
    '/login',
    passport.authenticate('xumm', {
      successRedirect: '/user',
      failureRedirect: '/login'
    }),
    login
  ) // Prompts the user to login with Xumm.
  service.get(
    '/login-success',
    passport.authenticate('xumm', {
      successRedirect: '/user',
      failureRedirect: '/login'
    }),
    success
  ) // User is redirected here from Xumm Service (or after a frontend websocket receives a completed message from Xumm Service).
  service.get(
    '/logout',
    passport.authenticate('xumm', {
      successRedirect: '/user',
      failureRedirect: '/login'
    }),
    logout
  ) // Kills the session at the server and removes session data from browser cookies.

  // service.post('login', login) // passport.authenticate middleware normally goes here.

  service.get(
    '/user',
    passport.authenticate('xumm', {
      successRedirect: '/user',
      failureRedirect: '/login'
    }),
    user
  )

  // Start the API as a web service.
  service.listen(port, () => {
    console.log(`Example express app listening at http://localhost:${port}`)
  })
}

main()
