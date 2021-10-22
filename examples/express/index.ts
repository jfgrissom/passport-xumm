import express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()

import { qr } from './route-handlers/qr'
import { xumm } from './route-handlers/xumm'

const port = 3000

const api = express()
api.use(express.json())

api.get('/qr', qr)
api.post('/xumm', xumm)


api.listen(port, () => {
  console.log(`Example express app listening at http://localhost:${port}`)
})