# Airbnb Clone — Full Stack Project

A three part project: a Node.js/Express/MongoDB backend, a guest facing React frontend, and a React admin dashboard for hosts.

## The three apps

| Folder | What it is | Runs on |
|---|---|---|
| `server/` | REST API — accommodations, reservations, JWT auth | `http://localhost:5000` |
| `client/` | Guest facing site — home, search, listing details, booking | `http://localhost:5173` |
| `admin/` | Host dashboard — create/update/delete listings, view reservations | `http://localhost:5174` |

## Getting started

Follow `SETUP_GUIDE.md` from the top, in order. It covers installing Node, VS Code, Git, setting up MongoDB Atlas, and running all three apps together. Do not skip ahead to running `npm install` before reading `API_SECURITY.md` — you need real environment variables first.
