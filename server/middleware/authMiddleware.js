const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    // Get token from Authorization header
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return res.status(401).json({
    message: "No token provided ❌",
  });
}

// Extract token
const token = authHeader.split(" ")[1];

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);

// Save decoded user info in request
req.user = decoded;

// Continue to the next middleware/route
next();
  } catch (error) {
    res.status(401).json({
      message: "Not Authorized ❌",
    });
  }
};

module.exports = {
  protect,
};