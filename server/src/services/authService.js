import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'
import { ApiError } from '../utils/ApiError.js'
import { env } from '../config/env.js'

const SALT_ROUNDS = 10

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  })

// select: false already keeps passwordHash out of normal queries, but
// shaping the response explicitly here means we're not relying on that
// alone if some future query opts back in with .select('+passwordHash').
const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
})

export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email })
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists')
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  // role is intentionally never taken from the request body — every
  // self-registered account is a plain "user". Admins are promoted
  // directly in the database, not through this endpoint.
  const user = await User.create({ name, email, passwordHash })

  return { user: sanitizeUser(user), token: generateToken(user) }
}

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash')

  // Same generic message whether the email doesn't exist or the password
  // is wrong — don't give an attacker a way to enumerate valid accounts.
  if (!user) {
    throw new ApiError(401, 'Invalid email or password')
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password')
  }

  return { user: sanitizeUser(user), token: generateToken(user) }
}
