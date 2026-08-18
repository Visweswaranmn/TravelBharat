import { body } from 'express-validator'

export const createStateValidation = [
  body('name').trim().notEmpty().withMessage('State name is required'),
  body('code')
    .trim()
    .notEmpty()
    .withMessage('State code is required')
    .isLength({ max: 4 })
    .withMessage('State code should be short, e.g. TN, KA'),
  body('capital').trim().notEmpty().withMessage('Capital is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('image.url').trim().notEmpty().withMessage('Image URL is required').isURL().withMessage('Image URL must be a valid URL'),
  body('image.alt').trim().notEmpty().withMessage('Image alt text is required'),
]

export const updateStateValidation = [
  body('name').optional().trim().notEmpty().withMessage('State name cannot be empty'),
  body('code').optional().trim().notEmpty().withMessage('State code cannot be empty'),
  body('capital').optional().trim().notEmpty().withMessage('Capital cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('image.url').optional().trim().isURL().withMessage('Image URL must be a valid URL'),
]
