import { Request, Response, NextFunction } from 'express'
import passport from 'passport'

export const validate = (req: Request, res: Response, next: NextFunction) => {
  // At this point you'll need to check with your db.
  console.log('Start Validate Function *************')
  console.log(`Error: ${err}`)
  console.log(`User: ${user}`)
  console.log(`Info: ${info}`)
  console.log('Exit Validate Function *************')
  if (err) return next(err)
}
