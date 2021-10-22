import express from 'express'
import expressContext from 'express-request-context'
import * as dotenv from 'dotenv'
dotenv.config()

import { qr } from './route-handlers/qr'
import { xumm } from './route-handlers/xumm'

// Configure the service.
const port = 3000
const api = express()

// Apply middlware to the service.
api.use(express.json())
api.use(expressContext())

// Local routes here.
api.get('/qr', qr)
api.post('/xumm', xumm)

// Start the API as a web service.
api.listen(port, () => {
  console.log(`Example express app listening at http://localhost:${port}`)
})
