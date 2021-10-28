import { Request, Response } from 'express'

import { XummStrategy } from '../../../dist/lib/passport-xumm'
import { User } from '../entities/user'

export const qr = async (req: Request, res: Response) => {
  const pubKey = process.env.XUMM_PUB_KEY
  const pvtKey = process.env.XUMM_PVT_KEY
  const userRepository = await req.context.db.getRepository(User)

  // Setup a user
  // Add this anonymous user to the "database".
  const user = new User()
  user.name = 'Anonymous'
  const savedUser = await userRepository.save(user)
  console.log(`Created User: ${user.name} ${savedUser.id}`)

  const xummStrategyProps = {
    pubKey,
    pvtKey
  }

  const fetchQRCodeProps = {
    web: 'http://localhost:3000/',
    identifier: `${savedUser.id}`
  }

  const strategy = new XummStrategy(xummStrategyProps)
  const qrCodeData = await strategy.fetchQrCode(fetchQRCodeProps)

  // Exposing the userID to make it easier to mock payloads returned
  // from Xumm. No need to do this in your app.
  const responseData = {
    user_id: savedUser.id,
    payload: qrCodeData
  }

  res.send(responseData)
}
