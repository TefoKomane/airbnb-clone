# Airbnb Clone

A full-stack accommodation marketplace built as three coordinated applications:

- `client`: guest-facing React application for discovering stays, viewing listing details, calculating booking costs, and managing reservations.
- `admin`: host-facing React dashboard for managing listings and viewing reservations.
- `server`: Node.js, Express, and MongoDB API shared by both frontends.

This project follows the supplied Airbnb clone brief. Guest and host workflows are separated while authentication, listings, images, pricing, and reservations remain connected through a real API and MongoDB database.

## Project Status

The local system is functional and has been validated with production builds, backend syntax checks, browser smoke tests, and live API requests.

Verified locally:

- Guest application responds on `http://localhost:5173`.
- Host dashboard responds on `http://localhost:5174`.
- Backend health endpoint responds on `http://localhost:5000`.
- Guest login and registration use JWT authentication.
- Host login is restricted to users with the `host` role.
- Accommodation listing CRUD is connected to MongoDB.
- Reservation creation, cancellation, ownership checks, date validation, overlap prevention, and server-side pricing are implemented.
- Legacy and missing image paths are normalized to working fallback galleries.
- Both frontend applications produce successful Vite production builds.

The project is an Airbnb-style educational clone. It is not a literal copy of Airbnb's proprietary production platform, private APIs, or payment infrastructure.

## Main Features

### Guest application

- Home hero banner with flexible search call to action.
- Popular destination chips in the hero section.
- Inspiration cards with location navigation and property imagery.
- Experience cards with working discovery actions.
- Gift-card and hosting call-to-action links.
- Future-getaway tabs with destination lists and expandable content.
- Footer link columns, newsletter subscription feedback, currency display, and back-to-top control.
- Branded favicon, touch icon, manifest, theme color, and metadata.
- Location search with URL-synchronised state.
- Property type, maximum price, and minimum guest filters.
- Saved-stays-only filtering and dedicated Saved Stays route.
- Clear-filters recovery action.
- Compact and comfortable result views.
- Sort by recommended order, price, or rating.
- Persisted sort preference and recent search memory.
- Keyboard-accessible listing cards and lazy-loaded result imagery.
- Robust fallback images for missing, legacy, or unavailable media.
- Detailed listing heading, rating, review count, location, host, amenities, policies, and description.
- Five-image listing gallery with selectable thumbnails.
- Share listing URL with copy feedback.
- Save listing and report listing feedback states.
- Booking date inputs with past-date prevention.
- Weekend and one-week date presets.
- Guest count stepper constrained by listing capacity.
- Live nightly, weekly discount, cleaning, service, tax, and total calculations.
- Booking feedback and direct reservation navigation.
- Login, registration, logout, password visibility, validation, and error messages.
- Guest reservations table with status badges, totals, refresh, and cancellation.
- Persistent light and dark themes.
- Responsive layouts for desktop, tablet, and mobile widths.

### Host admin dashboard

- Host-only login page with validation and password visibility.
- Persistent host JWT session.
- Protected routes for every dashboard page.
- Branded host favicon, manifest, theme color, and metadata.
- Listing creation form with title, type, location, description, capacity, rooms, pricing, fees, amenities, feature flags, and images.
- Client-side validation for required fields, numeric values, discounts, and image sizes.
- Image previews before submission.
- Reset form action.
- Listing update form pre-filled from MongoDB data.
- Listing deletion with confirmation.
- Portfolio search by title or location.
- Portfolio sorting by newest or price.
- Active listing count, guest capacity, and combined nightly-rate summary cards.
- Listing refresh action and filtered-empty feedback.
- Host reservation table.
- Reservation filtering by property.
- Reservation count and booked-revenue summary.
- Reservation refresh action.
- Reservation CSV export.
- Host reservation deletion with authorization.
- Persistent admin light and dark themes.

### Backend API

- Express HTTP server with JSON and URL-encoded request parsing.
- MongoDB connection through Mongoose.
- User registration and login.
- Password hashing with `bcryptjs`.
- JWT generation and verification.
- Reusable authentication and host-role middleware.
- Accommodation create, read, update, and delete operations.
- Ownership checks for host listing updates and deletion.
- Server-side accommodation filters for location, type, price, and guest capacity.
- Location regex escaping before database filtering.
- Reservation create, read by host, read by guest, and delete operations.
- Reservation date validation and past-date rejection.
- Reservation overlap prevention.
- Guest-capacity validation.
- Server-authoritative reservation total calculation.
- Multer image upload support with static `/uploads` serving.
- Central error middleware with Mongoose validation, duplicate-key, invalid-ID, and not-found handling.
- CORS configuration for client and admin origins.

## Technology Stack

### Frontend

