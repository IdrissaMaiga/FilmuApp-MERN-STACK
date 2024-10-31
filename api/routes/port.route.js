import express from 'express'
import {
  createPort,
  createPorts,
  getPorts,
  getPortById,
  updatePort,
  deletePort,
  getPortByIddecrypted
} from '../controllers/port.controller.js'
import { isAdmin } from '../middleware/verifyAdmin.js'
import authenticateToken from '../middleware/verifyToken.js'

const portRoute = express.Router()
portRoute.use(authenticateToken)

portRoute.post('', isAdmin, createPort)
portRoute.post('/bulk', isAdmin, createPorts)
portRoute.get('', getPorts)
portRoute.get('/portsdecrypt/:id', getPortByIddecrypted)
portRoute.put('/:id', isAdmin, updatePort)
portRoute.delete('/:id', isAdmin, deletePort)

export default portRoute
