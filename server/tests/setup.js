/**
 * Jest global setup file.
 * Loads environment variables from .env before any test file runs,
 * so MONGO_URI and JWT_SECRET are available to every test suite.
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
