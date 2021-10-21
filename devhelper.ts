import { XummStrategy } from './lib/passport-xumm'
import * as dotenv from 'dotenv'
import { v4 as uuidV4 } from 'uuid'

dotenv.config()

const main = async () => {
  const pubKey = process.env.XUMM_PUB_KEY
  const pvtKey = process.env.XUMM_PVT_KEY

  const xummStrategyProps = {
    pubKey,
    pvtKey
  }

  const userId = uuidV4()
  const fetchQRCodeProps = {
    web: 'http://localhost:3000',
    identifier: userId
  }

  const strategy = new XummStrategy(xummStrategyProps)

  const qrCodeData = await strategy.fetchQrCode(fetchQRCodeProps)

  console.log(qrCodeData)
}

main()
