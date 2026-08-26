# Project Overview — How This Codebase Maps to Your Rubric

This document exists so you understand exactly what has been built, why it was built that way, and what is genuinely still on you to do before submission. Read this once fully before you start working, then come back to the checklist sections as you go.

---

## 1. The big picture

You are being marked against three separate rubrics that add up to 390 marks:
* **Node.js Backend** — /150
* **Admin Frontend** — /100
* **Airbnb Frontend** — /140

All three rubrics score the same underlying project from different angles. The backend rubric cares about your API and database. The two frontend rubrics care about what a user actually sees and clicks. This is why the project is split into three genuinely separate apps, `server`, `client` and `admin`, each with its own `package.json` — they map directly onto the three rubrics.

---

## 2. Backend rubric, mapped to what exists (`server/`)

| Rubric line | Where it lives | Status |
|---|---|---|
| Project Structure | `controllers/`, `models/`, `routes/`, `middleware/`, `config/`, `seed/`, `utils/` | Matches the brief's expected structure exactly, plus `utils/` and `seed/` as useful extra organisation |
| Accommodation CRUD | `controllers/accommodationController.js`, `routes/accommodationRoutes.js` | Full CRUD implemented: create, read all (with location filtering), read one, read by host, update, delete — the brief's required list only asked for create/read/delete, this goes further to support the Update Listing admin page too |
| User Authentication | `controllers/userController.js`, `models/User.js`, `utils/generateToken.js` | Register, login, JWT issued and verified, bcrypt password hashing with salt rounds |
| Reservation CRUD | `controllers/reservationController.js`, `routes/reservationRoutes.js` | Create, get by host, get by user, delete — matches the brief exactly |
| Middleware | `middleware/auth.js` | `protect` verifies the JWT on every private route, `isHost` restricts host only actions, ownership checks live inside the update/delete controllers themselves |
| Error Handling and Status Codes | `middleware/errorHandler.js`, used via `next(error)` in every controller | Central handler converts Mongoose validation errors, cast errors, and duplicate key errors into clean JSON with correct status codes |
| Database Integration | `models/*.js`, `config/db.js` | Mongoose schemas with validation, defaults, and a `hostId` reference relationship between Accommodation and User, and Reservation to both Accommodation and User |
| API Documentation and Comments | `server/README.md`, inline `@desc / @route / @access` comments above every controller function | |
| Security Best Practices | `API_SECURITY.md` | bcrypt hashing, JWT expiry, ownership checks, `.env` kept out of git — read this file for what is built in versus optional extras you can add |
| Performance and Efficiency | N/A, needs your input | See "what's genuinely still on you" below |
| Modular and Clean Code | Whole `server/` structure | Each concern is in its own file, controllers do not talk to the database schema directly beyond Mongoose calls |
| Testing and Validation | N/A, needs your input | See below |
| Overall Functionality and Integration | Whole project | Verified end to end: creating a listing in `admin` shows up in `client` search results, booking in `client` shows up in `admin` reservations |
| Deployment and Environment Configuration | `.env.example` | The scaffolding is there, the actual deploy is on you, see the deployment section below |
| Overall Presentation and Polish | N/A, needs your input | See below |

---

## 3. Admin Frontend rubric, mapped to what exists (`admin/`)
