const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");

const { notFound, errorHandler } = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");
const accommodationRoutes = require("./routes/accommodationRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();
const allowedOrigins = [
  // local development
  "http://localhost:5173",
  "http://localhost:5174",
  // production Vercel deployments
  "https://airbnb-clone-omega-wine.vercel.app",
  "https://airbnb-clone-qw8t.vercel.app",
  // allow any Vercel preview deployment for this project
  /https:\/\/airbnb-clone.*\.vercel\.app$/,
  // env-configured origins (set in Render dashboard)
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.disable("x-powered-by");
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Too many requests. Please try again later." },
  })
);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Airbnb clone API is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/reservations", reservationRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
