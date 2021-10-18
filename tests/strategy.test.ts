import { suite, test } from '@testdeck/mocha'
import { fail } from 'assert'
import * as chai from 'chai'
import { mock, instance } from 'ts-mockito'

const should = chai.should()
const expect = chai.expect()

import { XummStrategy, iXummStrategyProps } from '../lib/passport-xumm'

@suite
class PassportXummUnitTests {
  private TestTarget: XummStrategy

  // before() {}
  // after() {}

  @test 'should fail when passed mangled keys'() {
    const props: iXummStrategyProps = {
      pubKey: 'MangledTestKey',
      pvtKey: 'MangledPvtKey'
    }

    // This should bubble up from the XummSDK validations for these keys.
    should.Throw(() => {
      const FailingSDK = new XummStrategy(props)
    }, Error)
  }
}
