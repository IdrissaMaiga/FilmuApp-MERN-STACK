import express from 'express'
import {
  createSeries,
  getSeries,
  getSeriesById,
  updateSeries,
  getSeriesofmylist
} from '../controllers/series.controller.js'
import { isAdmin } from '../middleware/verifyAdmin.js'
import authenticateToken from '../middleware/verifyToken.js'
const SerieRouter = express.Router()
SerieRouter.use(authenticateToken)

// POST /series - Create a new series (admin only)
SerieRouter.post('/', isAdmin, createSeries)

// GET /series - Get all series (admin gets all, normal users get series based on their taste)
SerieRouter.get('/', getSeries)
//GET  series 
SerieRouter.get("/mylistseries/",getSeriesofmylist)

// GET /series/:id - Get a series by ID (admin gets all details, normal users get limited details)
SerieRouter.get('/:id', getSeriesById)

// PUT /series/:id - Update a series by ID (admin only)
SerieRouter.put('/:id', isAdmin, updateSeries)

export default SerieRouter
