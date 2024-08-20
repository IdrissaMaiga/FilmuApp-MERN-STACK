import express from 'express'
import {
  createEpisode,
  getEpisodes,
  getEpisodeById,
  updateEpisode,
  deleteEpisode
} from '../controllers/episode.controller.js'
import authenticateToken from '../middleware/verifyToken.js'
import { isAdmin } from '../middleware/verifyAdmin.js'

const EpisodeRouter = express.Router()
EpisodeRouter.use(authenticateToken)

// POST /episodes - Create a new episode (admin only)
EpisodeRouter.post('/episode', isAdmin, createEpisode)

// GET /episodes - Get all episodes (admin gets all, normal users get limited details)
EpisodeRouter.get('/episodeall', getEpisodes)

// GET /episodes/:id - Get an episode by ID (admin gets all details, normal users get limited details)
EpisodeRouter.get('/episode/:id', getEpisodeById)

// PUT /episodes/:id - Update an episode by ID (admin only)
EpisodeRouter.put('/episode/:id', isAdmin, updateEpisode)

// DELETE /episodes/:id - Delete an episode by ID (admin only)
EpisodeRouter.delete('/episode/:id', isAdmin, deleteEpisode)

export default EpisodeRouter
