// Seeds 2 destinations per city from the Phase 4 seed data — enough to
// exercise the full Destinations feature (filtering, search, detail pages,
// nearby attractions) without being the final comprehensive dataset.
//
// Depends on states/cities (seed:states-cities) and categories
// (seed:categories) already existing. Run with: npm run seed:destinations
//
// Images are reused from the parent city/state photo rather than sourcing
// a brand new one per destination — a deliberate shortcut for this seed
// pass; unique photography per destination belongs to the dedicated
// seed-data phase later.

import mongoose from 'mongoose'
import { connectDB } from '../src/config/db.js'
import { State, City, Category, Destination } from '../src/models/index.js'

const wikimedia = (file) => `https://commons.wikimedia.org/wiki/Special:FilePath/${file}`

// citySlug -> destinations for that city
const destinationsData = {
  ooty: [
    {
      name: 'Ooty Lake',
      category: 'Nature',
      shortDescription: 'An artificial lake at the foot of the Nilgiris, popular for boating and lakeside walks.',
      description:
        'Created in 1824 by John Sullivan, the first British Collector of Coimbatore, Ooty Lake is a long, narrow artificial lake fed by mountain streams. Boating is the main draw, alongside a small amusement park and a toy train ride that runs along part of the shore.',
      bestTimeToVisit: 'October to March',
      entryFee: '₹15 entry, boating charged separately',
      openingTime: '9:00 AM',
      closingTime: '6:00 PM',
      location: { lat: 11.4064, lng: 76.6932 },
      images: [{ url: wikimedia('Ooty_Lake.jpg'), alt: 'Ooty Lake' }],
      travelTips: ['Arrive early on weekends to avoid boating queues.', 'Carry a light jacket — evenings get cool year-round.'],
    },
    {
      name: 'Doddabetta Peak',
      category: 'Hill Station',
      shortDescription: 'The highest peak in the Nilgiris, with a telescope house offering panoramic views.',
      description:
        'At over 2,600 metres, Doddabetta is the tallest peak in the Nilgiri range and the highest point in Tamil Nadu. A short walk from the parking area leads to a telescope house where, on a clear day, you can see across the surrounding hills toward Mysuru.',
      bestTimeToVisit: 'October to March, on a clear morning',
      entryFee: '₹10 for the telescope house',
      openingTime: '7:00 AM',
      closingTime: '5:30 PM',
      location: { lat: 11.4064, lng: 76.7378 },
      images: [{ url: wikimedia('Ooty_Lake.jpg'), alt: 'View near Doddabetta Peak, Ooty' }],
      travelTips: ['Go early — cloud cover often rolls in by late morning.'],
    },
  ],
  madurai: [
    {
      name: 'Meenakshi Amman Temple',
      category: 'Religious',
      shortDescription: 'A vast Dravidian temple complex famed for its painted gopurams and thousand-pillar hall.',
      description:
        'Dedicated to the goddess Meenakshi and her consort Sundareswarar, this temple complex covers 14 gopurams (gateway towers), the tallest rising over 51 metres, all covered in thousands of painted stone figures. The temple has been a center of pilgrimage and Tamil culture for centuries.',
      historicalSignificance:
        'The current structure was largely built during the 16th and 17th centuries under the Nayak dynasty, though the site has been a place of worship for much longer.',
      bestTimeToVisit: 'October to March',
      entryFee: 'Free (camera charges apply inside)',
      openingTime: '5:00 AM',
      closingTime: '9:30 PM',
      location: { lat: 9.9195, lng: 78.1193 },
      images: [{ url: wikimedia('Meenakshi_Amman_Temple.jpg'), alt: 'Meenakshi Amman Temple, Madurai' }],
      travelTips: ['Dress modestly — shoulders and knees covered.', 'Leather items (belts, wallets) aren’t allowed inside.'],
    },
    {
      name: 'Thirumalai Nayakkar Palace',
      category: 'Historical',
      shortDescription: '17th-century Indo-Saracenic palace known for its massive pillared courtyard.',
      description:
        'Built in 1636 by King Thirumalai Nayak, this palace blends Dravidian and Islamic architectural styles. Only about a quarter of the original complex survives today, centered on a grand courtyard ringed by towering circular pillars.',
      historicalSignificance: 'Once the seat of the Nayak rulers of Madurai, a dynasty that governed the region for over two centuries.',
      bestTimeToVisit: 'October to March',
      entryFee: '₹10 (Indians), ₹100 (Foreign Nationals)',
      openingTime: '9:00 AM',
      closingTime: '5:00 PM',
      location: { lat: 9.9176, lng: 78.1231 },
      images: [{ url: wikimedia('Meenakshi_Amman_Temple.jpg'), alt: 'Nayak-era architecture near Madurai' }],
      travelTips: ['A sound-and-light show runs in the evening — check timings locally.'],
    },
  ],
  mahabalipuram: [
    {
      name: 'Shore Temple',
      category: 'Heritage',
      shortDescription: 'A UNESCO World Heritage granite temple standing right at the edge of the Bay of Bengal.',
      description:
        'Built in the 8th century under the Pallava dynasty, the Shore Temple is one of the oldest structural stone temples in South India. Its silhouette against the Bay of Bengal has made it one of the most photographed monuments on the Tamil Nadu coast.',
      historicalSignificance: 'Part of the Group of Monuments at Mahabalipuram, a UNESCO World Heritage Site since 1984.',
      bestTimeToVisit: 'November to February',
      entryFee: '₹40 (Indians), ₹600 (Foreign Nationals)',
      openingTime: '6:00 AM',
      closingTime: '6:00 PM',
      location: { lat: 12.6161, lng: 80.1982 },
      images: [{ url: wikimedia('Shore_Temple,_Mahabalipuram.jpg'), alt: 'Shore Temple, Mahabalipuram' }],
      travelTips: ['Visit at sunrise for the best light and fewer crowds.'],
    },
    {
      name: 'Pancha Rathas',
      category: 'Historical',
      shortDescription: 'Five monolithic rock-cut shrines, each carved from a single block of granite.',
      description:
        "Named after the Pandava brothers and Draupadi from the Mahabharata, these five rathas (chariots) were each carved from a single piece of rock in the 7th century, showcasing early Dravidian temple architecture in miniature.",
      historicalSignificance: 'Considered a precursor to later Dravidian temple design across South India.',
      bestTimeToVisit: 'November to February',
      entryFee: '₹40 (Indians), ₹600 (Foreign Nationals)',
      openingTime: '6:00 AM',
      closingTime: '6:00 PM',
      location: { lat: 12.6183, lng: 80.1953 },
      images: [{ url: wikimedia('Shore_Temple,_Mahabalipuram.jpg'), alt: 'Pallava-era rock-cut architecture, Mahabalipuram' }],
      travelTips: ['Combine with a visit to the nearby Arjuna’s Penance rock relief.'],
    },
  ],
  munnar: [
    {
      name: 'Munnar Tea Gardens',
      category: 'Nature',
      shortDescription: 'Rolling tea estates carpeting the hills, with working plantations open to visitors.',
      description:
        'Munnar’s tea gardens spread across the hills at elevations up to 1,600 metres, planted by British planters in the 19th century and still in commercial production today. Several estates offer walking trails through the plantations and tea-tasting at their factories.',
      bestTimeToVisit: 'September to March',
      entryFee: 'Free to view; factory tours ~₹100–150',
      openingTime: '8:00 AM',
      closingTime: '5:00 PM',
      location: { lat: 10.0889, lng: 77.0595 },
      images: [{ url: wikimedia('Munnar_Tea_Gardens.jpg'), alt: 'Tea gardens in Munnar' }],
      travelTips: ['The Tea Museum near town is a good starting point before visiting the estates.'],
    },
    {
      name: 'Eravikulam National Park',
      category: 'Wildlife',
      shortDescription: "Home to the endangered Nilgiri Tahr, set among rolling grasslands and shola forests.",
      description:
        "Eravikulam protects the largest surviving population of the Nilgiri Tahr, a mountain goat found only in the Western Ghats. The park's rolling grasslands and shola forest patches are accessible via a short shuttle bus ride and walking trail open to visitors.",
      bestTimeToVisit: 'September to April (closed during peak monsoon)',
      entryFee: '₹125 (Indians), ₹525 (Foreign Nationals)',
      openingTime: '7:00 AM',
      closingTime: '4:00 PM',
      location: { lat: 10.1631, lng: 77.0537 },
      images: [{ url: wikimedia('Munnar_Tea_Gardens.jpg'), alt: 'Grasslands near Eravikulam National Park, Munnar' }],
      travelTips: ['Only a limited section of the park is open to the public — book shuttle tickets at the entrance.'],
    },
  ],
  kochi: [
    {
      name: 'Fort Kochi',
      category: 'Cultural',
      shortDescription: 'A walkable old-town district shaped by Portuguese, Dutch and British trading history.',
      description:
        'Fort Kochi’s waterfront is lined with the iconic cantilevered Chinese fishing nets, believed to have been introduced by Chinese traders in the 14th century. The surrounding streets mix colonial-era warehouses, churches, and art galleries in a compact, walkable area.',
      historicalSignificance: 'One of the first European colonial settlements in India, changing hands between Portuguese, Dutch and British control.',
      bestTimeToVisit: 'November to February',
      entryFee: 'Free to walk around',
      openingTime: 'Open 24 hours (fishing nets best seen at sunset)',
      closingTime: '',
      location: { lat: 9.9658, lng: 76.2422 },
      images: [{ url: wikimedia('Fort_Kochi_Chinese_fishing_nets.jpg'), alt: 'Chinese fishing nets, Fort Kochi' }],
      travelTips: ['Rent a bicycle to cover the area — it’s flat and easy to cycle.'],
    },
    {
      name: 'Mattancherry Palace',
      category: 'Heritage',
      shortDescription: 'A Portuguese-built, Dutch-renovated palace known for its Kerala mural paintings.',
      description:
        "Originally built by the Portuguese in 1555 as a gift to the Raja of Kochi and later renovated by the Dutch, this palace houses an exceptional collection of Hindu mythological murals painted directly onto its walls, alongside royal portraits and artifacts.",
      historicalSignificance: 'Also known as the Dutch Palace, it remains one of the best-preserved examples of Kerala’s royal architecture.',
      bestTimeToVisit: 'November to February',
      entryFee: '₹5 (Indians), ₹300 (Foreign Nationals)',
      openingTime: '10:00 AM',
      closingTime: '5:00 PM',
      location: { lat: 9.9580, lng: 76.2599 },
      images: [{ url: wikimedia('Fort_Kochi_Chinese_fishing_nets.jpg'), alt: 'Historic Kochi waterfront near Mattancherry' }],
      travelTips: ['Photography isn’t permitted inside the mural rooms.'],
    },
  ],
  alleppey: [
    {
      name: 'Alleppey Backwaters',
      category: 'Nature',
      shortDescription: 'A network of canals, lagoons and lakes best explored by traditional houseboat.',
      description:
        'Alleppey is the starting point for Kerala’s most popular backwater cruises, where converted rice barges (houseboats) drift along palm-fringed canals past paddy fields and small villages. Day cruises and overnight stays are both common.',
      bestTimeToVisit: 'November to February (also scenic during monsoon, June–August)',
      entryFee: 'Houseboat charges vary, roughly ₹8,000–15,000/night',
      openingTime: 'Open 24 hours',
      closingTime: '',
      location: { lat: 9.4981, lng: 76.3388 },
      images: [{ url: wikimedia('Alleppey_Backwaters.jpg'), alt: 'Backwaters of Alleppey' }],
      travelTips: ['Book houseboats directly or through verified operators to avoid overpricing.'],
    },
    {
      name: 'Alappuzha Beach',
      category: 'Beach',
      shortDescription: 'A long, laid-back beach with an old pier stretching into the Arabian Sea.',
      description:
        'Alappuzha Beach is known for its century-old pier, originally built for a pier-based port that was never completed. The beach hosts a lighthouse, a small park, and is a popular spot for evening walks and sunset views.',
      bestTimeToVisit: 'November to February',
      entryFee: 'Free',
      openingTime: 'Open 24 hours',
      closingTime: '',
      location: { lat: 9.4900, lng: 76.3222 },
      images: [{ url: wikimedia('Alleppey_Backwaters.jpg'), alt: 'Coastal Alleppey near the beach' }],
      travelTips: ['The beach hosts a lighthouse you can climb for a small fee.'],
    },
  ],
  jaipur: [
    {
      name: 'Hawa Mahal',
      category: 'Heritage',
      shortDescription: 'A five-story pink sandstone facade with 953 small windows, built for royal women to observe street life.',
      description:
        "Built in 1799 by Maharaja Sawai Pratap Singh, Hawa Mahal's honeycomb facade let royal women watch street festivals unseen from outside, in keeping with purdah customs of the era. The structure is only one room deep behind its elaborate front.",
      historicalSignificance: 'Designed by Lal Chand Ustad in the form of Krishna’s crown, and a defining symbol of Jaipur’s "Pink City" architecture.',
      bestTimeToVisit: 'October to March',
      entryFee: '₹50 (Indians), ₹200 (Foreign Nationals)',
      openingTime: '9:00 AM',
      closingTime: '4:30 PM',
      location: { lat: 26.9239, lng: 75.8267 },
      images: [{ url: wikimedia('Hawa_Mahal.jpg'), alt: 'Hawa Mahal, Jaipur' }],
      travelTips: ['The best photos are from the tea shop across the street, not from inside.'],
    },
    {
      name: 'Amber Fort',
      category: 'Historical',
      shortDescription: 'A hilltop fort-palace of pale yellow and pink sandstone overlooking Maota Lake.',
      description:
        'Amber Fort was the seat of the Kachwaha Rajput rulers before the capital moved to Jaipur. Its Sheesh Mahal (Mirror Palace) is famous for walls and ceilings inlaid with thousands of small mirrors that catch even a single candle flame.',
      historicalSignificance: 'Construction began under Raja Man Singh I in 1592 and continued for over a century under subsequent rulers.',
      bestTimeToVisit: 'October to March',
      entryFee: '₹100 (Indians), ₹500 (Foreign Nationals)',
      openingTime: '8:00 AM',
      closingTime: '5:30 PM',
      location: { lat: 26.9855, lng: 75.8513 },
      images: [{ url: wikimedia('Hawa_Mahal.jpg'), alt: 'Rajput-era architecture near Amber Fort, Jaipur' }],
      travelTips: ['Arrive by 8 AM to beat both the heat and the tour-bus crowds.'],
    },
  ],
  udaipur: [
    {
      name: 'City Palace, Udaipur',
      category: 'Heritage',
      shortDescription: 'A sprawling palace complex on Lake Pichola, built over nearly 400 years by successive rulers.',
      description:
        'Begun in 1559 by Maharana Udai Singh II, Udaipur’s City Palace grew over generations into a complex of courtyards, pavilions, and museums, blending Rajasthani and Mughal architectural styles along the eastern shore of Lake Pichola.',
      historicalSignificance: 'The palace remained the seat of the Mewar dynasty, one of the longest-ruling Rajput dynasties in India.',
      bestTimeToVisit: 'October to March',
      entryFee: '₹300 (Indians), ₹700 (Foreign Nationals)',
      openingTime: '9:30 AM',
      closingTime: '5:30 PM',
      location: { lat: 24.5764, lng: 73.6835 },
      images: [{ url: wikimedia('City_Palace,_Udaipur.jpg'), alt: 'City Palace, Udaipur' }],
      travelTips: ['A composite ticket covers the palace museum, Crystal Gallery, and other sections.'],
    },
    {
      name: 'Lake Pichola',
      category: 'Nature',
      shortDescription: 'An artificial lake ringed by palaces and ghats, best seen by evening boat ride.',
      description:
        'Created in 1362, Lake Pichola is the centerpiece of Udaipur’s skyline, with the City Palace, Jag Mandir, and the Lake Palace (now a hotel) all visible from its waters. Sunset boat rides are the classic way to see them together.',
      bestTimeToVisit: 'September to March (lake levels can drop in peak summer)',
      entryFee: 'Boat rides from ₹400 per person',
      openingTime: '10:00 AM',
      closingTime: '6:00 PM',
      location: { lat: 24.5711, lng: 73.6783 },
      images: [{ url: wikimedia('City_Palace,_Udaipur.jpg'), alt: 'Lake Pichola waterfront, Udaipur' }],
      travelTips: ['Book the sunset boat slot in advance during peak season — it sells out.'],
    },
  ],
  jaisalmer: [
    {
      name: 'Jaisalmer Fort',
      category: 'Historical',
      shortDescription: 'A "living fort" of golden sandstone, still home to thousands of residents within its walls.',
      description:
        "Built in 1156 by Rawal Jaisal, this fort is one of the few in the world still inhabited, with roughly a quarter of Jaisalmer's old-city population living inside its walls today. Its honey-gold sandstone glows especially bright at sunset, giving Jaisalmer its nickname, the Golden City.",
      historicalSignificance: 'A UNESCO World Heritage Site as part of the Hill Forts of Rajasthan listing.',
      bestTimeToVisit: 'November to February',
      entryFee: 'Free to enter; museums inside charge separately',
      openingTime: '8:00 AM',
      closingTime: '6:00 PM',
      location: { lat: 26.9124, lng: 70.9127 },
      images: [{ url: wikimedia('Jaisalmer_Fort.jpg'), alt: 'Jaisalmer Fort' }],
      travelTips: ['Choose homestays outside the fort walls — tourism pressure has strained the fort’s ancient drainage system.'],
    },
    {
      name: 'Sam Sand Dunes',
      category: 'Adventure',
      shortDescription: 'Rolling Thar Desert dunes offering camel safaris and overnight desert camping.',
      description:
        'About 40km from Jaisalmer, the Sam dunes are the most accessible stretch of the Thar Desert, popular for camel and jeep safaris timed around sunset, followed by overnight stays in desert camps with folk music performances.',
      bestTimeToVisit: 'November to February (avoid peak summer heat)',
      entryFee: 'Entry ~₹50; safaris and camps priced separately',
      openingTime: 'Open 24 hours',
      closingTime: '',
      location: { lat: 26.9088, lng: 70.5029 },
      images: [{ url: wikimedia('Jaisalmer_Fort.jpg'), alt: 'Desert landscape near Jaisalmer' }],
      travelTips: ['Carry warm layers — desert nights get surprisingly cold, even in winter.'],
    },
  ],
  mysuru: [
    {
      name: 'Mysore Palace',
      category: 'Heritage',
      shortDescription: 'A grand Indo-Saracenic palace, lit by nearly 100,000 bulbs on Sundays and festival evenings.',
      description:
        'The current Mysore Palace was built in 1912 after a fire destroyed the earlier wooden structure, designed by British architect Henry Irwin in an Indo-Saracenic style blending Hindu, Islamic, Rajput and Gothic elements. It remains the official residence of the Wadiyar royal family.',
      historicalSignificance: 'Seat of the Wadiyar dynasty, which ruled the Kingdom of Mysore for over five centuries.',
      bestTimeToVisit: 'October to February, especially during Mysuru Dasara',
      entryFee: '₹70 (Indians), ₹200 (Foreign Nationals)',
      openingTime: '10:00 AM',
      closingTime: '5:30 PM',
      location: { lat: 12.3052, lng: 76.6552 },
      images: [{ url: wikimedia('Mysore_Palace.jpg'), alt: 'Mysore Palace' }],
      travelTips: ['Visit on a Sunday evening to see the palace fully illuminated.'],
    },
    {
      name: 'Chamundi Hill Temple',
      category: 'Religious',
      shortDescription: 'A hilltop temple dedicated to Goddess Chamundeshwari, reached by road or a thousand stone steps.',
      description:
        'Perched atop Chamundi Hill overlooking Mysuru, this temple is dedicated to Chamundeshwari, the tutelary deity of the Mysore royal family. Pilgrims can drive up or climb roughly 1,000 stone steps, passing a large Nandi bull statue partway up.',
      bestTimeToVisit: 'October to March',
      entryFee: 'Free (special darshan tickets available)',
      openingTime: '7:30 AM',
      closingTime: '2:00 PM',
      location: { lat: 12.2724, lng: 76.6730 },
      images: [{ url: wikimedia('Mysore_Palace.jpg'), alt: 'View from Chamundi Hill, Mysuru' }],
      travelTips: ['The hilltop offers wide views over Mysuru city — worth the trip even outside temple hours.'],
    },
  ],
  hampi: [
    {
      name: 'Virupaksha Temple',
      category: 'Religious',
      shortDescription: 'An active temple with a towering gopuram, at the heart of the Hampi ruins.',
      description:
        "Still an active place of worship today, Virupaksha Temple's nine-tiered gopuram rises nearly 50 metres over the Hampi bazaar. The temple predates the Vijayanagara Empire itself, though most of the current structure was expanded during that period.",
      historicalSignificance: 'One of the oldest continuously functioning temples in India, part of the UNESCO-listed Group of Monuments at Hampi.',
      bestTimeToVisit: 'October to February',
      entryFee: '₹20 entry (camera fee separate)',
      openingTime: '6:00 AM',
      closingTime: '9:00 PM',
      location: { lat: 15.335, lng: 76.46 },
      images: [{ url: wikimedia('Virupaksha_Temple,_Hampi.jpg'), alt: 'Virupaksha Temple, Hampi' }],
      travelTips: ['Climb Hemakuta Hill just behind the temple for a wide sunset view over the ruins.'],
    },
    {
      name: 'Vittala Temple',
      category: 'Historical',
      shortDescription: 'Home to the iconic stone chariot and musical pillars of the Vijayanagara Empire.',
      description:
        "The Vittala Temple complex houses Hampi's most photographed monument — a stone chariot dedicated to Garuda — alongside a hall of 56 musical pillars that were said to produce different notes when struck, a hallmark of Vijayanagara-era craftsmanship.",
      historicalSignificance: 'Considered the finest example of Vijayanagara architecture, built primarily during the reign of King Krishnadevaraya in the 16th century.',
      bestTimeToVisit: 'October to February',
      entryFee: '₹40 (Indians), ₹600 (Foreign Nationals)',
      openingTime: '8:30 AM',
      closingTime: '5:30 PM',
      location: { lat: 15.3411, lng: 76.4747 },
      images: [{ url: wikimedia('Virupaksha_Temple,_Hampi.jpg'), alt: 'Vijayanagara-era ruins, Hampi' }],
      travelTips: ['The musical pillars can no longer be struck to protect them from damage — a guide can explain how they once worked.'],
    },
  ],
  coorg: [
    {
      name: 'Abbey Falls',
      category: 'Nature',
      shortDescription: 'A waterfall dropping through coffee and spice plantations just outside Madikeri.',
      description:
        'Abbey Falls cascades roughly 21 metres over rocks surrounded by private coffee estates, reached via a short, steep walk down from the parking area. A hanging bridge offers a closer view of the falls, especially dramatic just after monsoon season.',
      bestTimeToVisit: 'October to March (fullest flow just after monsoon)',
      entryFee: '₹20 per person',
      openingTime: '9:00 AM',
      closingTime: '5:30 PM',
      location: { lat: 12.4244, lng: 75.7382 },
      images: [{ url: wikimedia('Virupaksha_Temple,_Hampi.jpg'), alt: 'Coorg countryside (placeholder image)' }],
      travelTips: ['The steps down can get slippery — sturdy footwear recommended.'],
    },
    {
      name: "Raja's Seat",
      category: 'Cultural',
      shortDescription: 'A hilltop garden and viewpoint once used by Kodagu’s royal family to watch the sunset.',
      description:
        "Raja's Seat is a small landscaped garden on a ridge above Madikeri, said to have been a favorite sunset spot for the kings of Kodagu. Today it's a public park with a musical fountain and wide views over the surrounding valleys and coffee estates.",
      bestTimeToVisit: 'October to March',
      entryFee: '₹10 per person',
      openingTime: '6:00 AM',
      closingTime: '8:00 PM',
      location: { lat: 12.4181, lng: 75.7396 },
      images: [{ url: wikimedia('Virupaksha_Temple,_Hampi.jpg'), alt: 'Coorg hills near Madikeri (placeholder image)' }],
      travelTips: ['Come just before sunset — it’s the busiest but most rewarding time.'],
    },
  ],
}

