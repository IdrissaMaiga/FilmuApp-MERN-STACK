import express from 'express'
import {
  createPort,
  createPorts,
  getPorts,
  getPortById,
  updatePort,
  deletePort
} from '../controllers/port.controller.js'
import { isAdmin } from '../middleware/verifyAdmin.js'
import authenticateToken from '../middleware/verifyToken.js'

const portRoute = express.Router()
portRoute.use(authenticateToken)

portRoute.post('/ports', isAdmin, createPort)
portRoute.post('/ports/bulk', isAdmin, createPorts)
portRoute.get('/ports', getPorts)
portRoute.get('/ports/:id', getPortById)
portRoute.put('/ports/:id', isAdmin, updatePort)
portRoute.delete('/ports/:id', isAdmin, deletePort)

export default portRoute
