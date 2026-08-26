// Run this once with "npm run seed" to create starter users and listings.
// It clears out old seed data first so you can safely run it more than once.
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../config/db");
const User = require("../models/User");
const Accommodation = require("../models/Accommodation");

const seedUsers = [
  {
    username: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "user",
  },
  {
    username: "Jane Doe",
    email: "jane@example.com",
    password: "password321",
    role: "host",
  },
];

const runSeed = async () => {
  await connectDB();

  console.log("Clearing old accommodations and seed users...");
  await Accommodation.deleteMany({});
  await User.deleteMany({ email: { $in: seedUsers.map((u) => u.email) } });

  console.log("Creating users...");
  // create one at a time so the password hashing middleware runs for each
  const createdUsers = [];
  for (const userData of seedUsers) {
    const user = await User.create(userData);
    createdUsers.push(user);
  }

  const host = createdUsers.find((u) => u.role === "host");

  console.log("Creating sample accommodations...");
  const sampleListings = [
    {
