// Keeps every success response in the same shape: { success, message, data }.
// Error responses are handled separately by the central errorHandler.
export const sendSuccess = (res, statusCode, message, data = null) =>
  res.status(statusCode).json({ success: true, message, data })
