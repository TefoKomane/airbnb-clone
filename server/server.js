const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const userRoutes = require("./routes/userRoutes");
const accommodationRoutes = require("./routes/accommodationRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

connectDB();

const app = express();

// allow requests from both the guest facing client and the admin dashboard
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  process.env.ADMIN_URL || "http://localhost:5174",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded listing images as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Airbnb clone API is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/reservations", reservationRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