- React 18
- React Router 6
- Vite 5
- Axios
- Plain CSS with shared design tokens
- Inline SVG icon component
- SVG favicon and PWA manifest

### Backend

- Node.js 18 or later
- Express 4
- Mongoose 8
- MongoDB Atlas or local MongoDB
- JSON Web Tokens
- bcryptjs
- Multer
- CORS
- dotenv

## Directory Structure

```text
airbnb-clone/
├── admin/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── site.webmanifest
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── client/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── site.webmanifest
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   └── utils/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## Requirements

- Node.js 18 or later.
- npm.
- MongoDB Atlas account or a locally running MongoDB instance.
- A modern browser with JavaScript enabled.
- Internet access if using the supplied remote image URLs.

## Environment Configuration

Never commit real credentials. Use the supplied example files:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
Copy-Item admin/.env.example admin/.env
```

### `server/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/airbnb-clone
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_USD_TO_ZAR_RATE=16.0944
```

### `admin/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_USD_TO_ZAR_RATE=16.0944
```

Listing prices are stored as numeric source values and displayed as South African rand using `VITE_USD_TO_ZAR_RATE`. The supplied value is a dated reference rate, not a live financial feed. Update it before deployment when the rate changes.

## Local Installation

From the repository root, install dependencies for all three applications:

```powershell
Push-Location server
npm install
Pop-Location

Push-Location client
npm install
Pop-Location

Push-Location admin
npm install
Pop-Location
```

## Database Seeding

The seed script creates sample users and accommodation listings. It deletes existing accommodations and the two sample users before recreating them, so do not run it against a database containing data you need to preserve.

```powershell
Push-Location server
npm run seed
Pop-Location
```

The seed data includes New York, Bordeaux, and Johannesburg examples. Existing database records with old `/images/sample-*.jpg` paths are rendered through the client image-normalization fallback.

## Running Locally

Open three terminals from the repository root.

### Terminal 1: API

```powershell
cd server
npm run dev
```

Use `npm start` when nodemon is not required.

### Terminal 2: guest site

```powershell
cd client
npm run dev -- --host localhost --port 5173
```

Open `http://localhost:5173`.

### Terminal 3: host dashboard

```powershell
cd admin
npm run dev -- --host localhost --port 5174
```

Open `http://localhost:5174`.

If VS Code or the computer closes, repeat these three commands. Database contents remain in MongoDB; only the local development processes need to be restarted.

## Sample Accounts

The seed script creates the following accounts:

| Role | Email | Password | Access |
| --- | --- | --- | --- |
| Guest | `john@example.com` | `password123` | Guest search, listing details, reservations |
| Host | `jane@example.com` | `password321` | Admin dashboard, listing CRUD, host reservations |

The public registration endpoint always creates a guest account. Host access is assigned through trusted seed or administrative data rather than accepting a client-supplied role.

## Application Routes

### Guest routes

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/search` | Listing search, filtering, sorting, saved-only mode |
| `/listing/:id` | Listing details, gallery, pricing, and reservation form |
| `/login` | Guest login and registration |
| `/reservations` | Guest reservation history and cancellation |
| `/saved` | Saved listing collection |

### Admin routes

| Route | Purpose |
| --- | --- |
| `/login` | Host login |
| `/listings` | Host portfolio, search, sorting, stats, update, delete |
| `/listings/new` | Create listing |
| `/listings/:id/edit` | Update listing |
| `/reservations` | Host reservation management and CSV export |

## API Reference

All API routes are prefixed with `/api`.

### Users

#### `POST /api/users/register`

Creates a guest account and returns a JWT.

Request:

```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### `POST /api/users/login`

Authenticates a user or host and returns `_id`, `username`, `email`, `role`, and `token`.

#### `GET /api/users/me`

Returns the authenticated user's profile. Requires `Authorization: Bearer <token>`.

### Accommodations

#### `GET /api/accommodations`

Public listing search. Supported query parameters:

- `location`: case-insensitive location search.
- `type`: exact accommodation type.
- `maxPrice`: maximum numeric price.
- `guests`: minimum guest capacity.

Example:

```text
/api/accommodations?location=Johannesburg&type=Entire%20home&maxPrice=400&guests=4
```

#### `GET /api/accommodations/:id`

Returns one public listing.

#### `GET /api/accommodations/host/mine`

Returns listings owned by the authenticated host. Requires a valid host JWT.

#### `POST /api/accommodations`

Creates a listing. Requires a host JWT. Supports `multipart/form-data` with up to ten `images` files.

#### `PUT /api/accommodations/:id`

Updates a listing owned by the authenticated host. Supports replacement fields and additional image uploads.

#### `DELETE /api/accommodations/:id`

Deletes a listing owned by the authenticated host.

### Reservations

