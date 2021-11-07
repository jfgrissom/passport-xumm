import { Strategy as PassportStrategy } from 'passport-strategy'
import axios, { AxiosRequestConfig } from 'axios'
import { XummSdk, XummTypes } from 'xumm-sdk'

export interface iXummStrategyProps {
  pubKey: string
  pvtKey: string
  timeout?: number
  verify: Function
}

export interface iXummResponse {
  data: XummTypes.XummGetPayloadResponse
}

export interface iFetchQRCodeProps {
  web?: string
  app?: string
  identifier: string
}

export interface iValidated {
  userToken: string
  externalId: string
}

const BAD_REQUEST = 400
const NOT_AUTHENTICATED = 401

export class XummStrategy extends PassportStrategy {
  constructor(props: iXummStrategyProps) {
    super()
    const { pubKey, pvtKey, timeout, verify } = props

    this.timeout = timeout || 240
    this.pubKey = pubKey
    this.pvtKey = pvtKey // To secure this value it has been made private to this class.
    this.name = 'xumm'
    this.sdk = new XummSdk(pubKey, pvtKey)
    this.authUrl = 'https://xumm.app/api/v1/platform/payload/ci'

    if (!pubKey) throw Error('Xumm public API key is required.')
    if (!pvtKey) throw Error('Xumm private API secret is required.')
    if (!this.sdk) throw Error('There was a problem initializing Xumm.')
    if (!verify) throw Error('XummStrategy needs a verify function.')
  }

  public timeout: number
  public pubKey: string
  private pvtKey: string // Restricting this value to this class only.
  public name: string
  private sdk: XummSdk
  private authUrl: string

  /*
    A person who has signed the "SignIn" transaction has been authenticated.
    This activity proves they've signed the transaction using the 
    Xumm service as the authoritative source.
  */
  authenticate = async (req: any) => {
    // Handle existing sessions first.
    // This section is here to ensure this doesn't call the Xumm api
    // more than is absolutely required.

    // If the existing token is expired then the user is not authed.
    // Date.now()/1000 === 1636318227
    // tokenExpiration === 1635955181
    const currentTime = Date.now() / 1000
    if (req.session.tokenExpiration < currentTime) {
      this.fail(
        {
          message: 'Your session is expired. Please sign in again.'
        },
        NOT_AUTHENTICATED
      )
    }

    // If the session already has a token and a valid
    // tokenExpiration then the user is still authed.
    if (req.session.userToken && req.session.tokenExpiration) {
      const user = { id: req.session.userToken }
      // Account number and provider should already exist if
      // this is the case so no need to set them as info here.
      this.success(user)
    }

    // If those conditions are not met then the user is not authed
    // so test for it using an externalId.

    // Retrieve the identifier from request.
    // Query has priority over session to handle redirects from Xumm Service.
    const identifier: string = req.query.externalId || req.session.externalId
    const url = `${this.authUrl}/${identifier}`
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        'X-API-Key': this.pubKey,
        'X-API-Secret': this.pvtKey
      }
    }

    // This is the response from axios not the res within the service context.
    const response: iXummResponse = await axios.get(url, axiosConfig)
    if (
      response.data.meta.exists === true &&
      response.data.meta.resolved === true &&
      response.data.response.account &&
      response.data.application.issued_user_token
    ) {
      // At this point we have confirmed there is a user token.
      // TODO: The verify function needs to be called passing in the user data.
      const userId: string = response.data.application.issued_user_token
      const user = { id: userId }
      const account: string = response.data.response.account
      const info = { account: account, provider: 'xumm' }
      this.success(user, info)
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

  // Returns a payload that contains the data associated with a QR code.
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

    return await this.createPayload(request)
  }
}
