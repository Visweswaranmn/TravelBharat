import { body } from 'express-validator'
import mongoose from 'mongoose'

export const createCityValidation = [
  body('name').trim().notEmpty().withMessage('City name is required'),
  body('state')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('A valid state is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('image.url').trim().notEmpty().withMessage('Image URL is required').isURL().withMessage('Image URL must be a valid URL'),
  body('image.alt').trim().notEmpty().withMessage('Image alt text is required'),
]

export const updateCityValidation = [
  body('name').optional().trim().notEmpty().withMessage('City name cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('image.url').optional().trim().isURL().withMessage('Image URL must be a valid URL'),
]
