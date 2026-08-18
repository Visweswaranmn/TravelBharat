// Seeds a small, realistic set of states and cities for development and
// demo purposes. This is NOT the final comprehensive dataset — that's a
// dedicated later phase covering all states/UTs. This just gives the
// Explore/State/City pages real content to render and be tested against.
//
// Run with: npm run seed:states-cities
// Safe to re-run — clears existing states and cities first.

import mongoose from 'mongoose'
import { connectDB } from '../src/config/db.js'
import { State, City } from '../src/models/index.js'

const wikimedia = (file) => `https://commons.wikimedia.org/wiki/Special:FilePath/${file}`

const statesData = [
  {
    name: 'Tamil Nadu',
    code: 'TN',
    capital: 'Chennai',
    description:
      'A southern state famed for towering Dravidian temples, a rich classical arts tradition, and a coastline stretching from Chennai to Kanyakumari, backed by the cool hill stations of the Western Ghats.',
    image: { url: wikimedia('Meenakshi_Amman_Temple.jpg'), alt: 'Meenakshi Amman Temple, Madurai' },
    cities: [
      {
        name: 'Ooty',
        description:
          'A colonial-era hill station in the Nilgiris, known for tea plantations, a toy train up from Mettupalayam, and cool weather year-round.',
        image: { url: wikimedia('Ooty_Lake.jpg'), alt: 'Ooty Lake' },
      },
      {
        name: 'Madurai',
        description:
          "One of India's oldest continuously inhabited cities, built around the towering gopurams of the Meenakshi Amman Temple.",
        image: { url: wikimedia('Meenakshi_Amman_Temple.jpg'), alt: 'Meenakshi Amman Temple, Madurai' },
      },
      {
        name: 'Mahabalipuram',
        description:
          'A UNESCO World Heritage coastal town known for 7th-century rock-cut temples and shore temples carved by the Pallava dynasty.',
        image: { url: wikimedia('Shore_Temple,_Mahabalipuram.jpg'), alt: 'Shore Temple, Mahabalipuram' },
      },
    ],
  },
  {
    name: 'Kerala',
    code: 'KL',
    capital: 'Thiruvananthapuram',
    description:
      'Known as "God’s Own Country" — a lush strip of backwaters, tea-covered hills, and beaches along India’s southwest coast.',
    image: { url: wikimedia('Alleppey_Backwaters.jpg'), alt: 'Backwaters of Alleppey' },
    cities: [
      {
        name: 'Munnar',
        description:
          'A hill station in the Western Ghats blanketed in rolling tea estates, with cool weather and views over the Kannan Devan hills.',
        image: { url: wikimedia('Munnar_Tea_Gardens.jpg'), alt: 'Tea gardens in Munnar' },
      },
      {
        name: 'Kochi',
        description:
          "A historic port city on the Malabar coast, shaped by centuries of Portuguese, Dutch and British trade — known for its Chinese fishing nets and old-world Fort Kochi.",
        image: { url: wikimedia('Fort_Kochi_Chinese_fishing_nets.jpg'), alt: 'Chinese fishing nets, Fort Kochi' },
      },
      {
        name: 'Alleppey',
        description:
          "The heart of Kerala's backwaters, where houseboats drift along a network of canals, lagoons and lakes fringed by coconut palms.",
        image: { url: wikimedia('Alleppey_Backwaters.jpg'), alt: 'Backwaters of Alleppey' },
      },
    ],
  },
  {
    name: 'Rajasthan',
    code: 'RJ',
    capital: 'Jaipur',
    description:
      "India's largest state — a land of desert forts, royal palaces, and the pink and blue cities of Jaipur and Jodhpur, on the edge of the Thar Desert.",
    image: { url: wikimedia('Hawa_Mahal.jpg'), alt: 'Hawa Mahal, Jaipur' },
    cities: [
      {
        name: 'Jaipur',
        description:
          'The "Pink City" — Rajasthan’s capital, home to the Hawa Mahal, Amber Fort, and the City Palace complex.',
        image: { url: wikimedia('Hawa_Mahal.jpg'), alt: 'Hawa Mahal, Jaipur' },
      },
      {
        name: 'Udaipur',
        description: 'The "City of Lakes" — built around Lake Pichola, with the City Palace rising along its eastern shore.',
        image: { url: wikimedia('City_Palace,_Udaipur.jpg'), alt: 'City Palace, Udaipur' },
      },
      {
        name: 'Jaisalmer',
        description: 'A golden sandstone fort city on the edge of the Thar Desert, still inhabited within its centuries-old walls.',
        image: { url: wikimedia('Jaisalmer_Fort.jpg'), alt: 'Jaisalmer Fort' },
      },
    ],
  },
  {
    name: 'Karnataka',
    code: 'KA',
    capital: 'Bengaluru',
    description:
      'Home to the ruined temple city of Hampi, the royal palaces of Mysuru, and the coffee-and-mist hills of Coorg.',
    image: { url: wikimedia('Mysore_Palace.jpg'), alt: 'Mysore Palace' },
    cities: [
      {
        name: 'Mysuru',
        description: 'A former royal capital known for the grand Mysore Palace and its Dasara festival celebrations.',
        image: { url: wikimedia('Mysore_Palace.jpg'), alt: 'Mysore Palace' },
      },
      {
        name: 'Hampi',
        description:
          'The ruined capital of the Vijayanagara Empire, a UNESCO World Heritage site scattered with temples and boulders along the Tungabhadra river.',
        image: { url: wikimedia('Virupaksha_Temple,_Hampi.jpg'), alt: 'Virupaksha Temple, Hampi' },
      },
      {
        name: 'Coorg',
        description:
          'A misty hill district in the Western Ghats known for coffee plantations, waterfalls, and Kodava culture — also called Kodagu.',
        // No verified Coorg-specific photo yet — reusing the Hampi image as a
        // placeholder rather than leaving a broken image. Swap this out
        // during the dedicated seed-data phase.
        image: { url: wikimedia('Virupaksha_Temple,_Hampi.jpg'), alt: 'Virupaksha Temple, Hampi (placeholder — Coorg photo pending)' },
      },
    ],
  },
]

const run = async () => {
  await connectDB()

  console.log('Clearing existing states and cities...')
  await City.deleteMany({})
  await State.deleteMany({})

  for (const { cities, ...stateFields } of statesData) {
    const state = await State.create(stateFields)
    console.log(`Created state: ${state.name} (${state.slug})`)

    for (const cityFields of cities) {
      const city = await City.create({ ...cityFields, state: state._id })
      console.log(`  Created city: ${city.name} (${city.slug})`)
    }
  }

  console.log('\nSeed complete.')
  await mongoose.disconnect()
  process.exit(0)
}

run().catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1)
})
