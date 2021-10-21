import * as chai from 'chai'
import { XummTypes } from 'xumm-sdk'

const should = chai.should
const expect = chai.expect

import { XummStrategy, iXummStrategyProps } from '../lib/passport-xumm'

import dotenv from 'dotenv'
dotenv.config()

/*
Payload received from Xumm Service after QR code is successfully Scanned.
{
  "meta": {
    "url": "https://webhook.site/465ae607-b614-485b-ad3a-95bcff393e75",
    "application_uuidv4": "4f4fe10e-3be4-4542-8217-04157001fe74",
    "payload_uuidv4": "40b8904d-45e6-4643-a544-d13b3bd808c5",
    "opened_by_deeplink": true
  },
  "custom_meta": {
    "identifier": "a27af89d-206f-4a9c-883f-02f9d2471b76",
    "blob": null,
    "instruction": null
  },
  "payloadResponse": {
    "payload_uuidv4": "40b8904d-45e6-4643-a544-d13b3bd808c5",
    "reference_call_uuidv4": "49e9c4b1-82e9-40bf-885d-dc61c9cee917",
    "signed": true,
    "user_token": true,
    "return_url": {
      "app": null,
      "web": "http://localhost:3000"
    }
  },
  "userToken": {
    "user_token": "d4187f3d-68c5-4fe1-876f-7df453a0e278",
    "token_issued": 1634830957,
    "token_expiration": 1637422957
  }
}
*/

describe('PassportXummUnitTests', () => {
  it('should fail when passed mangled keys', () => {
    const props: iXummStrategyProps = {
      pubKey: 'MangledTestKey',
      pvtKey: 'MangledPvtKey'
    }

    should().Throw(() => {
      const TestTarget = new XummStrategy(props)
    }, Error)
  })

  it('should init correctly when passed unmangled keys', () => {
    const props: iXummStrategyProps = {
      pubKey: 'aaaaaaaa-1111-2222-3333-bbbbbbbbbbbb',
      pvtKey: '00000000-aaaa-bbbb-cccc-111111111111'
    }
    const TestTarget = new XummStrategy(props)
    expect(TestTarget).to.be.a('Object')
  })

  // This mocks the behavior of the real XummSDK we expect.
  it('should return expected payload if fetchQrCode is called with an a valid key pair', async () => {
    // We'll pretend these are good addresses and mock what are expecting to be returned.
    // Xumm is going to handle returning this data correctly. This test is to enforce a
    // contract that ensures anything using this data downstream gets what we expect.
    const props: iXummStrategyProps = {
      pubKey: 'aaaaaaaa-1111-2222-3333-bbbbbbbbbbbb',
      pvtKey: '00000000-aaaa-bbbb-cccc-111111111111'
    }
    const identifier = 'UnitTestId01'

    const TestTarget = new XummStrategy(props)
    TestTarget.createPayload =
      async (): Promise<XummTypes.XummPostPayloadResponse> => {
        const response = {
          uuid: 'zzzzzzzz-9999-2222-5555-yyyyyyyyyyyy',
          next: {
            always: 'https://xumm.app/sign/zzzzzzzz-9999-2222-5555-yyyyyyyyyyyy'
          },
          custom_meta: {
            identifier: identifier
          },
          refs: {
            qr_png:
              'https://xumm.app/sign/zzzzzzzz-9999-2222-5555-yyyyyyyyyyyy_q.png',
            qr_matrix:
              'https://xumm.app/sign/zzzzzzzz-9999-2222-5555-yyyyyyyyyyyy_q.json',
            qr_uri_quality_opts: ['m', 'q', 'h'],
            websocket_status:
              'wss://xumm.app/sign/zzzzzzzz-9999-2222-5555-yyyyyyyyyyyy'
          },
          pushed: false
        } as XummTypes.XummPostPayloadResponse
        return Promise.resolve(response)
      }

    const result = await TestTarget.fetchQrCode({ identifier: identifier })
    expect(result).to.have.all.keys(
      'uuid',
      'custom_meta',
      'next',
      'refs',
      'pushed'
    )
    expect(result.custom_meta).expect(result.next).to.have.key('always')
    expect(result.refs).to.have.all.keys(
      'qr_png',
      'qr_matrix',
      'qr_uri_quality_opts',
      'websocket_status'
    )
  })
})
