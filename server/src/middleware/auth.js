import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'
import { ApiError } from '../utils/ApiError.js'
import { env } from '../config/env.js'

// Verifies the Bearer token and attaches the user to req.user. Express 5
// forwards thrown errors from async middleware to the error handler on its
// own, so this doesn't need a try/catch + next(err) wrapper.
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized — no token provided')
  }

  const token = authHeader.split(' ')[1]

  let decoded
  try {
    decoded = jwt.verify(token, env.jwtSecret)
  } catch {
    throw new ApiError(401, 'Not authorized — invalid or expired token')
  }

  const user = await User.findById(decoded.id)
  if (!user) {
    throw new ApiError(401, 'Not authorized — user no longer exists')
  }

  req.user = user
  next()
}

// Must run after `protect` — assumes req.user is already set.
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    throw new ApiError(403, 'Admin access required')
  }
  next()
}
