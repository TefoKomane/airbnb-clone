# Setup Guide

This walks through everything from a completely empty laptop to all three apps running together. Follow it in order, top to bottom. Every step assumes you have not done any of this before.

---

## 1. Install the tools you need

### Node.js
1. Go to nodejs.org
2. Download the LTS version (not "current"), which will be an even numbered version like 20 or 22
3. Run the installer, accept the defaults
4. Open a terminal and run:
   ```
   node --version
   npm --version
   ```
   Both should print a version number. If either command is not found, restart your computer and try again, since the installer needs to update your system PATH.

### VS Code
1. Go to code.visualstudio.com and download it for your operating system
2. Install it with defaults
3. Open VS Code and install these extensions from the Extensions panel on the left sidebar (the icon with four squares):
   * **ES7+ React/Redux/React-Native snippets** — speeds up writing React components
   * **ESLint** — flags JavaScript errors as you type
   * **Prettier - Code formatter** — keeps your code formatted consistently
   * **MongoDB for VS Code** — lets you browse your database without leaving the editor
   * **Thunder Client** or **REST Client** — for testing your API endpoints without leaving VS Code
   * **GitLens** — makes it easier to see your commit history inline

### Git
1. Go to git-scm.com and download it for your OS
2. Install with defaults
3. Confirm it worked:
   ```
   git --version
   ```
4. If you have never used Git on this computer before, set your identity once:
   ```
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### MongoDB Atlas account
You do not need to install a database on your computer. This project uses MongoDB Atlas, a free cloud hosted database. Full step by step instructions for this are in `API_SECURITY.md` — do that section before continuing here, since you need a working connection string for the next part.

---

## 2. Understand the folder structure

```
airbnb-clone/
├── server/          the backend API, Node.js and Express
├── client/           the guest facing website, React
├── admin/             the admin dashboard, React
├── SETUP_GUIDE.md      this file
├── API_SECURITY.md      how to set up MongoDB Atlas and JWT secrets safely
├── COMMIT_GUIDE.md       150+ step by step commits for version control
├── PROJECT_OVERVIEW.md   how this project maps to your rubric
└── README.md              top level summary
```

Each of `server`, `client` and `admin` is its own independent Node project. Each has its own `package.json`, its own `node_modules` folder once you install, and its own `.env` file. They talk to each other over HTTP, not by importing each other's code.

Think of it like three separate restaurants that all happen to order ingredients from the same supplier. The supplier is your MongoDB database. `server` is the kitchen that touches the database directly. `client` and `admin` are two different dining rooms that never touch the database themselves, they only ever talk to the kitchen (`server`) over the API.

---

## 3. Set up the backend first

Open the `airbnb-clone` folder in VS Code (File > Open Folder). Then open the built in terminal (Terminal > New Terminal).

```
cd server
npm install
```

This downloads every package listed in `server/package.json` into a `server/node_modules` folder. It can take a minute or two the first time.

Next, create your real environment file:

```
cp .env.example .env
```

On Windows, if `cp` does not work in your terminal, just duplicate the file manually in VS Code's file explorer and rename the copy to `.env`.

Open `.env` and fill in:
* `MONGO_URI` — your real connection string from MongoDB Atlas (see `API_SECURITY.md`)
* `JWT_SECRET` — a long random string (see `API_SECURITY.md` for how to generate one safely)
* Leave `PORT`, `JWT_EXPIRES_IN`, `CLIENT_URL` and `ADMIN_URL` as they are unless you have a specific reason to change them

**Never commit your real `.env` file.** The `.gitignore` in `server/` already excludes it, so as long as you do not manually force-add it, you are safe.

Now seed the database with two starter accounts and a few sample listings:

```
npm run seed
```

You should see output ending in something like:
```
Seed complete.
Sample user login: john@example.com / password123 (role: user)
Sample host login: jane@example.com / password321 (role: host)
```

If instead you see a connection error, stop here and re-check your `MONGO_URI` value against `API_SECURITY.md` before continuing — nothing else in this project will work until the database connects.

Now start the backend:

```
npm run dev
```

You should see `MongoDB connected: ...` followed by `Server running on port 5000`. Leave this terminal running. Open `http://localhost:5000` in a browser — you should see a small JSON message confirming the API is running.

---

## 4. Set up the client (guest site)

Open a **second** terminal in VS Code (click the `+` icon in the terminal panel, or use Terminal > New Terminal again — do not close the one running your server).

```
cd client
npm install
cp .env.example .env
npm run dev
```

The default `.env` value already points at `http://localhost:5000/api`, so you should not need to change anything unless your backend is running somewhere else.

Vite will print a local URL, normally `http://localhost:5173`. Open that in your browser. You should see the home page with the hero banner, inspiration cards, and the rest of the sections.

Try logging in with `john@example.com` / `password123` from the header, then search for a location like "New York" or "Bordeaux" to see listings pulled live from your database.

---

## 5. Set up the admin dashboard
