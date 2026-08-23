// Manual sanity check for the Mongoose models — not a real test suite,
// just a quick way to confirm the schemas, refs, and slug logic behave
// before building APIs on top of them. Creates a handful of documents
// against the real database, prints what happened, then cleans up.
//
// Run with: npm run verify:models

import mongoose from 'mongoose'
import { connectDB } from '../src/config/db.js'
import { State, City, Category, Destination } from '../src/models/index.js'

const run = async () => {
  await connectDB()
  console.log('\nCreating sample documents...\n')

  const category = await Category.create({
    name: 'Heritage',
    description: 'Forts, monuments and historical sites',
  })
  console.log(`Category "${category.name}" → slug: ${category.slug}`)

  const tamilNadu = await State.create({
    name: 'Tamil Nadu',
    code: 'TN',
    capital: 'Chennai',
    description: 'A southern state known for temples, beaches and hill stations.',
    image: { url: 'https://example.com/tn.jpg', alt: 'Tamil Nadu' },
  })
  console.log(`State "${tamilNadu.name}" → slug: ${tamilNadu.slug}`)

  const karnataka = await State.create({
    name: 'Karnataka',
    code: 'KA',
    capital: 'Bengaluru',
    description: 'Home to Hampi, Mysuru and the Western Ghats.',
    image: { url: 'https://example.com/ka.jpg', alt: 'Karnataka' },
  })
  console.log(`State "${karnataka.name}" → slug: ${karnataka.slug}`)

  const ooty = await City.create({
    name: 'Ooty',
    state: tamilNadu._id,
    description: 'A hill station in the Nilgiris.',
    image: { url: 'https://example.com/ooty.jpg', alt: 'Ooty' },
  })
  console.log(`City "${ooty.name}" (Tamil Nadu) → slug: ${ooty.slug}`)

  // Same city name in a different state — should NOT collide, since a
  // city's slug is only unique within its own state.
  const ootyAgain = await City.create({
    name: 'Ooty',
    state: karnataka._id,
    description: 'Testing per-state slug scoping.',
    image: { url: 'https://example.com/ooty2.jpg', alt: 'Ooty (test)' },
  })
  console.log(`City "${ootyAgain.name}" (Karnataka) → slug: ${ootyAgain.slug} (expected "ooty", proving per-state scoping)`)

  const fort1 = await Destination.create({
    name: 'Fort',
    state: tamilNadu._id,
    city: ooty._id,
    category: category._id,
    shortDescription: 'A test destination.',
    description: 'Used to verify the Destination schema and slug uniqueness.',
    images: [{ url: 'https://example.com/fort1.jpg', alt: 'Fort' }],
  })
  console.log(`Destination "${fort1.name}" (Tamil Nadu) → slug: ${fort1.slug}`)

  // Same destination name elsewhere — slugs are globally unique for
  // Destination, so this should get a "-2" suffix.
  const fort2 = await Destination.create({
    name: 'Fort',
    state: karnataka._id,
    city: ootyAgain._id,
    category: category._id,
    shortDescription: 'A second test destination with the same name.',
    description: 'Used to verify unique slug suffixing across destinations.',
    images: [{ url: 'https://example.com/fort2.jpg', alt: 'Fort' }],
  })
  console.log(`Destination "${fort2.name}" (Karnataka) → slug: ${fort2.slug} (expected "fort-2")`)

  console.log('\nTesting duplicate category name rejection...')
  try {
    await Category.create({ name: 'Heritage', description: 'Should fail' })
    console.log('✗ Duplicate category was NOT rejected — check the unique index!')
  } catch (error) {
    console.log(`✓ Duplicate category correctly rejected: ${error.message.split('\n')[0]}`)
  }

  console.log('\nCleaning up test documents...')
  await Destination.deleteMany({ _id: { $in: [fort1._id, fort2._id] } })
  await City.deleteMany({ _id: { $in: [ooty._id, ootyAgain._id] } })
  await State.deleteMany({ _id: { $in: [tamilNadu._id, karnataka._id] } })
  await Category.deleteMany({ _id: category._id })

  console.log('Done — database left clean.\n')
  await mongoose.disconnect()
  process.exit(0)
}

run().catch((error) => {
  console.error('Verification failed:', error)
  process.exit(1)
})
