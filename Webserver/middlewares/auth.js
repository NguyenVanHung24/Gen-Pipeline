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

const verifyContributor = async (req, res, next) => {
  try {
    // Get token from header
    console.log("SDFSD")
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log(token)
    if (!token) {
      return res.status(401).json("Access denied. No token provided.");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // Check if user is a contributor
    if (!decoded.roles || !decoded.roles.includes('contributor')) {
      return res.status(403).json("Access denied. Contributor role required.");
    }
    
    req.user = decoded; // Add user info to request
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json("Token expired");
    }
    return res.status(403).json("Invalid token");
  }
};


const verifyAdmin = async (req, res, next) => {
  try {
    // Get token from header
    console.log("SDFSD")
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log(token)
    if (!token) {
      return res.status(401).json("Access denied. No token provided.");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log("SDFSD")
    console.log(decoded)
    // Check if user is a contributor
    if (!decoded.roles || !decoded.roles.includes('admin')) {
      return res.status(403).json("Access denied. Admin role required.");
    }
    
    req.user = decoded; // Add user info to request
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json("Token expired");
    }
    return res.status(403).json("Invalid token");
  }
};
module.exports = { verifyToken, verifyContributor,verifyAdmin };