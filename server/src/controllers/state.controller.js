import * as stateService from '../services/stateService.js'
import { sendSuccess } from '../utils/apiResponse.js'

export const getStates = async (req, res) => {
  const { search, page, limit } = req.query
  const result = await stateService.getAllStates({ search, page, limit })
  sendSuccess(res, 200, 'States fetched successfully', result)
}

export const getState = async (req, res) => {
  const result = await stateService.getStateBySlug(req.params.slug)
  sendSuccess(res, 200, 'State fetched successfully', result)
}

export const createState = async (req, res) => {
  const state = await stateService.createState(req.body)
  sendSuccess(res, 201, 'State created successfully', { state })
}

export const updateState = async (req, res) => {
  const state = await stateService.updateState(req.params.id, req.body)
  sendSuccess(res, 200, 'State updated successfully', { state })
}

export const deleteState = async (req, res) => {
  await stateService.deleteState(req.params.id)
  sendSuccess(res, 200, 'State deleted successfully', null)
}
