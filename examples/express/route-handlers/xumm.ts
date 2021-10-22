import { Request, Response } from 'express'
import axios from 'axios'
import { XummTypes } from 'xumm-sdk'

// Once a request comes in check with Xumm to be sure the payload is real.
export const xumm = async (req: Request, res: Response) => {
  console.log(req.body)

  // This UserID should be something your application passed to Xumm when 
  // you requested the QR code.
  const userId = req.body.custom_meta.identifier

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
      console.log('Validate your session model.')
      console.log(response.data)
    }
  }

  res.sendStatus(200)
}