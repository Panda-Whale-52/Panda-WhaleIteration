
import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID from the token to the request object
    req.userId = decoded.userId;

    console.log('Authenticated user id:' , req.userId)

    next(); // Pass control to the next middleware or route handler
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authenticate;
