import * as authService from '../services/authService.js'
import { sendSuccess } from '../utils/apiResponse.js'

export const register = async (req, res) => {
  const { user, token } = await authService.registerUser(req.body)
  sendSuccess(res, 201, 'Account created successfully', { user, token })
}

export const login = async (req, res) => {
  const { user, token } = await authService.loginUser(req.body)
  sendSuccess(res, 200, 'Logged in successfully', { user, token })
}

export const getMe = async (req, res) => {
  const { _id: id, name, email, role, createdAt } = req.user
  sendSuccess(res, 200, 'Current user fetched', { user: { id, name, email, role, createdAt } })
}
