import { XummSdk } from 'xumm-sdk'
import * as dotenv from 'dotenv'

dotenv.config()

const pubKey = process.env.XUMM_PUB_KEY
const pvtKey = process.env.XUMM_PUB_KEY

if (!pubKey) throw Error("Your public Xumm key can't be found in .env XUMM_PUB_KEY")
if (!pvtKey) throw Error("Your private Xumm key can't be found in .env XUMM_PVT_KEY")

const sdk = new XummSdk(pubKey, pvtKey)

const main = async () => {
  const appInfo = await sdk.ping()
  console.log(appInfo.application.name)
}

main()