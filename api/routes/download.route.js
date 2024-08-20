import express from 'express'
import {
  createDownload,
  getDownloads,
  updateDownload,
  deleteDownload
} from '../controllers/download.controller.js'
import authenticateToken from '../middleware/verifyToken.js'

const downloadRoute = express.Router()

// Route to create a new download
downloadRoute.post('/download', authenticateToken, createDownload)

// Route to get all downloads of the logged-in user
downloadRoute.get('/downloads', authenticateToken, getDownloads)

// Route to update a specific download by ID
downloadRoute.put('/download/:id', authenticateToken, updateDownload)

// Route to delete a specific download by ID
downloadRoute.delete('/download/:id', authenticateToken, deleteDownload)

export default downloadRoute
