// Run with "npm run seed" to reset the database to a clean demo state.
// Clears ALL accommodations and all users EXCEPT real registered accounts,
// then recreates the two sample accounts and a set of demo listings.
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../config/db");
const User = require("../models/User");
const Accommodation = require("../models/Accommodation");
const Reservation = require("../models/Reservation");

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

  console.log("Clearing all accommodations and reservations...");
  await Accommodation.deleteMany({});
  await Reservation.deleteMany({});

  // remove ALL users that are not the two seed accounts
  // this cleans up test-runner users (host-1234, res-host-5678, etc.)
  console.log("Removing test users (keeping only seed accounts)...");
  await User.deleteMany({
    email: { $nin: seedUsers.map((u) => u.email) },
  });

  // remove and recreate the two seed accounts so passwords are fresh
  await User.deleteMany({ email: { $in: seedUsers.map((u) => u.email) } });

  console.log("Creating seed users...");
  const createdUsers = [];
  for (const userData of seedUsers) {
    const user = await User.create(userData);
    createdUsers.push(user);
  }

  const host = createdUsers.find((u) => u.role === "host");

  console.log("Creating sample listings...");
  const sampleListings = [
    {
      title: "Modern Apartment in New York",
      type: "Entire apartment",
      location: "New York",
      description:
        "Stay in the heart of New York City in this bright, modern apartment close to everything the city has to offer. Steps from Central Park, world-class dining, and iconic landmarks.",
      guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      price: 320,
      weeklyDiscount: 28,
      cleaningFee: 50,
      serviceFee: 50,
      occupancyTaxes: 30,
      amenities: ["wifi", "kitchen", "free parking", "dryer", "air conditioning"],
      images: [
        "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
      ],
      rating: 4.8,
      reviews: 320,
      host: host.username,
      hostId: host._id,
      enhancedCleaning: true,
      selfCheckIn: true,
      specificRatings: {
        cleanliness: 4.9,
        communication: 4.7,
        checkIn: 4.9,
        accuracy: 4.8,
        location: 4.9,
        value: 4.6,
      },
    },
    {
      title: "Bordeaux Getaway",
      type: "Entire rental unit",
      location: "Bordeaux",
      description:
        "A superb duplex in the heart of the historic center of Bordeaux, close to shops, bars and restaurants. Enjoy the wine region from your own private terrace.",
      guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      price: 75,
      weeklyDiscount: 28,
      cleaningFee: 62,
      serviceFee: 83,
      occupancyTaxes: 29,
      amenities: ["wifi", "kitchen", "garden view", "pets allowed", "dryer"],
      images: [
        "https://images.unsplash.com/photo-1494526585095-c417462c9b49?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&q=80",
      ],
      rating: 5.0,
      reviews: 7,
      host: host.username,
      hostId: host._id,
      enhancedCleaning: true,
      selfCheckIn: true,
      specificRatings: {
        cleanliness: 5.0,
        communication: 5.0,
        checkIn: 5.0,
        accuracy: 5.0,
        location: 4.9,
        value: 4.8,
      },
    },
    {
      title: "Sandton City Hotel Suite",
      type: "Entire home",
      location: "Johannesburg",
      description:
        "A comfortable suite close to Sandton City with easy access to restaurants, shops and public transport. Perfect for business or leisure in South Africa's financial hub.",
      guests: 6,
      bedrooms: 3,
      bathrooms: 3,
      price: 325,
      weeklyDiscount: 0,
      cleaningFee: 40,
      serviceFee: 45,
      occupancyTaxes: 20,
      amenities: ["wifi", "kitchen", "free parking", "pool", "gym"],
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
      ],
      rating: 5.0,
      reviews: 318,
      host: host.username,
      hostId: host._id,
      enhancedCleaning: false,
      selfCheckIn: false,
      specificRatings: {
        cleanliness: 5.0,
        communication: 4.9,
        checkIn: 4.8,
        accuracy: 5.0,
        location: 4.9,
        value: 4.7,
      },
    },
    {
      title: "Cape Town Beachfront Villa",
      type: "Entire home",
      location: "Cape Town",
      description:
        "Wake up to breathtaking views of the Atlantic Ocean in this stunning beachfront villa. Steps from Camps Bay beach with Table Mountain as your backdrop.",
      guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      price: 480,
      weeklyDiscount: 50,
      cleaningFee: 80,
      serviceFee: 60,
      occupancyTaxes: 35,
      amenities: ["wifi", "kitchen", "free parking", "pool", "beach access", "braai"],
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=900&q=80",
      ],
      rating: 4.9,
      reviews: 142,
      host: host.username,
      hostId: host._id,
      enhancedCleaning: true,
      selfCheckIn: true,
      specificRatings: {
        cleanliness: 4.9,
        communication: 4.8,
        checkIn: 5.0,
        accuracy: 4.9,
        location: 5.0,
        value: 4.7,
      },
    },
    {
      title: "Durban Beachside Apartment",
      type: "Entire apartment",
      location: "Durban",
      description:
        "Enjoy the warmth of Durban from this stylish apartment right on the Golden Mile. The beach is literally at your doorstep.",
      guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      price: 180,
      weeklyDiscount: 20,
      cleaningFee: 30,
      serviceFee: 25,
      occupancyTaxes: 15,
      amenities: ["wifi", "kitchen", "air conditioning", "beach access"],
      images: [
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
      ],
      rating: 4.6,
      reviews: 89,
      host: host.username,
      hostId: host._id,
      enhancedCleaning: true,
      selfCheckIn: true,
      specificRatings: {
        cleanliness: 4.7,
        communication: 4.6,
        checkIn: 4.8,
        accuracy: 4.5,
        location: 5.0,
        value: 4.8,
      },
    },
    {
      title: "Paris Montmartre Studio",
      type: "Private room",
      location: "Paris",
      description:
        "A charming studio in the bohemian Montmartre district. Walk to the Sacré-Cœur and enjoy the best cafes and art galleries Paris has to offer.",
      guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      price: 95,
      weeklyDiscount: 15,
      cleaningFee: 35,
      serviceFee: 20,
      occupancyTaxes: 18,
      amenities: ["wifi", "kitchen", "heating", "city view"],
      images: [
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80",
      ],
      rating: 4.7,
      reviews: 203,
      host: host.username,
      hostId: host._id,
      enhancedCleaning: true,
      selfCheckIn: false,
      specificRatings: {
        cleanliness: 4.8,
        communication: 4.7,
        checkIn: 4.6,
        accuracy: 4.7,
        location: 5.0,
        value: 4.5,
      },
    },
  ];

  await Accommodation.insertMany(sampleListings);

  console.log("\nSeed complete! Database is clean.");
  console.log("────────────────────────────────");
  console.log("Guest login:  john@example.com  / password123");
  console.log("Host login:   jane@example.com  / password321");
  console.log(`Listings created: ${sampleListings.length}`);
  process.exit();
};

runSeed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
