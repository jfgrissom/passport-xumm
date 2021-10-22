export interface User {
  name: string
  id: string
  session: {
    id: string
  }
  wallets?: [
    {
      provider: string
      address: string
    }
  ]
}
