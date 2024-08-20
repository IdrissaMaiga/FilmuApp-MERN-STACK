import express from 'express'
import {
  updateProfileField,
  getProfile,
  getUserAll,
  deleteUser,
  banUser
} from '../controllers/userprofile.controller.js'
import authenticateToken from '../middleware/verifyToken.js'
import { isAdmin } from '../middleware/verifyAdmin.js'

const profileRoute = express.Router()

// Route to get user profile
profileRoute.get('/profile', authenticateToken, getProfile)

// Route to update user profile field
profileRoute.put('/profile/updateField', authenticateToken, updateProfileField)

// Route to get all users (admin only)
profileRoute.get('/users', authenticateToken, isAdmin, getUserAll)

// Route to delete a user (admin only)
profileRoute.delete('/user', authenticateToken, isAdmin, deleteUser)

// Route to ban a user (admin only)
profileRoute.patch('/user/ban', authenticateToken, isAdmin, banUser)

export default profileRoute
