import { v4 } from 'uuid'

export const generateIdentifier = (): string => {
  return v4() as string
}
