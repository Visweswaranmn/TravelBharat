import rateLimit from 'express-rate-limit'

// Loose limit for general API traffic — won't bother a real user, just
// keeps someone from hammering the API in a loop.
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
})

// Register/login get a much tighter limit — these are the routes worth
// brute-forcing, everything else isn't as juicy a target.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later.' },
})
