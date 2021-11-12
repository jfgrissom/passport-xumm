import { Request, Response } from 'express'
import { XummStrategy } from '../../../dist/lib/passport-xumm'

// import { User } from '../entities/user'
import { verify } from '../shared/verify'

// Once a request comes in check with Xumm to be sure the payload is real.
export const xumm = async (req: Request, res: Response) => {
  const pubKey = process.env.XUMM_PUB_KEY
  const pvtKey = process.env.XUMM_PVT_KEY
  console.log(`Request From Xumm: ${JSON.stringify(req.body)}`)

  // This externalId should be something your application previously
  // passed to Xumm when you requested the QR code.
  const externalId = req.body.custom_meta.identifier

  // This xummUserToken is the value passed to use from Xumm for a
  // specific user. This value never changes on the Xumm side so you
  // can depend on it.
  const xummUserToken = req.body.userToken.user_token

  // If there is no externalId then this isn't likely from Xumm.
  // Silently return a 200 to the caller and exit this function.
  if (!externalId) {
    res.sendStatus(200)
    return
  }

  // Confirm the POST data is valid.
  const xummStrategyProps = {
    pubKey,
    pvtKey,
    verify
  }
  const strategy = new XummStrategy(xummStrategyProps)

  /*
    Returns null if the externalId isn't valid or it 
    returns and object {
      externalId
      userToken
    }
   */
  // const validated = await strategy.authenticate

  /* TODO: At this point we have a validated the payload 
  The response should look like this:
  {
    wallet: {
      provider: 'xumm'
      owner: "Some User Token",
      account: "Some XRP Account"       
    }
    externalId
  }
  Use this data to create a wallet.
  */

  // We have an externalId and it's valid so get the some database repos.
  //const userRepository = await req.context.db.getRepository(User)

  // At this point you have a session in the DB that has this external ID within it.
  // The next thing to do is bind the session to a user.

  // Construct the user.
  //const user = new User()
  //user.id = validated.userToken

  // Go ahead and save the user. According to typeorm docs save is an "upsert".
  //userRepository.save(user)

  // This is what gets returned to the caller (Xumm Service)
  // because we received their payload.
  res.sendStatus(200)
}
