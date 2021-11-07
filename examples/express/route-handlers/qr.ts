import { Request, Response } from 'express'

import { User } from '../entities/user'
import { generateIdentifier } from '../shared/identifier'
import { fetchQrData, iFetchQrDataProps } from '../shared/qr'

export const qr = async (req: Request, res: Response) => {
  const pubKey = process.env.XUMM_PUB_KEY
  const pvtKey = process.env.XUMM_PVT_KEY
  const userRepository = await req.context.db.getRepository(User)

  // Setup a user
  // Add this anonymous user to the "database".
  const user = new User()
  user.name = 'Anonymous'
  user.id = generateIdentifier()
  const savedUser = await userRepository.save(user)
  console.log(`Created User: ${user.name} ${savedUser.id}`)

  // Add an identifier to the cookie.
  // This will be used when the request is signed and this data is
  // returned to the application.
  const identifier: string = generateIdentifier()
  req.session.external = identifier

  const fetchQrDataProps: iFetchQrDataProps = {
    pubKey,
    pvtKey,
    identifier
  }

  // Get a QR code and share this id with Xumm.
  const qrCodeData = await fetchQrData(fetchQrDataProps)

  // Exposing the userID to make it easier to mock payloads returned
  // from Xumm. No need to do this in your app.
  const responseData = {
    user_id: savedUser.id,
    payload: qrCodeData
  }

  // Send the userID and the QrCode Data.
  res.send(responseData)
}
