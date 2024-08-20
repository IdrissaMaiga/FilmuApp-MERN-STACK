import express from 'express'
import {
  createWatching,
  getWatching,
  updateWatching,
  deleteWatching
} from '../controllers/watching.controller.js'
import authenticateToken from '../middleware/verifyToken.js'
import { handleValidationErrors } from '../middleware/validation.js'

const watchingRoute = express.Router()

// Route to create a new watching record
watchingRoute.post('/watching', authenticateToken, createWatching)

// Route to get the watching records of the logged-in user
watchingRoute.get('/watching', authenticateToken, getWatching)

// Route to update the watching record of the logged-in user
watchingRoute.put(
  '/watching/:id',
  authenticateToken,
  handleValidationErrors,
  updateWatching
)

// Route to delete the watching record of the logged-in user
watchingRoute.delete('/watching/:id', authenticateToken, deleteWatching)

export default watchingRoute
