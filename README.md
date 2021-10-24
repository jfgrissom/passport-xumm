# Xumm authentication strategy for Passport

A lib to quickly implement a Xumm wallet strategy for Passport. Most of the work related to Auth is handled by Xumm's web services so this strategy provides you a quick way to interact with Xumm's service specifically to signIn.

This strategy doesn't handle any other signing feature from Xumm other than "SignIn".

**NOTE:** This is being developed and won't be considered stable until version 1.0.0.

## API Key

Before you can use this you'll need to get an API key from Xumm.

Instructions for [setting up Xumm API keys is here](https://dev.to/wietse/xumm-sdk-1-get-your-xumm-api-credentials-5c3i).

Once you have a public (API Key) and private (API Secret) key pair you'll want to add them to a `.env` file and place it in the root of your project. Usage for this file come from [dotenv](https://www.npmjs.com/package/dotenv).

This dependency will be removed once the package is ready to ship v1.0.0.

```
XUMM_PUB_KEY=<YOUR-XUMM-API-KEY-HERE>
XUMM_PVT_KEY=<YOUR-XUMM-API-SECRET-HERE>
```

## Examples

There is a directory in the repository called examples. Currently it has an example for express.js that works from end to end. Keep in mind this example is just a skeleton API only. There are no front end components.

Using it will require you to use a tool like Postman and the Xumm Dashboard to interact.

## Auth Token

You'll receive an auth token, token creation time, and token expiration time from the Xumm Service. There should not need to be a need to generate an auth token locally.

## End To End Authentication Workflow

There is a diagram of the following sequence in the docs directory of this repo.

1. End user has opted to login through your UI.
1. Your UI presents a spinner and then makes a call out to your backend via a poller (or websocket).
1. Your backend then creates a UniqueID and binds it to your Session model.
1. Your backend then reaches out to the Xumm service (providing the UniqueID not an existing SessionID) and gets a payload that has a QR code and link details for people who can't use the QR code.
1. Your backend then takes that information and puts it into a "SignInFormData".
1. The backend returns the "SignInFormData" to your frontend.
1. Your frontend renders the "SignInFormData" and the user is presented with a QR code and link to follow if they can't use the QR code (if they are on the same device the QR code is presented on they can't scan it).
1. Once the user signs the request on their Xumm Mobile the Xumm service will send your callback endpoint a successful SignIn message.
1. Your API endpoint receives the payload from Xumm then checks back with Xumm to be sure it actually came from Xumm. This is what the "Authenticate" portion of the this lib handles.
1. Your backend creates a new unique SessionID record and persists it. [A new session is a best practice based on NIST recommendations](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63b.pdf). The templates provided in this repo reinforce this recommendation.
1. Your UI receives this success (and new SessionID) through the poller (or websocket), closes the connection, and redirects your user to an auth success page.

![E2E process](/docs/images/E2E-Sequence.drawio.png)

## Mandatory

1. Your code must provide a UniqueID to the function `Strategy.fetchQrCode()` and that same UniqueID must be bound to the user data you pass to `Strategy.authenticate()`.

## Optional

1. Redirect urls. If you provide a redirect urls they will be passed directly to Xumm. This is used when a person follows the Xumm "SignIn" link instead of using the QR code.

## Redirecting After Successful Signin

## Redirecting After Failed Login

## App Integration

## Overriding Default Templates
