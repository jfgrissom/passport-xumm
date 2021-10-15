# Xumm authentication strategy for Passport

A lib to quickly implement a Xumm wallet strategy for Passport.

## API Key

Before you can use this you'll need to get an API key from Xumm.

Instructions for [setting up Xumm API keys is here](https://dev.to/wietse/xumm-sdk-1-get-your-xumm-api-credentials-5c3i).

Once you have a public (API Key) and private (API Secret) key pair you'll want to add them to a `.env` file and place it in the root of your project. Usage for this file come from [dotenv](https://www.npmjs.com/package/dotenv).

```
XUMM_PUB_KEY=<YOUR-XUMM-API-KEY-HERE>
XUMM_PVT_KEY=<YOUR-XUMM-API-SECRET-HERE>
```

## Authentication Workflow

1. End user has opted to login.
1. Your UI presents a spinner and then makes a call out to your backend via a websocket.
1. Your backend creates a unique session ID record and stores it. Then it reaches out to the Xumm service and gets a payload that has a QR code and link details for people who can't use the QR code. It takes that information and puts it into a "SignInFormDatum"
1. The backend returns the "SignInFormDatum" to your frontend.
1. Your frontend renders the "SignInFormDatum" and the user is presented with a QR code and link to follow if they can't use the QR code.
1. Once the user signs the request on their Xumm Mobile the Xumm service will send your callback endpoint a successful SignIn message.
1. Your UI receives this success through the websocket, closes the connection, and redirects your user to an auth success page.

## Optional

1. Redirect urls. If you provide a redirect urls they will be passed directly to Xumm. This is used when a person follows the Xumm "SignIn" link instead of using the QR code.

## Redirecting After Successful Signin

## Redirecting After Failed Login

## App Integration

## Overriding Default Templates

