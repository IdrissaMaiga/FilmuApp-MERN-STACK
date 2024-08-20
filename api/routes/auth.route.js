import express from 'express'
import { login, logout, register } from '../controllers/auth.controller.js'

const router = express.Router()
//end of demo lines
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

export default router
