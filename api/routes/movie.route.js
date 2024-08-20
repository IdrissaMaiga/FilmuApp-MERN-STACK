import express from 'express'
import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie
} from '../controllers/movie.controller.js'
import authenticateToken from '../middleware/verifyToken.js'
import { handleValidationErrors } from '../middleware/validation.js'
import { isAdmin } from '../middleware/verifyAdmin.js'

const movieRoute = express.Router()

// Route to create a new movie (POST /api/movie)
movieRoute.post('/movie', authenticateToken, isAdmin, createMovie)

// Route to get all movies (GET /api/movies)
movieRoute.get('/movies', authenticateToken, getMovies)

// Route to get a specific movie by ID (GET /api/movie/:id)
movieRoute.get('/movie/:id', authenticateToken, getMovieById)

// Route to update a specific movie by ID (PUT /api/movie/:id)
movieRoute.put(
  '/movie/:id',
  authenticateToken,
  isAdmin,
  handleValidationErrors,
  updateMovie
)

// Route to delete a specific movie by ID (DELETE /api/movie/:id)
movieRoute.delete('/movie/:id', authenticateToken, isAdmin, deleteMovie)

export default movieRoute
