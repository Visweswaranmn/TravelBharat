// Lightweight custom error so controllers can do:
//   throw new ApiError(404, 'Destination not found')
// and the central error handler knows exactly what status/message to send.
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
    this.name = 'ApiError'
  }
}
