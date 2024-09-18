const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to Check if the User is Authenticated
exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Please Login to Access" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
   
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Middleware to Check if the User has a Specific Role
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (roles != req.user.role) {
      return res
        .status(403)
        .json({
          success: false,
          message: `Role: ${req.user.role} is not allowed`,
        });
    }
    next();
  };
};
