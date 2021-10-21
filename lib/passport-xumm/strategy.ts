import { Strategy as PassportStrategy } from 'passport-strategy'

//TODO: These env vars need to be passed to the strategy when it's initialized.
import { XummSdk, XummTypes } from 'xumm-sdk'

export interface iXummStrategyProps {
  pubKey: string
  pvtKey: string
  timeout?: number
}

export interface iFetchQRCodeProps {
  web?: string
  app?: string
  identifier: string
}

export class XummStrategy extends PassportStrategy {
  constructor(props: iXummStrategyProps) {
    super()
    const { pubKey, pvtKey, timeout } = props

    this.timeout = timeout || 240
    this.pubKey = pubKey
    this.name = 'Xumm Strategy For PassportJS'
    this.sdk = new XummSdk(pubKey, pvtKey)

    if (!pubKey) throw Error('Xumm public API key is required.')
    if (!pvtKey) throw Error('Xumm private API secret is required.')
    if (!this.sdk) throw Error('There was a problem initializing Xumm.')
  }

  public timeout: number
  public pubKey: string
  public name: string
  private sdk: XummSdk

  authenticate = (req: {}, options: {}) => {}

  createPayload = async (request: XummTypes.XummPostPayloadBodyJson) => {
    return await this.sdk.payload.create(request)
  }

  fetchQrCode = async (props: iFetchQRCodeProps) => {
    const { web, app, identifier } = props
    const request: XummTypes.XummPostPayloadBodyJson = {
      options: {
        submit: false,
        expire: 240,
        return_url: {
          web,
          app
        }
      },
      txjson: {
        TransactionType: 'SignIn'
      },
      custom_meta: {
        identifier
      }
    }

    const response = await this.createPayload(request)
    return response
  }
}
