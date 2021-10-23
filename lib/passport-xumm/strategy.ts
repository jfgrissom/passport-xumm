import { Strategy as PassportStrategy } from 'passport-strategy'
import axios, { AxiosRequestConfig } from 'axios'

//TODO: These env vars need to be passed to the strategy when it's initialized.
import { XummSdk, XummTypes } from 'xumm-sdk'

export interface iXummStrategyProps {
  pubKey: string
  pvtKey: string
  timeout?: number
}

export interface XummResponse {
  data: XummTypes.XummGetPayloadResponse
}

export interface iFetchQRCodeProps {
  web?: string
  app?: string
  identifier: string
}

export interface iAuthenticateProps {
  identifier: string
  pvtKey: string
  pubKey: string
}

const BAD_REQUEST = 400

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

  authenticate = async (req: any, options: iAuthenticateProps) => {
    const { identifier, pubKey, pvtKey } = options
    const url = `https://xumm.app/api/v1/platform/payload/ci/${identifier}`
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        'X-API-Key': pubKey,
        'X-API-Secret': pvtKey
      }
    }

    const response: XummResponse = await axios.get(url, axiosConfig)
    if (
      response.data.meta.exists === true &&
      response.data.meta.resolved === true
    ) {
      // At this point there is a token.
      this.pass()
    } else {
      this.fail(
        {
          message:
            'Payload received could not be verified with Xumm web service.'
        },
        BAD_REQUEST
      )
    }
  }

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
