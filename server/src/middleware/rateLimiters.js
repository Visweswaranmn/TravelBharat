import rateLimit from 'express-rate-limit'

// Applied to every /api route — generous enough not to bother a normal
// user browsing the site, but stops naive scraping/abuse.
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
})

// Tighter limit on register/login specifically — the routes an attacker
// would actually want to brute-force.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later.' },
})
