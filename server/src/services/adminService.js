import { State } from '../models/State.js'
import { City } from '../models/City.js'
import { Destination } from '../models/Destination.js'
import { Category } from '../models/Category.js'

export const getDashboardStats = async () => {
  const [totalStates, totalCities, totalDestinations, totalCategories, recentDestinations] = await Promise.all([
    State.countDocuments(),
    City.countDocuments(),
    Destination.countDocuments(),
    Category.countDocuments(),
    Destination.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('state', 'name')
      .populate('city', 'name')
      .populate('category', 'name'),
  ])

  return { totalStates, totalCities, totalDestinations, totalCategories, recentDestinations }
}
