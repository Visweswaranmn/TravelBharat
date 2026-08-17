import mongoose from 'mongoose'
import { generateUniqueSlug } from '../utils/slugify.js'

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, trim: true },
    image: {
      url: { type: String },
      alt: { type: String },
    },
  },
  { timestamps: true }
)

categorySchema.pre('save', async function () {
  if (this.isModified('name')) {
    this.slug = await generateUniqueSlug(this.constructor, this.name, { excludeId: this._id })
  }
})

export const Category = mongoose.model('Category', categorySchema)
