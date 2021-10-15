import { Strategy as PassportStrategy } from 'passport-strategy'
import util from 'util'

/* 
TODO: These env vars need to be passed to the strategy when it's initialized.
import { XummSdk, XummTypes } from 'xumm-sdk'
import * as dotenv from 'dotenv'

dotenv.config()

const pubKey = process.env.XUMM_PUB_KEY
const pvtKey = process.env.XUMM_PVT_KEY
const sdk = new XummSdk(pubKey, pvtKey)

if (!pubKey) throw Error("Your public Xumm key can't be found in .env XUMM_PUB_KEY")
if (!pvtKey) throw Error("Your private Xumm key can't be found in .env XUMM_PVT_KEY")
if (!sdk) throw Error("There was a problem initializing Xumm.")

const main = async () => {
  const request: XummTypes.XummPostPayloadBodyJson = {
    options: {
      submit: false,
      expire: 240
    },
    txjson: {
      TransactionType: "SignIn"
    }
  }

  const response = await sdk.payload.create(request)
  console.log(response)
}
*/

interface iXummStrategyProps {
  pubKey: string
  pvtKey: string
}

export class XummStrategy extends PassportStrategy {
  constructor(props: iXummStrategyProps) {
    super()
    const { pubKey, pvtKey } = props

    this.pubKey = pubKey
    this.pvtKey = pvtKey
    this.name = 'xumm'

  }

  public pubKey: string
  private pvtKey: string
  public name: string

  // 1. Get a QR code for the view.
  // 2. 

  // Implement a superclass method override.
  authenticate(req: {}, options: {}) { }

}
