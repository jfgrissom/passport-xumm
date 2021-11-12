import { Strategy as PassportStrategy } from 'passport-strategy'
import axios, { AxiosRequestConfig } from 'axios'
import { XummSdk, XummTypes } from 'xumm-sdk'

/*
  This is the main interface to the XummStrategy Class.
  The values for pubKey and pvtKey are credentials.
  Timeout is in seconds and it's used when fetching a QR code.
    Default is 240 (4 minutes). So your user has 4 minutes to sign the transaction.
  The verify prop is your function that verifies key values exist in your system.
    Does the userId exist in your database? Verify function is how you handle this. 
 */
export interface iXummStrategyProps {
  pubKey: string
  pvtKey: string
  timeout?: number
  verify: Function
}

/*
  This wraps a XummGetPayloadResponse in an object's data prop
  to have a useable type that conforms to the data property 
  in an Axios response.
 */
export interface iXummResponse {
  data: XummTypes.XummGetPayloadResponse
}

/* 
  These props are passed to the Xumm Service and they will be used 
  when Xumm returns your user to your site/app context.
  The identifier is something you need to create in order to 
  preserve your user's stateless context between Xumm and your site/app.
*/
export interface iFetchQRCodeProps {
  web?: string
  app?: string
  identifier: string
}

const BAD_REQUEST = 400
/*
  HTTP 401 is UNAUTHORIZED but NOT_AUTHENTICATED is 
  more precise to understand what is happening here.
  There is no HTTP NOT_AUTHENTICATED code UNAUTHORIZED serves both 
  purposes of Authentication and Authorization.
*/
const NOT_AUTHENTICATED = 401

/*
  This class receives props that contain information needed to access Xumm services.
  The credentials (pubKey, pvtKey) are values you get from https://apps.xumm.dev/.
  Please read https://xumm.readme.io/docs/register-your-app for details.
 */
export class XummStrategy extends PassportStrategy {
  constructor(props: iXummStrategyProps) {
    super()
    const { pubKey, pvtKey, timeout, verify } = props

    this.timeout = timeout || 240 // Uses 240 as default which is the same as Xumm lib.
    this.pubKey = pubKey
    this._pvtKey = pvtKey // To secure this value it has been made private to this class.
    this.authUrl = 'https://xumm.app/api/v1/platform/payload/ci'

    this.name = 'xumm'
    this._sdk = new XummSdk(pubKey, pvtKey)
    this.verify = verify

    if (!pubKey) throw Error('Xumm public API key is required.')
    if (!pvtKey) throw Error('Xumm private API secret is required.')
    if (!this._sdk) throw Error('There was a problem initializing Xumm.')
    if (!verify) throw Error('XummStrategy needs a verify function.')
  }

  // Explicitly define public props
  public name: string
  public timeout: number
  public pubKey: string
  public authUrl: string // Expose this so it's easy to change and unit test with.
  public verify: Function

  // Explicitly define private props
  private _pvtKey: string // Restricting this value to this class only.
  private _sdk: XummSdk // Don't expose the SDK to any consumer of this lib.

  /*
    A person who has signed the "SignIn" transaction has been authenticated.
    This activity proves they've signed the transaction using the 
    Xumm service as the authoritative source.
    Handles existing sessions first.
    The first section is here to ensure this doesn't call the Xumm api
    more than is absolutely required.
  */
  authenticate = async (req: any) => {
    // Date.now()/1000 === 1636318227
    // tokenExpiration === 1635955181
    const currentTime = Date.now() / 1000

    // If the session already has a userToken and a tokenExpiration greater than
    // the current time then the user is still authenticated.
    // NOTE: To ensure this isn't something your app allows the
    // client to change make sure httpOnly is set on your cookies.
    if (req.session.userToken && req.session.tokenExpiration > currentTime) {
      const user = { id: req.session.userToken }
      // Account number and provider should already exist if
      // this is the case so no need to set them as info here.
      return this.success(user)
    }

    // If those conditions are not met then the user is not authenticated
    // so test for it using an externalId.

    // Retrieve the identifier from request.
    // Query has priority over session to handle redirects from Xumm Service.
    const identifier: string = req.query.externalId || req.session.externalId
    console.log(`Identifier: ${identifier}`)
    if (!identifier) {
      return this.fail(
        {
          message: 'Missing external identifier.'
        },
        BAD_REQUEST
      )
    }
    const url = `${this.authUrl}/${identifier}`
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        'X-API-Key': this.pubKey,
        'X-API-Secret': this._pvtKey
      }
    }

    // This is the response from axios not the res within the service context.
    const response: iXummResponse = await axios.get(url, axiosConfig)
    if (
      response.data.meta.exists === true && // The external ID received actually exists in Xumm Service.
      response.data.meta.resolved === true && // The transaction was resolved.
      response.data.response.account && // There is an XRPL account associated with the transaction.
      response.data.application.issued_user_token // We have an externally issues userToken from Xumm Service.
    ) {
      // At this point we have confirmed there is a user token.
      // TODO: The verify function needs to be called passing in the user data.
      const userId: string = response.data.application.issued_user_token
      const user = { id: userId }
      const account: string = response.data.response.account
      const info = { account: account, provider: 'xumm' }
      this.success(user, info)
    } else {
      return this.fail(
        {
          message:
            'Payload received could not be verified with Xumm web service.'
        },
        BAD_REQUEST
      )
    }
  }

  createPayload = async (request: XummTypes.XummPostPayloadBodyJson) => {
    return await this._sdk.payload.create(request)
  }

  // Returns a payload that contains the data associated with a QR code.
  fetchQrCode = async (props: iFetchQRCodeProps) => {
    const { web, app, identifier } = props
    const request: XummTypes.XummPostPayloadBodyJson = {
      options: {
        submit: false,
        expire: this.timeout,
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
