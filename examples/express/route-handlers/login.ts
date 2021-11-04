import { Request, Response } from 'express'
import { menu } from './menu'
import { XummStrategy } from '../../../lib/passport-xumm'
import { v4 as uuidv4 } from 'uuid'
import { iXummStrategyProps } from '../../../dist/lib/passport-xumm'

export const login = async (req: Request, res: Response) => {
  // Logged in ? redirect : showQr
  const authenticated = false

  if (!authenticated) {
    // Initialize Xumm.
    const pubKey = process.env.XUMM_PUB_KEY
    const pvtKey = process.env.XUMM_PVT_KEY
    const props: iXummStrategyProps = { pubKey, pvtKey }
    const xumm = new XummStrategy(props)

    // Add an identifier to the cookie.
    // This will be used when the request is signed and this data is
    // returned to the application.
    const identifier: string = uuidv4()
    req.session.external = identifier

    // Get a QR code and share this id with Xumm.
    const qr = await xumm.fetchQrCode({
      web: `http://localhost:3000/login-success?external_id=${identifier}`,
      identifier
    })

    // Present the QR to the user.
    res.send(`
      <h1>Login with Xumm!</h1>
      ${menu()}
      <p><a href="${qr.next.always}">Click Here</a> to login with Xumm</p>
      <p>OR Scan this with Xumm Wallet App</p>
      <img src=${qr.refs.qr_png} />
      <p>
        Note: If you have the user scan directly here you'll need to 
        setup a poller or socket to react when Xumm sends a message after 
        the user has authenticated.
      </p>
      Session: ${req.sessionID}<br/>
      External: ${req.session.external}
    `)
    return
  }
  res.send(`
    <h1>Logged in already</h1>
    ${menu()}
    Session: ${req.sessionID}
    <p>Click Logout to end your session.!</p>
  `)
}
