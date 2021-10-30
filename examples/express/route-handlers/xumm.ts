import { Request, Response } from 'express'
import axios from 'axios'
import { XummTypes } from 'xumm-sdk'

import { User } from '../entities/user'
import { Token } from '../entities/token'

// Once a request comes in check with Xumm to be sure the payload is real.
export const xumm = async (req: Request, res: Response) => {
  console.log(`Request From Xumm: ${JSON.stringify(req.body)}`)

  const userRepository = await req.context.db.getRepository(User)
  const tokenRepository = await req.context.db.getRepository(Token)

  // This userID should be something your application passed
  // to Xumm when you requested the QR code.
  const userId = req.body.custom_meta.identifier

  // If there is no user ID ignore it and respond with a 200.
  // This is the verify step.
  if (userId) {
    const url = `https://xumm.app/api/v1/platform/payload/ci/${userId}`
    const options = {
      headers: {
        'X-API-Key': process.env.XUMM_PUB_KEY,
        'X-API-Secret': process.env.XUMM_PVT_KEY
      }
    }

    interface XummResponse {
      data: XummTypes.XummGetPayloadResponse
    }

    const response: XummResponse = await axios.get(url, options)
    if (
      response.data.meta.exists === true &&
      response.data.meta.resolved === true
    ) {
      console.log('Payload received is authentic: ')
      console.log('Creating new session and attaching public wallet data.')

      // Add the updated user to the "database".
      const user = await userRepository.findOne({ id: userId })

      // Create a token.
      const token = new Token()
      token.hashedToken = req.body.userToken.user_token
      token.createdAt = req.body.userToken.token_issued
      token.expiresAt = req.body.userToken.token_expiration
      token.user = user
      const savedToken = await tokenRepository.save(token)

      console.log(`Token Saved: ${JSON.stringify(savedToken)}`)
    }
  }

  // This is what gets returned to the caller (Xumm Service)
  // because we received their payload.
  res.sendStatus(200)
}
