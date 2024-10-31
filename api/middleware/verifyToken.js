import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prismaclient from '../lib/prisma.js'; // Ensure to add the .js extension if needed


dotenv.config();

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.accessToken; // Retrieve token from cookies

  if (!token) {
   // console.log("No token found");
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const { id } = jwt.verify(token, secretKey).user;
     let user;
     if (id)  user = await prismaclient.user.findUnique({ where: { id },
      
      select: {
        role: true,
        id: true,
        SocialMedias: true ,
        isactive: true,
        isFinance: true,
        isbanned: true,
        imgcount:true
      } }); // Correctly use findUnique
    // console.log(jwt.verify(token, secretKey));
    if (!user) {
     // console.log("User not found");
      return res.sendStatus(404); // Not Found
    }
    
    if (user.isbanned) {
      return res.status(403).json({ message: 'User is banned' }); // Banned user response
    }

    // Destructure user properties for easier access
    const {
      role,
      StreamingAccess,
      isactive,
      isFinance,
      id: userId,
    } = user;

    // Assign user info to the request object
    req.user = user;
    req.isAdmin = role === 'ADMIN';
    req.isAgent = role === 'AGENT';
    req.isUser = role === 'USER';
    req.StreamingAccess = StreamingAccess;
    req.isActive = isactive === true; // Ensure a boolean
    req.key = StreamingAccess?.key; // Optional chaining for key
    req.isFinance = isFinance;
    req.userId = userId;
    req.imgcount=user?.imgcount 

    next(); // Proceed to the next middleware
  } catch (err) {
    console.error(err);
    return res.sendStatus(403); // Forbidden
  }
};

export default authenticateToken;
