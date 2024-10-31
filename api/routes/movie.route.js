import express from 'express'
import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie
} from '../controllers/movie.controller.js'
import authenticateToken from '../middleware/verifyToken.js'
import { isAdmin } from '../middleware/verifyAdmin.js'

const movieRoute = express.Router()

// Route to create a new movie (POST /api)
movieRoute.post('', authenticateToken, isAdmin, createMovie)

// Route to get all movies (GET /api/movies)
movieRoute.get('s', authenticateToken, getMovies)

// Route to get a specific movie by ID (GET /api/:id)
movieRoute.get('/:id', authenticateToken, getMovieById)

// Route to update a specific movie by ID (PUT /api/:id)
movieRoute.put(
  '/:id',
  authenticateToken,
  isAdmin,
  updateMovie
)

// Route to delete a specific movie by ID (DELETE /api/:id)
movieRoute.delete('/:id', authenticateToken, isAdmin, deleteMovie)

export default movieRoute
