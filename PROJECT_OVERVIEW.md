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

| Rubric line | Where it lives | Status |
|---|---|---|
| Top Header | `components/Header/Header.jsx` | Logo, greeting with username, dropdown with view reservations and log out, "Become a Host" link when logged out, nav pills for View Reservations / View Listings / Create Listing |
| Login Page | `pages/Login/Login.jsx` | Validates email format and password length, shows clear errors, redirects to `/listings` on success, restricted to host role accounts only |
| Create Listing Page | `pages/CreateListing/CreateListing.jsx`, `components/ListingForm/ListingForm.jsx` | All fields from the brief's recommended data structure, client side validation, image upload via multer on the backend |
| View Listings Page | `pages/ViewListings/ViewListings.jsx` | Matches the reviewed design closely: image, details, Update and Delete buttons per listing |
| Update Listing Page | `pages/UpdateListing/UpdateListing.jsx` | Fetches the existing listing, pre-fills every field into the same `ListingForm` component, saves via `PUT` |
| User Authentication | `context/AuthContext.jsx`, `components/ProtectedRoute/ProtectedRoute.jsx` | JWT stored in localStorage under its own key so it never collides with a guest session, every dashboard page is wrapped in `ProtectedRoute` |
| Navigation and Routing | `App.jsx` | React Router, URL changes with every view, direct links work on refresh |
| Styling and Responsiveness | every `.css` file under `admin/src` | Built against the actual Figma export you uploaded, not a guess |
| Error Handling and Feedback | every page | Every API call is wrapped in try/catch with a user visible message, delete actions confirm before running |
| Code Quality and Documentation | throughout | Comments explain intent, not obvious syntax |

---

## 4. Airbnb Frontend rubric, mapped to what exists (`client/`)

| Rubric line | Where it lives | Status |
|---|---|---|
| Hero Banner | `pages/Home/Home.jsx`, `.hero` in `Home.css` | Matches the reviewed design: full width image, dark overlay, "I'm flexible" call to action |
| Inspiration Section | `data/inspirationData.js`, inspiration grid in `Home.jsx` | Four cards matching the design's hotel names and colours |
| Discover Experiences | `data/experiencesData.js` | Two sections, titles, buttons |
| ShopAirbnb Section | Home.jsx shop section | Title, button, layered gift card graphic |
| Future Getaways Section | `data/futureGetaways.js`, tab logic in `Home.jsx` | Working tabs, first tab shows a real destination grid matching the design |
| Footer | `components/Footer/Footer.jsx` | Four link columns plus the copyright bar, matches the design |
| Location Filter | `pages/Location/Location.jsx` | Filters real data from MongoDB by location, syncs with the URL so results are shareable/bookmarkable |
| Location Cards | `components/LocationCard/LocationCard.jsx` | Image left, details right, heart save toggle, rating, price — matches the reviewed search results design closely |
| Location Details Heading | `pages/LocationDetails/LocationDetails.jsx` | Title, rating, reviews link, location |
| Image Gallery | same file, `.listing-gallery` | Large image left, four smaller images in a 2x2 grid, matches the design |
| Cost Calculator | same file, `costBreakdown` useMemo block | Genuinely functional: recalculates nights, applies the weekly discount only at 7+ nights, adds cleaning/service/occupancy fees, live total, submits a real reservation to MongoDB |
| Static Information Sections | same file | Accommodation details, where you'll sleep, what this place offers, reviews with a rating breakdown, host details, house rules/health and safety/cancellation policy |
| Top Header Filter and Profile | `components/Header/Header.jsx` | Search bar, profile dropdown, differentiates logged in vs logged out |
| Code Quality and Documentation | throughout | |

---

## 5. What is genuinely still on you

Being direct about this rather than implying the project is "done" the moment code exists:
