import mongoose from 'mongoose'
import { generateUniqueSlug } from '../utils/slugify.js'

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String },
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
    description: { type: String, required: true },
    image: {
      url: { type: String, required: true },
      alt: { type: String, required: true },
    },
  },
  { timestamps: true }
)

// A city's slug only needs to be unique within its own state — "Ooty" in
// Tamil Nadu and a same-named town in another state shouldn't collide.
citySchema.index({ state: 1, slug: 1 }, { unique: true })
citySchema.index({ state: 1 })

citySchema.pre('save', async function () {
  if (this.isModified('name') || this.isModified('state')) {
    this.slug = await generateUniqueSlug(this.constructor, this.name, {
      filter: { state: this.state },
      excludeId: this._id,
    })
  }
})

export const City = mongoose.model('City', citySchema)
