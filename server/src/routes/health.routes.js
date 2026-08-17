import { Router } from 'express'

const router = Router()

// GET /api/health — used by the client on boot (and by the hosting
// platform's uptime check) to confirm the API is alive.
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TravelBharat API is running',
    timestamp: new Date().toISOString(),
  })
})

export default router
