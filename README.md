# Airbnb Clone

A full stack Airbnb clone built as a three part system: a Node.js and Express backend, a guest facing React frontend, and a separate React admin dashboard for hosts. The project covers user authentication, full CRUD for property listings, a working reservation system, and a live booking cost calculator.

## Live Demo

Guest site: add your deployed client link here once available
Admin dashboard: add your deployed admin link here once available
Backend API: add your deployed server link here once available

For local development, start the three services in separate terminals. If the
computer or VS Code closes, repeat these commands from the project root:

```
cd server
npm start
```

```
cd client
npm run dev -- --host localhost --port 5173
```

```
cd admin
npm run dev -- --host localhost --port 5174
```

The guest site is then available at `http://localhost:5173`, the host dashboard
at `http://localhost:5174`, and the API health check at `http://localhost:5000/`.
Copy each `.env.example` to `.env` before the first run and replace the server
MongoDB and JWT values with your own credentials.

## About This Project

This project recreates the core experience of Airbnb across three views: a home page, a search and location results page, and a detailed listing page with a functional booking flow. Alongside that sits a full admin dashboard that lets a host create, view, update, and delete their own listings, and see every reservation made against them.

The goal was not just to make something that looks like Airbnb, but something that behaves like it end to end. A listing created in the admin dashboard appears immediately in the guest search results. A booking made as a guest appears immediately in the host's reservation table. Everything is backed by a real database rather than static sample data.

## Features

### Guest Site (client)
* A hero banner, inspiration section, experiences section, gift card section, and a tabbed future getaways section on the home page
* A location search page that filters real listings pulled from the database
* A full listing details page with an image gallery, amenities, host information, reviews, and house rules
* A working cost calculator that recalculates live as a guest changes their check in date, check out date, and guest count, including a weekly discount, cleaning fee, service fee, and occupancy taxes
* Account creation, login, and a reservations page showing every booking a guest has made
* A responsive layout that adapts across desktop, tablet, and mobile screen sizes

### Admin Dashboard (admin)
* A login restricted to host accounts only
* A create listing form covering every field a listing needs, including image upload
* A view listings page showing every listing owned by the logged in host, with update and delete actions
* An update listing page that loads the existing listing data into the same form used to create one
* A reservations table showing every booking made against the host's listings, with the option to remove one

### Backend (server)
* User registration and login secured with JSON Web Tokens
* Passwords hashed with bcrypt before they are ever stored
* Full CRUD endpoints for accommodations and reservations
* Ownership checks so a host can only update or delete their own listings
* Centralized error handling that returns clean, consistent responses across every route
* Image upload support through multer

## Technology Used

Frontend: React, React Router, Vite, plain CSS
Backend: Node.js, Express, MongoDB, Mongoose
Authentication: JSON Web Tokens (JWT), bcrypt for password hashing
File handling: Multer for image uploads

## Project Structure

```
airbnb clone
  admin      the host facing dashboard, a separate React application
  client     the guest facing site, a separate React application
  server     the Express and MongoDB backend that both frontends talk to
```

Each of the three folders is its own independent project with its own package.json and its own dependencies. They communicate only over HTTP through the backend's API, never by importing each other's code directly.

## Getting Started Locally

You will need Node.js installed, and a MongoDB Atlas account for the database.

1. Clone the repository
   ```
   git clone https://github.com/TefoKomane/airbnb-clone.git
   ```
2. Set up the backend
   ```
   cd server
   npm install
   ```
   Create a `.env` file in the `server` folder with the following values, replacing each with your own:
   ```
   PORT=5000
   MONGO_URI=your MongoDB Atlas connection string
   JWT_SECRET=a long random string
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ADMIN_URL=http://localhost:5174
   ```
   Then seed the database with two starter accounts and a few sample listings, and start the server:
   ```
   npm run seed
   npm run dev
   ```
3. Set up the guest site, in a separate terminal
   ```
   cd client
   npm install
   ```
   Create a `.env` file in the `client` folder:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
   Then run it:
   ```
   npm run dev
   ```
4. Set up the admin dashboard, in a separate terminal
   ```
   cd admin
   npm install
   ```
   Create a `.env` file in the `admin` folder:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
   Then run it:
   ```
   npm run dev
   ```

## Sample Accounts

Guest account: john@example.com, password123
Host account for the admin dashboard: jane@example.com, password321

## API Overview

A full endpoint reference lives in `server/README.md`, including every route for users, accommodations, and reservations, along with which ones require a logged in user or a host account specifically.

## Author

Tefo Karabo Komane
Full Stack Web Developer
Johannesburg, South Africa
