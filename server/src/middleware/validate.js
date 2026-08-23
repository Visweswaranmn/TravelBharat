import { validationResult } from 'express-validator'
import { ApiError } from '../utils/ApiError.js'

// Drops in after an express-validator chain and turns whatever it found
// into one ApiError, so every route errors out the same way instead of
// each controller checking validationResult itself.
export const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(', ')
    throw new ApiError(422, message)
  }

  next()
}
