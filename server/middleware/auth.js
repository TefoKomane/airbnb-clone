const jwt = require("jsonwebtoken");
const User = require("../models/User");

// protect checks that a valid token was sent with the request
// any route that needs a logged in user should use this middleware first
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // attach the user to the request, leaving out the password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User belonging to this token no longer exists");
      }

