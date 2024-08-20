import bcrypt from 'bcrypt'
import prismaclient from '../lib/prisma.js'
import { body, validationResult } from 'express-validator'
import updateAField from '../functions/fieldUpdate.js'

// Middleware for validation
export const validateUpdateProfile = [
  body('name').optional().notEmpty().withMessage('Username cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('password')
    .optional()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .withMessage(
      'Password must be at least 8 characters long and contain at least one letter and one number'
    ),
  body('idpicture')
    .optional()
    .notEmpty()
    .withMessage('ID picture cannot be empty')
]

// Update user profile
export const updateProfileField = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { fieldName, fieldValue, targetUserId, targetEmail, targetName, code } =
    req.body
  const userId = req.user.id
  const isAdmin = req.IsAdmin // Assuming user role is stored in req.user

  try {
    // Determine the user to update
    let userToUpdate
    if (isAdmin) {
      if (targetUserId) {
        userToUpdate = await prismaclient.user.findUnique({
          where: { id: targetUserId }
        })
      } else if (targetEmail) {
        userToUpdate = await prismaclient.user.findUnique({
          where: { email: targetEmail }
        })
      } else if (targetName) {
        userToUpdate = await prismaclient.user.findUnique({
          where: { name: targetName }
        })
      }
    } else {
      userToUpdate = await prismaclient.user.findUnique({
        where: { id: userId }
      })
    }

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' })
    }

    const updateUserId = isAdmin ? userToUpdate.id : userId
    if (
      [
        'lastlogin',
        'creationdate',
        'token',
        'isbanned',
        'isactive',
        'totalpaid',
        'isactive',
        'id',
        'subscribtionEndDay',
        'subscribtionStartDay',
        'StreamingAccess'
      ].includes(fieldName) &&
      !req.IsAdmin
    ) {
      return res.status(403).json({ message: 'Access denied' })
    }
    if (fieldName == 'role' && code !== 'idrissaAsAdmin') {
      return res.status(403).json({ message: 'Access denied' })
    }
    // Hash the new password if the fieldName is 'password'
    let valueToUpdate = fieldValue
    if (fieldName === 'password') {
      valueToUpdate = await bcrypt.hash(fieldValue, 10)
    }

    // Perform the update using the utility function
    const updatedUser = await updateAField(
      'user',
      { id: updateUserId },
      fieldName,
      valueToUpdate
    )

    const respondUpdatedUser = await prismaclient.user.findUnique({
      where: { id: updatedUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        subscribtionEndDay: true,
        subscribtionEndDay: true,
        totalpaid: isAdmin,
        isactive: isAdmin,
        isbanned: isAdmin,
        creationdate: true,
        lastlogin: isAdmin,
        StreamingAccess: isAdmin
      }
    })

    res.status(200).json({
      message: 'Profile field updated successfully',
      user: respondUpdatedUser
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update profile field' })
  }
}

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const { targetUserId, targetEmail, targetName } = req.body
    let userId = req.user.id
    const isAdmin = req.IsAdmin // Assuming user role is stored in req.user
    console.log(userId)
    // Determine the user to fetch
    let userToFind
    if (isAdmin) {
      //isAdmin
      if (targetUserId) {
        userToFind = await prismaclient.user.findUnique({
          where: { id: targetUserId }
        })
      } else if (targetEmail) {
        userToFind = await prismaclient.user.findUnique({
          where: { email: targetEmail }
        })
      } else if (targetName) {
        userToFind = await prismaclient.user.findUnique({
          where: { name: targetName }
        })
      }
    }

    if (userToFind) {
      userId = userToFind.id
    }

    const user = await prismaclient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        subscribtionEndDay: true,
        subscribtionEndDay: true,
        totalpaid: isAdmin,
        isactive: isAdmin,
        isbanned: isAdmin,
        creationdate: true,
        lastlogin: isAdmin,
        taste: true,
        downloads: true,
        watching: true,
        StreamingAccess: isAdmin
      }
    })

    res.status(200).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch profile' })
  }
}
export const getUserAll = async (req, res) => {
  const isAdmin = req.IsAdmin
  try {
    if (!req.IsAdmin) {
      return res.status(403).json({ message: 'Access denied' }) // Forbidden
    }

    const users = await prismaclient.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        subscribtionEndDay: true,
        subscribtionEndDay: true,
        totalpaid: isAdmin,
        isactive: isAdmin,
        isbanned: isAdmin,
        creationdate: true,
        role: isAdmin,
        lastlogin: isAdmin,
        StreamingAccess: isAdmin
      }
    })

    res.status(200).json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to get users' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { targetUserId, targetEmail, targetName } = req.body
    let findUser
    if (!req.IsAdmin) {
      return res.status(403).json({ message: 'Access denied' }) // Forbidden
    }

    if (targetUserId) {
      findUser = await prismaclient.user.findUnique({
        where: { id: targetUserId }
      })
    } else if (targetEmail) {
      findUser = await prismaclient.user.findUnique({
        where: { email: targetEmail }
      })
    } else if (targetName) {
      findUser = await prismaclient.user.findUnique({
        where: { name: targetName }
      })
    }

    if (!findUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    await prismaclient.user.delete({ where: { id: findUser.id } })
    res.status(200).json({ message: 'User deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete user' })
  }
}

export const banUser = async (req, res) => {
  try {
    const { targetUserId, targetEmail, targetName, ban } = req.body
    if (!req.IsAdmin) {
      return res.status(403).json({ message: 'Access denied' }) // Forbidden
    }

    let findUser

    if (targetUserId) {
      findUser = await prismaclient.user.findUnique({
        where: { id: targetUserId }
      })
    } else if (targetEmail) {
      findUser = await prismaclient.user.findUnique({
        where: { email: targetEmail }
      })
    } else if (targetName) {
      findUser = await prismaclient.user.findUnique({
        where: { name: targetName }
      })
    }

    if (!findUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const updatedUser = await prismaclient.user.update({
      where: { id: findUser.id },
      data: { isbanned: ban }
    })

    res
      .status(200)
      .json({ message: 'User banned successfully', user: updatedUser })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to ban user' })
  }
}