const mapUrl = ({ lat, lng }) => `https://www.google.com/maps?q=${lat},${lng}`

const run = async () => {
  await connectDB()

  console.log('Clearing existing destinations...')
  await Destination.deleteMany({})

  const categories = await Category.find()
  const categoryIdByName = new Map(categories.map((c) => [c.name, c._id]))

  const cities = await City.find().populate('state')
  const cityBySlug = new Map(cities.map((c) => [c.slug, c]))

  const createdByCity = new Map()

  for (const [citySlug, destinations] of Object.entries(destinationsData)) {
    const city = cityBySlug.get(citySlug)
    if (!city) {
      console.warn(`Skipping "${citySlug}" — city not found. Run seed:states-cities first.`)
      continue
    }

    const created = []
    for (const dest of destinations) {
      const categoryId = categoryIdByName.get(dest.category)
      if (!categoryId) {
        console.warn(`Skipping "${dest.name}" — category "${dest.category}" not found. Run seed:categories first.`)
        continue
      }

      const destination = await Destination.create({
        name: dest.name,
        state: city.state._id,
        city: city._id,
        category: categoryId,
        shortDescription: dest.shortDescription,
        description: dest.description,
        historicalSignificance: dest.historicalSignificance,
        bestTimeToVisit: dest.bestTimeToVisit,
        entryFee: dest.entryFee,
        openingTime: dest.openingTime,
        closingTime: dest.closingTime,
        location: dest.location,
        mapUrl: mapUrl(dest.location),
        images: dest.images,
        travelTips: dest.travelTips,
      })

      console.log(`Created destination: ${destination.name} (${destination.slug})`)
      created.push(destination)
    }
    createdByCity.set(citySlug, created)
  }

  // Second pass: link destinations in the same city as each other's nearby attractions.
  console.log('\nLinking nearby attractions...')
  for (const destinations of createdByCity.values()) {
    for (const destination of destinations) {
      destination.nearbyAttractions = destinations.filter((d) => !d._id.equals(destination._id)).map((d) => d._id)
      await destination.save()
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
