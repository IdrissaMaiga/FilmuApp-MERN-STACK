import express from 'express'
import {
  createTaste,
  getTaste,
  updateTaste,
  deleteTaste,
  getAllTastes,
  addordeleteTaste
} from '../controllers/taste.controller.js' // Assuming these controller functions are defined

import authenticateToken from '../middleware/verifyToken.js'
import { handleValidationErrors } from '../middleware/validation.js'

const tasteRoute = express.Router()

// Route to create a new taste
tasteRoute.post('/taste', authenticateToken, createTaste)

// Route to get the taste of the logged-in user
tasteRoute.get('/taste/:userId', authenticateToken, getTaste)

// Route to update the taste of a user by ID
tasteRoute.put(
  '/taste/:userId',
  authenticateToken,
  handleValidationErrors,
  updateTaste
)

// Route to delete the taste of the logged-in user
tasteRoute.delete('/taste/:userId', authenticateToken, deleteTaste)
// Route to  add or serie to the taste of the logged-in user
tasteRoute.patch('/tasteaddOrdelete', authenticateToken, addordeleteTaste)
// Route to get all tastes (for admin use)
tasteRoute.get('/tasteall', authenticateToken, getAllTastes)


export default tasteRoute
