import express from 'express'
import { ConnectionOptions, createConnection } from 'typeorm'
import 'reflect-metadata'
import * as dotenv from 'dotenv'
dotenv.config()

import { qr } from './route-handlers/qr'
import { xumm } from './route-handlers/xumm'
import { User } from './entity/user'
import { Token } from './entity/token'
import { Session } from './entity/session'

// Configure the service.
const port = 3000
const api = express()

const options: ConnectionOptions = {
  type: 'sqlite',
  database: `./data/db.sqlite`,
  entities: [User, Token, Session],
  logging: true,
  synchronize: true
}

const main = async () => {
  const connection = await createConnection(options)

  // Apply middleware to the service.
  api.use(express.json())

  // Local routes here.
  api.get('/qr', qr)
  api.post('/xumm', xumm)

  // Start the API as a web service.
  api.listen(port, () => {
    console.log(`Example express app listening at http://localhost:${port}`)
  })
}

main()
