const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid token structure' });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
