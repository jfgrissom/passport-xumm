# Example API for using Express with this Strategy.

The contents of this directory is just an example to get you started when using this library. It's useful for development if you want to help to improve this also.

## Calling Xumm Service API

There are 3 cases we have for calling the Xumm API.

1. To get a QR Code. This happens when a user chooses to login ("SignIn").
2. To verify a POST payload send to our Xumm endpoint is valid. This happens after a user sings the "SignIn" request attached to the QR.
3. When we are pushing a transaction signing request to the user. This happens after "SignIn" and sometime during the user's normal activity on the site. Buying something, trading something on the ledger, paying fee, or moving funds.

Once we have a user_token (along with issue time and expiration time) from Xumm and an XRPL account from them the user is signed in until their token expires.

## Authenticated

What makes a user authenticated with Xumm?

When a user on your site signs a transaction (proving they are the owner of a specific account) they are authenticated.

Your app has to handle tieing together the account to a user and tieing a session to the user.

Your user is authenticated when they:

1. The user request a "SignIn" transaction from Xumm. (Your site needs to add an external identifier to the transaction to track the session making the authentication request.)
2. The user signs the transaction either on your sight directly or on Xumm's site. (Handled by Xumm Mobile wallet and Xumm Service.)
3. Xumm sends POST data back to your site using the external identifier you provided. (Your site needs to implement an endpoint that can receive this POST.)
4. Your site verifies the POST data is valid. (Your site needs to create or update a user with the session user_token passed to the application.)
5. Your site needs swaps the anonymous session out with a new one that is bound to the user that owns the wallet associated with the user_token passed from Xumm.

## Workflow

1. Use a tool like Postman to make a request to `http://locahost:3000/qr`. This will return a response that contains QR code data from Xumm.
2. Scan the QR with Xumm and sign the transaction.
3. Retrieve the payload send to your the webhook you have configured in the Xumm dashboard.
4. You can use that payload again in Postman to test our your application.

## Receiving POST Data From Xumm Locally

To receive posts from Xumm you'll need to do something to capture the payload from the Xumm Service. You have a couple options.

1. Use the tool that Xumm recommends `https://webhook.site/`. To do this you would take the payload you find there and submit it to your locally running API. For example you could use Postman.
2. Use a tool that tunnels your local system out to an endpoint on the internet. In this case you would use a tool like ngrok.

If you're developing locally you can setup ngrok to tunnel to your local machine (https://dashboard.ngrok.com/get-started/tutorials).

Change your webhook endpoint in the Xumm dashboard to receive Xumm payloads directly from their web service.

## Getting a QR Code

In this example there are 2 ways get a QR code that your Xumm user can use to authenticate. See examples of these.

1. From the /api/qr route by making a webservice call. See: examples/express/route-handlers/qr.ts for usage in this way.
1. From directly from the strategy itself by instantiating the StrategyXumm and calling the `fetchQrCode()` function. See: examples/express/route-handlers/login.ts for usage in this way.

## Understanding Payloads

Example request body received from Xumm Service once a QR code is signed. This request comes in from Xumm Service. You define it in the Xumm App Dashboard. The property it's called the "Webhook URL for callbacks".

```
{
  "meta": {
    "url": "https://webhook.site/44444444-bbbb-4444-aaaa-999999999999",
    "application_uuidv4": "44444444-3333-4444-8888-000000000000",
    "payload_uuidv4": "33333333-8888-4444-8888-444444444444",
    "opened_by_deeplink": true
  },
  "custom_meta": {
    "identifier": "99999999-3333-4444-9999-444444444444",
    "blob": null,
    "instruction": null
  },
  "payloadResponse": {
    "payload_uuidv4": "33333333-8888-4444-8888-444444444444",
    "reference_call_uuidv4": "00000000-4444-4444-bbbb-777777777777",
    "signed": true,
    "user_token": true,
    "return_url": {
      "app": null,
      "web": "http://localhost:3000"
    }
  },
  "userToken": {
    "user_token": "aaaaaaaa-1111-2222-3333-bbbbbbbbbbbb",
    "token_issued": 1634860406,
    "token_expiration": 1637452406
  }
}
```

Example response from Xumm Service when calling https://xumm.app/api/v1/platform/payload/ci/:

```
{
  "meta": {
    "exists":true
    "uuid":"eeeeeeee-eeee-4444-bbbb-111111111111"
    "multisign":false
    "submit":false
    "destination":""
    "resolved_destination":""
    "resolved":true
    "signed":true
    "cancelled":false
    "expired":true
    "pushed":false
    "app_opened":true
    "opened_by_deeplink":true
    "return_url_app":NULL
    "return_url_web":NULL
    "is_xapp":false
  },
  "application": {
    "name":"YourAppName"
    "description":"Your App description that you registered in the Xumm Dashboard."
    "disabled":0
    "uuidv4":"aaaaaaaa-8888-4444-aaaa-444444444444"
    "icon_url":"https://xumm-cdn.imgix.net/app-logo/aaaaaaaa-bbbb-4444-aaaa-dddddddddddd.png"
    "issued_user_token":NULL
  },
  "payload": {
    "tx_type":"SignIn"
    "tx_destination":""
    "tx_destination_tag":NULL
    "request_json":{...}
    "origintype":"QR"
    "signmethod":"BIOMETRIC"
    "created_at":"2021-03-02T05:28:48Z"
    "expires_at":"2021-03-03T05:28:48Z"
    "expires_in_seconds":-152180
  },
  "response": {
    "hex":"HEXPAYLOAD"
    "txid":"HEXTRANSACTIONID"
    "resolved_at":"2021-03-02T05:30:45.000Z"
    "dispatched_to":"wss://xrpl.ws"
    "dispatched_result":""
    "dispatched_nodetype":"MAINNET"
    "multisign_account":""
    "account":"AnXrpAccountNumber"
  },
  "custom_meta":{
    "identifier":"aaaaaaaa-bbbb-4444-aaaa-222222222222"
    "blob":NULL
    "instruction":NULL
  }
}
```
