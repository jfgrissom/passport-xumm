# Example API for using Express with this Strategy.

The contents of this directory is just an example to get you started when using this library. It's useful for development if you want to help to improve this also.

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