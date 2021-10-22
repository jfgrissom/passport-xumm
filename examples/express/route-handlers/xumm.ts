import { Request, Response } from 'express'
import axios from 'axios'
import { XummTypes } from 'xumm-sdk'
import { v4 as uuidV4 } from 'uuid'

import { User } from '../models/User'

// Once a request comes in check with Xumm to be sure the payload is real.
export const xumm = async (req: Request, res: Response) => {
  console.log(`Request From Xumm: ${req.body}`)

  // This userID should be something your application passed
  // to Xumm when you requested the QR code.
  const userId = req.body.custom_meta.identifier
  const user: User = req.context.users.find((user: User) => {
    if ((user.id = userId)) return user
  })
  const userIndex = req.context.users.findIndex((user: User) => {
    if ((user.id = userId)) return user
  })

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
      const sessionId = uuidV4()
      let updatedUser: User = {
        ...user,
        session: {
          id: sessionId
        },
        wallets: [
          { provider: 'xumm', address: `${response.data.response.account}` }
        ]
      }

      // Add the updated user to the "database".
      req.context.users[userIndex] = updatedUser
      console.log(`Current DB State: ${JSON.stringify(req.context.users)}`)
    }
  }

  // This is what gets returned to the caller (Xumm Service)
  // because we received their payload.
  res.sendStatus(200)
}
