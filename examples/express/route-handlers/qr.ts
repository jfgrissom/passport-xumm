import { XummStrategy } from '../../../dist/lib/passport-xumm'
import { v4 as uuidV4 } from 'uuid'
import { Request, Response } from 'express'

export const qr = async (req: Request, res: Response) => {
  const pubKey = process.env.XUMM_PUB_KEY
  const pvtKey = process.env.XUMM_PVT_KEY

  const xummStrategyProps = {
    pubKey,
    pvtKey
  }

  // At this point you'll want to persist this user ID
  // or pull it from your database.
  const userId = uuidV4()

  const fetchQRCodeProps = {
    web: 'http://localhost:3000',
    identifier: userId
  }

  const strategy = new XummStrategy(xummStrategyProps)
  const qrCodeData = await strategy.fetchQrCode(fetchQRCodeProps)

  res.send(qrCodeData)
}