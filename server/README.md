# Airbnb Clone — Backend API

Node.js, Express and MongoDB backend for the Airbnb clone project. Handles user authentication, accommodation listings and reservations.

## Requirements

* Node.js 18 or later
* A MongoDB Atlas account (or a local MongoDB install)

## Setup

1. Run `npm install`
2. Copy `.env.example` to `.env` and fill in your own values (see `API_SECURITY.md` in the project root)
3. Run `npm run seed` once to create two starter users and a few sample listings
4. Run `npm run dev` to start the server with nodemon, or `npm start` for a plain start

The API runs on `http://localhost:5000` by default.

## Project structure

* `config/db.js` — MongoDB connection
* `models/` — Mongoose schemas for User, Accommodation and Reservation
* `controllers/` — the actual logic for each route
* `routes/` — maps URLs to controller functions
* `middleware/auth.js` — verifies the JWT and protects private routes
* `middleware/errorHandler.js` — turns thrown errors into clean JSON responses
