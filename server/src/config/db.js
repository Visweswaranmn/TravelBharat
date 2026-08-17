import mongoose from 'mongoose'
import { env } from './env.js'

export const connectDB = async () => {
  if (!env.mongoUri) {
    console.error('[db] MONGO_URI is missing — cannot connect to MongoDB.')
    process.exit(1)
  }

  try {
    const conn = await mongoose.connect(env.mongoUri)
    console.log(`[db] MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`[db] Connection failed: ${error.message}`)
    process.exit(1)
  }
}
