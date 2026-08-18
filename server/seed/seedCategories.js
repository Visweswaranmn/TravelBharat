// Seeds the standard set of destination categories used across the app.
// Run with: npm run seed:categories — safe to re-run, clears first.

import mongoose from 'mongoose'
import { connectDB } from '../src/config/db.js'
import { Category } from '../src/models/index.js'

const categoriesData = [
  { name: 'Heritage', description: 'Forts, palaces, monuments and other sites of historical architecture.' },
  { name: 'Nature', description: 'Lakes, valleys, gardens and other natural landscapes.' },
  { name: 'Religious', description: 'Temples, mosques, churches and other places of worship.' },
  { name: 'Adventure', description: 'Trekking, desert safaris, water sports and other adventure activities.' },
  { name: 'Cultural', description: 'Living traditions, arts, crafts and local culture.' },
  { name: 'Beach', description: 'Coastal destinations and beaches.' },
  { name: 'Wildlife', description: 'National parks, sanctuaries and wildlife reserves.' },
  { name: 'Hill Station', description: 'Cool-climate towns in the hills and mountains.' },
  { name: 'Historical', description: 'Sites of major historical significance and ancient ruins.' },
]

const run = async () => {
  await connectDB()

  console.log('Clearing existing categories...')
  await Category.deleteMany({})

  for (const data of categoriesData) {
    const category = await Category.create(data)
    console.log(`Created category: ${category.name} (${category.slug})`)
  }

  console.log('\nSeed complete.')
  await mongoose.disconnect()
  process.exit(0)
}

run().catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1)
})
