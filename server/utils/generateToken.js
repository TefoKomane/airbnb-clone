const jwt = require("jsonwebtoken");

// builds a signed JWT that stores the user's id and role
// the frontend keeps this token and sends it back on every protected request
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
