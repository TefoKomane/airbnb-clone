// Handles the connection to MongoDB using Mongoose.
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // stop the server if the database connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
