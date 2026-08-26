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

### Testing (backend rubric, "Testing and Validation")
Nothing in this codebase currently has automated tests. To score well here, at minimum:
1. Install Thunder Client or the REST Client extension in VS Code (see `SETUP_GUIDE.md`)
2. Manually test every endpoint listed in `server/README.md`, including the failure cases — wrong password, missing fields, deleting someone else's listing while logged in as a different host
3. If you want actual automated tests for a higher mark, look into `jest` and `supertest`, and write a handful of tests hitting `/api/accommodations` and `/api/users/login`. This is optional extra work beyond what is built, but it is what "Comprehensive testing" in the rubric's top band is asking for

### Deployment (backend rubric, "Deployment and Environment Configuration")
This project currently only runs locally. If your brief requires a live deployed link:
* **Backend**: Render or Railway both have straightforward free tiers for a Node/Express API. You will set your `MONGO_URI` and `JWT_SECRET` as environment variables in their dashboard, the same values from your local `.env`, never commit them
* **Client and Admin**: Vercel or Netlify, both are built for exactly this kind of Vite/React app. You will set `VITE_API_URL` in their environment variable settings to point at your deployed backend's real URL, not `localhost`
* Once deployed, update `CLIENT_URL` and `ADMIN_URL` in your backend's environment variables to your real deployed frontend URLs, or your CORS setup will block real requests

### Images
Every listing currently uses either an Unsplash URL as a placeholder, or whatever you upload through the admin Create Listing form. For a fully polished submission, upload real photos through the admin dashboard for each sample listing rather than leaving the generic placeholders in place, and note their source/licence in your `README.md` if you use stock photography, per the brief's "image credits" expectation from the wider assignment pattern.

### Performance and Presentation polish
These two rubric lines are inherently about the finished feel of the product, which only comes from you actually clicking through it repeatedly and fixing what feels off: check loading states show correctly, check error messages read naturally, check nothing looks cut off at your actual screen size, check the browser console for warnings.

### Your own understanding
Read every file you commit, not just the ones you personally struggled with. If your course includes any kind of walkthrough, demo, or viva, you need to be able to explain what `protect` and `isHost` do, why the cost calculator only applies the weekly discount at 7+ nights, and why the JWT is stored under different localStorage keys in `client` versus `admin`. Code you cannot explain is code you should not submit as entirely your own understanding.

---

## 6. Suggested pacing across your week

Given you said you want to start today and pace towards Friday, ahead of a Tuesday deadline:

* **Today**: Get all three apps running locally by following `SETUP_GUIDE.md` end to end. Do not write any new code today, just get the existing project working and understand the folder structure.
* **Day 2**: Read through `server/` fully, run every endpoint manually with Thunder Client, understand the auth flow. Fix anything that does not behave as expected in your environment.
* **Day 3**: Read through and click through `client/` fully. Make a booking end to end. Upload real images through `admin/` and confirm they appear correctly on the guest site.
* **Day 4 (Friday)**: Polish pass — responsive check at different screen widths, fix any visual issues, write or extend automated tests if you are going for the top band there, and start on deployment if your brief requires a live link.
* **Remaining days before Tuesday**: Deployment, a full re-test of the deployed version (deployed apps commonly break on CORS or environment variable mistakes even when local worked perfectly), and recording whatever demo/walkthrough your submission requires.

This leaves you real buffer time before Tuesday specifically because deployment is the step most likely to eat unexpected hours.
