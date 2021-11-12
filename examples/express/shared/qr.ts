import {
  XummStrategy,
  iXummStrategyProps
} from '../../../dist/lib/passport-xumm'
import { verify } from '../shared/verify'

export interface iFetchQrDataProps {
  pvtKey: string
  pubKey: string
  identifier: string
}

export const fetchQrData = async (props: iFetchQrDataProps) => {
  const { pvtKey, pubKey, identifier } = props

  const strategyProps: iXummStrategyProps = { pubKey, pvtKey, verify }
  const xumm = new XummStrategy(strategyProps)

  // Get a QR code and share this id with Xumm.
  return await xumm.fetchQrCode({
    web: `http://localhost:3000/login-success?external_id=${identifier}`,
    identifier
  })
}
