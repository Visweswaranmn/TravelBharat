import { env } from '../config/env.js'

// Catches any route that doesn't match — keeps 404s in the same JSON shape
// as every other response instead of Express's default HTML page.
export const notFound = (req, res, next) => {
  res.status(404)
  next(new Error(`Route not found — ${req.originalUrl}`))
}

// Central error handler. Every thrown error (ApiError or otherwise) ends
// up here — either via next(error), or automatically: Express 5 forwards
// both sync throws and rejected promises from async middleware/controllers,
// so route handlers don't need a try/catch or asyncHandler wrapper.
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500)
  let message = err.message || 'Internal server error'

  // Mongoose gave up parsing an id, e.g. GET /api/states/not-a-real-id
  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid ${err.path}: ${err.value}`
  }

  // Mongoose schema validation failed on .save()/.create()
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')
  }

  // Unique index violation
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue)[0]
    message = `${field} "${err.keyValue[field]}" is already in use`
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Stack traces only in development — never leak internals in production.
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  })
}
