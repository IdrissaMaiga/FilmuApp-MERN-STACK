import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prismaclient from '../lib/prisma.js'
import dotenv from 'dotenv'
import { body, validationResult } from 'express-validator'

dotenv.config()
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

// Middleware for validation
export const validateRegister = [
  body('name').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password')
    .matches(passwordRegex)
    .withMessage(
      'Password must be at least 8 characters long and contain at least one letter and one number'
    ),
  body('role').isIn(['ADMIN', 'EDITOR', 'USER']).withMessage('Invalid role')
]

// Register Route
export const register = async (req, res) => {
  const isAdmin = req.IsAdmin
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, email, password } = req.body

  try {
    // Check if the user already exists by email or username
    const existingUser = await prismaclient.user.findFirst({
      where: {
        OR: [{ email }, { name }]
      }
    })

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email or username already exists' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user and save to DB
    const newUser = await prismaclient.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        totalpaid: isAdmin,
        isactive: isAdmin,
        isbanned: isAdmin,
        creationdate: true,
        role: isAdmin,
        lastlogin: isAdmin,
        profilePicture: true
      }
    })

    res
      .status(201)
      .json({ message: 'User created successfully', user: newUser })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to create user!' })
  }
}

// Login Route
export const login = async (req, res) => {
  const { email, password } = req.body
  const isAdmin = req.IsAdmin
  try {
    // Check if the user exists
    const user = await prismaclient.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        totalpaid: isAdmin,
        isactive: true,
        isbanned: true,
        creationdate: true,
        lastlogin: isAdmin,
        profilePicture: true,
        password: true,
        role: true
      }
    })

    if (!user) return res.status(400).json({ message: 'Invalid credentials!' })
    if (user.isbanned)
      return res.status(403).json({ message: 'the user is banned' })

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid)
      return res.status(400).json({ message: 'Invalid credentials!' })

    // Check if the user is banned
    if (user.isbanned) {
      return res
        .status(400)
        .json({ message: 'This user is banned. Contact the admin.' })
    }

    // Generate JWT token
    const age = 1000 * 60 * 60 * 24 * 7 // 1 week

    const secretKey = process.env.JWT_SECRET_KEY || 'fallbackSecretKey'
    const token = jwt.sign(
      {
        user: user,
        IsAdmin: user.role === 'ADMIN',
        IsActive: user.isActive == true
      },
      secretKey,
      { expiresIn: age }
    )

    const { password: userPassword, ...userInfo } = user

    res
      .cookie('token', token, {
        httpOnly: true,
        //secure: process.env.NODE_ENV === 'production',
        maxAge: age
      })
      .status(200)
      .json(userInfo)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to login!' })
  }
}

// Logout Route
export const logout = (req, res) => {
  res.clearCookie('token').status(200).json({ message: 'Logout successful' })
}
