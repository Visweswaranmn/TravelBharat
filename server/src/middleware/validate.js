import { validationResult } from 'express-validator'
import { ApiError } from '../utils/ApiError.js'

// Runs after an array of express-validator checks (e.g. registerValidation)
// and turns any failures into a single ApiError, so every route gets the
// same 422 response shape instead of hand-rolling checks per controller.
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