#### `POST /api/reservations`

Creates a reservation for an authenticated guest. The server validates dates, guest capacity, and availability, then calculates the final total from the listing's stored price and fees.

Request:

```json
{
  "accommodationId": "664000000000000000000001",
  "checkIn": "2026-10-10",
  "checkOut": "2026-10-17",
  "guests": 2
}
```

#### `GET /api/reservations/user`

Returns reservations created by the authenticated guest.

#### `GET /api/reservations/host`

Returns reservations for listings owned by the authenticated host. Requires authentication and the `host` role.

#### `DELETE /api/reservations/:id`

Allows the reservation guest or listing host to cancel the reservation.

## Data Models

### User

```js
{
  username: String,
  email: String,
  password: String,
  role: "user" | "host",
  createdAt: Date,
  updatedAt: Date
}
```

Passwords are hashed with bcrypt before persistence.

### Accommodation

```js
{
  title: String,
  type: String,
  location: String,
  description: String,
  guests: Number,
  bedrooms: Number,
  bathrooms: Number,
  price: Number,
  weeklyDiscount: Number,
  cleaningFee: Number,
  serviceFee: Number,
  occupancyTaxes: Number,
  amenities: [String],
  images: [String],
  rating: Number,
  reviews: Number,
  host: String,
  hostId: ObjectId,
  enhancedCleaning: Boolean,
  selfCheckIn: Boolean,
  specificRatings: Object
}
```

### Reservation

```js
{
  accommodation: ObjectId,
  guest: ObjectId,
  host: ObjectId,
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  totalPrice: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Image Handling

There are two supported image sources:

1. Remote image URLs stored in seeded or manually supplied listing data.
2. Uploaded files stored by Multer under `server/uploads` and served at `/uploads`.

The client normalizes uploaded paths, legacy `/images` paths, empty image arrays, and unavailable media into location-aware fallback galleries. This ensures the gallery still presents five usable images when older database records are missing local files.

For production, use persistent object storage such as S3, Cloudinary, or an equivalent service rather than relying on an ephemeral local filesystem.

## Branding and Icons

Both applications include:

- `public/favicon.svg` with an Airbnb-style project mark.
- Apple touch icon metadata.
- `site.webmanifest` for installable browser experiences.
- Theme-color metadata.
- Descriptive page metadata.
- Shared inline SVG UI icons for logo, search, menu, guest, heart, star, check, close, and amenity indicators.

The project uses an Airbnb-inspired visual language for educational purposes. Do not represent the project as an official Airbnb product.

## Validation and Quality Checks

Run these checks before submission:

```powershell
cd client
npm run build
```

```powershell
cd admin
npm run build
```

```powershell
cd server
Get-ChildItem -Recurse -File -Include *.js | ForEach-Object { node --check $_.FullName }
```

Manual smoke-test checklist:

1. Open the API health endpoint and confirm the JSON response.
2. Open the guest home page and test hero search, destination cards, tabs, footer links, theme toggle, newsletter, and back-to-top.
3. Search listings using location, type, price, and guest filters.
4. Save a listing, open `/saved`, and remove it again.
5. Open a listing detail page, switch gallery images, use date presets, change guests, and verify the price breakdown.
6. Log in as the guest and create a reservation.
7. Confirm the reservation appears in the guest reservation page.
8. Log in as the host and confirm the reservation appears in the host dashboard.
9. Create, update, filter, sort, and delete a listing from the admin dashboard.
10. Test invalid dates, overlapping dates, over-capacity guests, invalid login, invalid registration, and oversized upload feedback.

There is currently no automated Jest, Vitest, Supertest, or Playwright test suite in the repository. Production builds, Node syntax checks, live HTTP requests, and browser smoke testing have been used as the current validation layer. Adding automated tests is recommended before a production release.

## Deployment Guide

Deploy the backend first, then configure both frontends to use its public URL.

### Backend deployment

1. Create a production MongoDB database and allow the deployment service's network access.
2. Set `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `CLIENT_URL`, and `ADMIN_URL` in the hosting provider's environment settings.
3. Use `npm install` as the install command.
4. Use `npm start` as the start command.
5. Confirm the public `/` health endpoint returns `{ "message": "Airbnb clone API is running" }`.
6. Configure persistent image storage or a cloud media provider for uploaded files.

### Guest frontend deployment

1. Set `VITE_API_URL` to the deployed backend API URL ending in `/api`.
2. Set `VITE_USD_TO_ZAR_RATE` to the current reference rate used for the release.
3. Use `npm install` as the install command.
4. Use `npm run build` as the build command.
5. Serve the generated `dist` directory.
6. Configure SPA fallback so direct routes such as `/listing/:id`, `/saved`, and `/reservations` return `index.html`.

