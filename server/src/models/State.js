import mongoose from 'mongoose'
import { generateUniqueSlug } from '../utils/slugify.js'

const stateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    capital: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: {
      url: { type: String, required: true },
      alt: { type: String, required: true },
    },
  },
  { timestamps: true }
)

// Async pre-save hooks in Mongoose resolve on their own promise — don't
// declare a `next` param, it confuses Mongoose's callback-vs-async detection.
stateSchema.pre('save', async function () {
  if (this.isModified('name')) {
    this.slug = await generateUniqueSlug(this.constructor, this.name, { excludeId: this._id })
  }
})

export const State = mongoose.model('State', stateSchema)
