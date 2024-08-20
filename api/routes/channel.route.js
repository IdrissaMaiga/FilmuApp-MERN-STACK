import express from 'express'
import {
  createChannel,
  getChannels,
  getChannelById,
  updateChannel,
  deleteChannel,
  createChannels
} from '../controllers/channel.controller.js'
import { isAdmin } from '../middleware/verifyAdmin.js'
import authenticateToken from '../middleware/verifyToken.js'

const channelRoute = express.Router()
channelRoute.use(authenticateToken)

channelRoute.post('/channels', isAdmin, createChannel)
channelRoute.post('/channels/bulk', isAdmin, createChannels)
channelRoute.get('/channels', getChannels)
channelRoute.get('/channels/:id', getChannelById)
channelRoute.put('/channels/:id', isAdmin, updateChannel)
channelRoute.delete('/channels/:id', isAdmin, deleteChannel)

export default channelRoute
