import { Category } from '../models/Category.js'

// Read-only for now — categories are seeded directly. Admin create/edit/
// delete for categories arrives with the Admin CRUD phase.
export const getAllCategories = () => Category.find().sort({ name: 1 })
