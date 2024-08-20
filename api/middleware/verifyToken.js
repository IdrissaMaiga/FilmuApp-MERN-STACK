import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token

  if (!token) return res.sendStatus(401) // Unauthorized

  try {
    const secretKey = process.env.JWT_SECRET_KEY || 'fallbackSecretKey'
    const user = jwt.verify(token, secretKey).user
    req.user = user
    req.IsAdmin = user.role === 'ADMIN'

    req.IsActive = user.isActive == true
    next()
  } catch (err) {
    console.log(err)
    return res.sendStatus(403) // Forbidden
  }
}

export default authenticateToken
