import dotenv from 'dotenv'

dotenv.config()

// Single place that reads process.env so the rest of the app never touches
// it directly. Fail fast if something required is missing instead of
// limping along with `undefined` and failing mysteriously later.
const required = ['MONGO_URI', 'JWT_SECRET']

for (const key of required) {
  if (!process.env[key]) {
    // eslint-disable-next-line no-console
    console.warn(`[env] Warning: ${key} is not set in .env`)
  }
}

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
}
