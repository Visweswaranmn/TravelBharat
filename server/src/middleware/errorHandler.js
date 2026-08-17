import { env } from '../config/env.js'

// Catches any route that doesn't match — keeps 404s in the same JSON shape
// as every other response instead of Express's default HTML page.
export const notFound = (req, res, next) => {
  res.status(404)
  next(new Error(`Route not found — ${req.originalUrl}`))
}

// Central error handler. Every thrown error (ApiError or otherwise) ends
// up here via next(error) or an unhandled throw in an async route.
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500)

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    // Stack traces only in development — never leak internals in production.
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  })
}
