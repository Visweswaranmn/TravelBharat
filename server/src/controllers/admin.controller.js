import * as adminService from '../services/adminService.js'
import { sendSuccess } from '../utils/apiResponse.js'

export const getStats = async (req, res) => {
  const stats = await adminService.getDashboardStats()
  sendSuccess(res, 200, 'Dashboard stats fetched successfully', stats)
}
