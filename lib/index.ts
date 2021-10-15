import { XummSdk, XummTypes } from 'xumm-sdk'
import * as dotenv from 'dotenv'

dotenv.config()

const pubKey = process.env.XUMM_PUB_KEY
const pvtKey = process.env.XUMM_PUB_KEY
const sdk = new XummSdk(pubKey, pvtKey)

if (!pubKey) throw Error("Your public Xumm key can't be found in .env XUMM_PUB_KEY")
if (!pvtKey) throw Error("Your private Xumm key can't be found in .env XUMM_PVT_KEY")
if (!sdk) throw Error("There was a problem initializing Xumm.")

const main = async () => {
  const appInfo = await sdk.ping()
  console.log(appInfo.application.name)

  /*const request: XummTypes.XummPostPayloadBodyJson = {
    txjson: {
      TransactionType: "Payment",
      Destination: "rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ",
      Amount: "10000",
      Memos: [
        {
          Memo: {
            MemoData: "F09F988E20596F7520726F636B21"
          }
        }
      ]
    }
  }

  const payload = await sdk.payload.create(request, true)
  console.log(payload)
  */
}

main()