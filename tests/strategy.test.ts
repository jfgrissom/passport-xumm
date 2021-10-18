import * as chai from 'chai'
import { mock, when } from 'omnimock'
import { XummTypes } from 'xumm-sdk'

const should = chai.should
const expect = chai.expect

import { XummStrategy, iXummStrategyProps } from '../lib/passport-xumm'

import dotenv from 'dotenv'
dotenv.config()

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
    const TestTarget = new XummStrategy(props)
    TestTarget.createPayload =
      async (): Promise<XummTypes.XummPostPayloadResponse> => {
        const response = {
          uuid: 'zzzzzzzz-9999-2222-5555-yyyyyyyyyyyy',
          next: {
            always: 'https://xumm.app/sign/zzzzzzzz-9999-2222-5555-yyyyyyyyyyyy'
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

    const result = await TestTarget.fetchQrCode()
    expect(result).to.have.all.keys('uuid', 'next', 'refs', 'pushed')
    expect(result.next).to.have.key('always')
    expect(result.refs).to.have.all.keys(
      'qr_png',
      'qr_matrix',
      'qr_uri_quality_opts',
      'websocket_status'
    )
  })
})
