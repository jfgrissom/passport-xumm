import { v4 as uuidV4 } from 'uuid'
import { Request, Response } from 'express'

import { XummStrategy } from '../../../dist/lib/passport-xumm'
import { User } from '../models/User'

// Creates a simple database for use in development.
const addUsersToContext = (req: Request) => {
  interface FakerBase {
    users: User[]
  }
  const fakerBase: FakerBase = {
    users: []
  }

  req.context.users = fakerBase
}

export const qr = async (req: Request, res: Response) => {
  const pubKey = process.env.XUMM_PUB_KEY
  const pvtKey = process.env.XUMM_PVT_KEY

  // Pull in the "database".
  addUsersToContext(req)

  // Setup a user and session
  const userId: string = uuidV4()
  const sessionId: string = uuidV4()
  const anonymousUser: User = {
    name: 'Anonymous User',
    id: userId,
    session: { id: sessionId }
  }

  // Add this anonymous user to the "database".
  req.context.users.push(anonymousUser)
  console.log(`Current DB State: ${JSON.stringify(req.context.users)}`)

  const xummStrategyProps = {
    pubKey,
    pvtKey
  }

  const fetchQRCodeProps = {
    web: 'http://localhost:3000',
    identifier: userId
  }

  const strategy = new XummStrategy(xummStrategyProps)
  const qrCodeData = await strategy.fetchQrCode(fetchQRCodeProps)

  // Exposing the userID to make it easier to mock payloads returned
  // from Xumm. No need to do this in your app.
  const responseData = {
    user_id: userId,
    payload: qrCodeData
  }

  res.send(responseData)
}
