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
