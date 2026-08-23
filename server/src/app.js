import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import { sanitizeInput } from './middleware/sanitizeInput.js'
import { generalLimiter } from './middleware/rateLimiters.js'
import healthRoutes from './routes/health.routes.js'
import authRoutes from './routes/auth.routes.js'
import stateRoutes from './routes/state.routes.js'
import cityRoutes from './routes/city.routes.js'
import destinationRoutes from './routes/destination.routes.js'
import categoryRoutes from './routes/category.routes.js'
import adminRoutes from './routes/admin.routes.js'

const app = express()

// Security headers. Our API only ever returns JSON, so helmet's defaults
// (CSP, X-Frame-Options, etc.) are pure upside — nothing here restricts
// what the frontend (a separate app/origin) can render or fetch.
app.use(helmet())
app.use(cors({ origin: env.clientUrl }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(sanitizeInput)
app.use('/api', generalLimiter)

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'))
}

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/states', stateRoutes)
app.use('/api/cities', cityRoutes)
app.use('/api/destinations', destinationRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/admin', adminRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
