import mongoose from 'mongoose'
import { generateUniqueSlug } from '../utils/slugify.js'

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

    shortDescription: { type: String, required: true, maxlength: 220 },
    description: { type: String, required: true },
    historicalSignificance: { type: String },

    bestTimeToVisit: { type: String }, // e.g. "October to March"
    entryFee: { type: String, default: 'Free' }, // free text — fees vary too much for a rigid number field
    openingTime: { type: String }, // e.g. "6:00 AM" or "Open 24 hours"
    closingTime: { type: String },

    location: {
      lat: Number,
      lng: Number,
    },
    mapUrl: { type: String },

    images: {
      type: [
        {
          url: { type: String, required: true },
          alt: { type: String, required: true },
        },
      ],
      validate: {
        validator: (images) => images.length > 0,
        message: 'At least one image is required',
      },
    },

    nearbyAttractions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }],
    travelTips: [{ type: String }],

    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

destinationSchema.pre('save', async function () {
  if (this.isModified('name')) {
    this.slug = await generateUniqueSlug(this.constructor, this.name, { excludeId: this._id })
  }
})

// Powers the /api/destinations/search endpoint.
destinationSchema.index({ name: 'text', shortDescription: 'text', description: 'text' })

// Common filter combinations on the Explore/State/Category pages.
destinationSchema.index({ state: 1, category: 1 })
destinationSchema.index({ city: 1 })
destinationSchema.index({ featured: 1 })

export const Destination = mongoose.model('Destination', destinationSchema)
