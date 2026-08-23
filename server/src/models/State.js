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

// Don't add a `next` param here even though it's tempting — Mongoose sees
// it and switches to callback mode, which breaks the async version below.
stateSchema.pre('save', async function () {
  if (this.isModified('name')) {
    this.slug = await generateUniqueSlug(this.constructor, this.name, { excludeId: this._id })
  }
})

export const State = mongoose.model('State', stateSchema)
