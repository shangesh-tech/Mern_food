const jwt = require('jsonwebtoken');

const sendToken = (user, statusCode, res) => {
  // Generate token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Options for cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 // 7days
    ),
    httpOnly: false,
  };

  // Send token in cookie
  res.cookie('token', token, cookieOptions);

  // Send response with token and user info
  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendToken;
