import { Router } from 'express'

const router = Router()

// Client pings this on boot, and it doubles as the uptime check once deployed.
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TravelBharat API is running',
    timestamp: new Date().toISOString(),
  })
})

export default router
