import { body } from 'express-validator'
import mongoose from 'mongoose'

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value)

export const createDestinationValidation = [
  body('name').trim().notEmpty().withMessage('Destination name is required'),
  body('state').custom(isObjectId).withMessage('A valid state is required'),
  body('city').custom(isObjectId).withMessage('A valid city is required'),
  body('category').custom(isObjectId).withMessage('A valid category is required'),
  body('shortDescription')
    .trim()
    .notEmpty()
    .withMessage('Short description is required')
    .isLength({ max: 220 })
    .withMessage('Short description must be under 220 characters'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('images.*.url').trim().notEmpty().withMessage('Each image needs a URL').isURL().withMessage('Image URL must be valid'),
  body('images.*.alt').trim().notEmpty().withMessage('Each image needs alt text'),
]

export const updateDestinationValidation = [
  body('name').optional().trim().notEmpty().withMessage('Destination name cannot be empty'),
  body('shortDescription').optional().trim().isLength({ max: 220 }).withMessage('Short description must be under 220 characters'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('images').optional().isArray({ min: 1 }).withMessage('At least one image is required'),
]
