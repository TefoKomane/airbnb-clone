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
      title: "Modern Apartment in New York",
      type: "Entire apartment",
      location: "New York",
      description:
        "Stay in the heart of New York City in this bright, modern apartment close to everything the city has to offer.",
      guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      price: 320,
      weeklyDiscount: 28,
      cleaningFee: 50,
      serviceFee: 50,
      occupancyTaxes: 30,
      amenities: ["wifi", "kitchen", "free parking", "dryer", "air conditioning"],
      images: ["/images/sample-new-york.jpg"],
      rating: 4.8,
      reviews: 320,
      host: host.username,
      hostId: host._id,
      enhancedCleaning: true,
      selfCheckIn: true,
    },
    {
      title: "Bordeaux Getaway",
      type: "Entire rental unit",
      location: "Bordeaux",
      description:
        "A superb duplex in the heart of the historic center of Bordeaux, close to shops, bars and restaurants.",
      guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      price: 75,
      weeklyDiscount: 28,
      cleaningFee: 62,
      serviceFee: 83,
      occupancyTaxes: 29,
      amenities: ["wifi", "kitchen", "garden view", "pets allowed", "dryer"],
      images: ["/images/sample-bordeaux.jpg"],
      rating: 5.0,
      reviews: 7,
      host: host.username,
      hostId: host._id,
      enhancedCleaning: true,
      selfCheckIn: true,
    },
    {
      title: "Sandton City Hotel Suite",
      type: "Entire home",
      location: "Johannesburg",
      description:
        "A comfortable suite close to Sandton City with easy access to restaurants, shops and public transport.",
      guests: 6,
      bedrooms: 3,
      bathrooms: 3,
      price: 325,
      weeklyDiscount: 0,
      cleaningFee: 40,
      serviceFee: 45,
      occupancyTaxes: 20,
      amenities: ["wifi", "kitchen", "free parking"],
      images: ["/images/sample-sandton.jpg"],
      rating: 5.0,
      reviews: 318,
      host: host.username,
      hostId: host._id,
      enhancedCleaning: false,
      selfCheckIn: false,
    },
  ];

  await Accommodation.insertMany(sampleListings);

  console.log("Seed complete.");
  console.log("Sample user login: john@example.com / password123 (role: user)");
  console.log("Sample host login: jane@example.com / password321 (role: host)");
  process.exit();
};

runSeed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
