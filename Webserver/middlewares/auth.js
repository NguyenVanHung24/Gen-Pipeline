const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json("Access denied. No token provided.");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // Add user info to request
    console.log(req.user)
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json("Token expired");
    }
    return res.status(403).json("Invalid token");
  }
};

module.exports = { verifyToken };