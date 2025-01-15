/* eslint-disable no-unused-vars */
import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  // const authHeader = req.headers['authorization'];
  // if (!authHeader) {
  //   return res.status(401).json({ message: 'Authorization header missing' });
  // }

  // const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
  // if (!token) {
  //   return res.status(401).json({ message: 'Token missing' });
  // }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    // console.log('in authenticate', decoded);

    // req.userId = decoded.id; // Attach user ID to the request object
    req.userId = '678449e8240629f7a64dce95';
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default authenticate;