### Admin frontend deployment

1. Set `VITE_API_URL` to the deployed backend API URL ending in `/api`.
2. Set `VITE_USD_TO_ZAR_RATE` to the same release rate used by the guest frontend.
3. Use `npm install` as the install command.
4. Use `npm run build` as the build command.
5. Serve the generated `dist` directory.
6. Configure SPA fallback for `/login`, `/listings`, `/listings/new`, `/listings/:id/edit`, and `/reservations`.

Update the deployed URLs in the Live URLs section below after deployment.

## Rubric Coverage Checklist

### Frontend rubric: 140 marks

- [x] Hero banner with clear flexible-search call to action.
- [x] Inspiration section with destination cards and images.
- [x] Experience sections with titles, imagery, and working actions.
- [x] ShopAirbnb/gift-card section with working external action.
- [x] Future getaway tabs with content in every tab and expandable lists.
- [x] Footer with organized columns, working links, newsletter feedback, currency, and back-to-top.
- [x] Location filter with URL-aware navigation.
- [x] Property type, price, guest, saved-only, clear, compact, and sort controls.
- [x] Location cards with image, title, location, amenities, ratings, price, save action, and navigation.
- [x] Location details heading and subheading.
- [x] Five-image responsive gallery with selectable thumbnails and fallbacks.
- [x] Dynamic cost calculator with dates, guest count, fees, discount, and total.
- [x] Accommodation, amenities, sleep, review, host, rule, safety, and cancellation sections.
- [x] Header logo, search, profile menu, authentication links, and theme control.
- [x] Guest login, registration, validation, logout, and reservation access.
- [x] Responsive styling for desktop and mobile.
- [x] Accessible focus states, keyboard card navigation, labels, and action feedback.
- [x] Persistent dark mode, recent search memory, loading skeletons, and empty-state recovery.

### Admin frontend rubric: 100 marks

- [x] Branded header with navigation, host greeting, profile menu, logout, and theme control.
- [x] Host login validation, role restriction, JWT session, and password visibility.
- [x] Comprehensive create listing form.
- [x] Required-field, numeric, discount, image-size, and feedback validation.
- [x] Image upload selection and previews.
- [x] Listing portfolio with details, update, delete, search, sort, refresh, and stats.
- [x] Pre-filled update form with saved changes.
- [x] Host reservation table with property filter, totals, revenue summary, refresh, CSV export, and deletion.
- [x] Protected admin routing and expired-session handling.
- [x] Responsive and consistent styling.

### Backend rubric: 150 marks

- [x] Modular controllers, models, routes, configuration, middleware, and utilities.
- [x] Accommodation create, read, update, and delete operations.
- [x] JWT login and protected route handling.
- [x] Bcrypt password hashing.
- [x] Host-role and listing-ownership authorization.
- [x] Reservation create, read, and delete operations.
- [x] Date, overlap, guest-capacity, and server-side pricing validation.
- [x] Mongoose schemas and references.
- [x] Central error handling and appropriate response codes.
- [x] Multer image upload support.
- [x] Server-side search filters and escaped location regex input.
- [x] Environment-based configuration and CORS allow-list.
- [x] Seed data and repeatable local setup.
- [ ] Comprehensive automated endpoint and integration test suite.
- [ ] Production deployment and monitoring evidence.
- [ ] Production payment provider integration.

## Known Limitations Before Submission

The following items should be completed or explicitly explained in an assessment submission:

1. Add automated API and frontend tests, especially for authentication, ownership, reservations, overlap prevention, filters, and CRUD.
2. Deploy the API, guest frontend, and admin frontend and record their public URLs.
3. Configure persistent cloud image storage for uploaded files.
4. Add a real payment provider if the assessor expects payment capture rather than reservation creation.
5. Replace the static exchange-rate environment value with a scheduled or provider-backed rate if live currency conversion is required.
6. Add production logging, request-rate limiting, security headers, and monitoring.
7. Replace sample credentials before public release and rotate the JWT secret.
8. Review external links and replace educational placeholders with project-owned content where required.

These limitations do not prevent local demonstration of the supplied CRUD, authentication, listing, reservation, image, and navigation requirements, but they matter for a production-grade deployment claim.

## Live URLs

Add deployed URLs here after deployment:

- Guest site: pending deployment
- Host dashboard: pending deployment
- Backend API: pending deployment

## Git Workflow

The repository contains incremental milestone commits. The recommended workflow is:

```powershell
git status
git log --oneline --decorate -12
git add <changed-files>
git commit -m "Describe the completed milestone"
git push origin main
```

Do not commit `.env` files, database credentials, JWT secrets, or private deployment keys.

## Author

Tefo Karabo Komane

Full Stack Web Developer

Johannesburg, South Africa
