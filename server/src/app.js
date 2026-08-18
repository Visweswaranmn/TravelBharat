import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { env } from './config/env.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import healthRoutes from './routes/health.routes.js'
import authRoutes from './routes/auth.routes.js'
import stateRoutes from './routes/state.routes.js'
import cityRoutes from './routes/city.routes.js'

const app = express()

app.use(cors({ origin: env.clientUrl }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'))
}

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/states', stateRoutes)
app.use('/api/cities', cityRoutes)

// Route modules for destinations/categories get mounted here in later phases.

app.use(notFound)
app.use(errorHandler)

export default app
