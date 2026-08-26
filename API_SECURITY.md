# API and Security Setup Guide

This covers every credential this project needs, exactly how to generate each one safely, and how to make sure none of them ever end up on GitHub. Read this before you touch `server/.env`.

---

## 1. MongoDB Atlas — your database

### Create the account and cluster
1. Go to mongodb.com/cloud/atlas/register and sign up with your email, or with Google/GitHub
2. When asked to create a deployment, choose the **free tier**, labelled M0
3. Pick any cloud provider (AWS is the default and fine) and pick a region close to you or close to South Africa, for the lowest latency
4. Give the cluster any name, for example `airbnb-clone-cluster`
5. Click Create

### Create a database user
This is a separate login from your Atlas account login. It is what your backend uses to connect.

1. In the setup wizard (or later under Database Access in the left sidebar), click **Add New Database User**
2. Choose **Password** as the authentication method
3. Set a username, for example `airbnb-admin`
4. Click **Autogenerate Secure Password** and **copy it somewhere safe immediately** — Atlas will not show it to you again
5. Under database user privileges, choose **Read and write to any database**
6. Click Add User

### Allow your computer to connect
1. Go to **Network Access** in the left sidebar
2. Click **Add IP Address**
3. For getting started, click **Allow Access from Anywhere** (`0.0.0.0/0`)

This is fine for a student project running locally and for most deployment platforms, since your database is still protected by the username and password. If you want tighter security later, you can restrict this to specific IP addresses instead.

### Get your connection string
1. Go back to **Database** in the left sidebar, click **Connect** on your cluster
2. Choose **Drivers**
3. Select **Node.js** and the version shown
4. Copy the connection string, it looks like this:
   ```
   mongodb+srv://airbnb-admin:<password>@airbnb-clone-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with the password you copied earlier

### A password gotcha that catches almost everyone
If your database password contains any of these characters: `@ : / ? # [ ] %`, the connection string will silently fail or connect to the wrong place. You need to URL encode them. The most common one is `@`, which becomes `%40`.

If this happens to you, it is simpler to just go back to Database Access, click Edit on your user, and generate a new password without special characters, made only of letters and numbers.

### Add your database name to the string
Right after `.net/` and before the `?`, add a database name of your choosing:
```
mongodb+srv://airbnb-admin:yourpassword@airbnb-clone-cluster.xxxxx.mongodb.net/airbnb-clone?retryWrites=true&w=majority
```
This is the value that goes into `MONGO_URI` in `server/.env`. MongoDB creates the `airbnb-clone` database automatically the first time you write data to it, you do not need to create it manually.

---

## 2. JWT secret — what keeps your login tokens secure

`JWT_SECRET` is a private string only your server knows. It is used to sign every login token, and to verify that a token presented later has not been tampered with. If someone else knows this string, they could forge a valid login token for any user without a password.

### How to generate one properly
Never type something like `mysecret123` here. Generate a genuinely random string instead.

**Option 1, using Node (recommended, no extra tools needed):**
```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Run this in any terminal. It prints a 128 character random string. Copy the whole thing into `JWT_SECRET` in your `.env`.

**Option 2, using an online generator:**
If you'd rather not use the terminal, search for "random string generator" and generate at least 64 characters, letters and numbers only. Multiple independent generators exist online for this purpose since it is a common developer need.

Whichever value you choose, treat it exactly like a password. Do not reuse it anywhere else, and do not share it in a screenshot, a Slack message, or a GitHub issue.

---

## 3. Keeping every secret out of GitHub

This project is already set up correctly for this, but you should understand why, and verify it yourself before you push.

Every `.env` file is listed in that folder's `.gitignore`:
```
node_modules/
.env
```

This means Git will never track or commit the real `.env` file. Only `.env.example`, which contains placeholder values, gets committed. This is intentional and is the standard way every real company handles this.

### Verify this yourself before your first push
Run this from inside `server`, `client`, and `admin` in turn:
```
git status
```
If you ever see `.env` listed as a file ready to be committed, **stop** and do not commit. Check that a `.gitignore` file exists in that folder and that it contains the line `.env`.

### If you ever accidentally commit a real secret
1. Immediately generate a brand new value (new JWT secret, or a new database password in Atlas) and update your local `.env`
2. Removing the old commit from history is possible but complicated (`git filter-repo` or the GitHub support process) — in practice for a student project it's simpler and safer to just rotate the leaked secret so the old one is useless, rather than trying to erase history
3. Never assume a secret is safe again once it has touched a public GitHub repository, even briefly

---

## 4. Password security already built into this project

You do not need to add this yourself, it is already implemented, but you should understand it since your rubric asks about security best practices and you may be asked about it.

* User passwords are never stored as plain text. `server/models/User.js` hashes every password with bcrypt before saving it, using a salt round of 10
* Login compares the typed password against the hash using `bcrypt.compare`, the plain password is never stored or logged anywhere
* JWTs expire automatically after the period set in `JWT_EXPIRES_IN` (7 days by default), so a stolen token does not work forever
* Every private route (creating a listing, viewing your reservations, and so on) passes through the `protect` middleware in `server/middleware/auth.js`, which rejects any request without a valid token
* Host only actions (creating, updating, deleting a listing) additionally pass through `isHost`, and updates/deletes further check that the listing actually belongs to the logged in host, so one host cannot edit or delete another host's listing

## 5. A few extra things worth doing for full marks on "Security Best Practices"

These are small, optional additions if you want to go further than the baseline above:

* Add basic rate limiting to the login route using the `express-rate-limit` package, so repeated failed login attempts get slowed down
* Add the `helmet` package to `server.js` (`app.use(helmet())`), which sets a handful of secure HTTP headers automatically
* Validate the shape of incoming data more strictly using a library like `express-validator`, on top of the manual checks already in the controllers

None of these are required for the project to function, they are the kind of thing you can mention in your README or a demo video as "further hardening I considered" if you want to demonstrate awareness beyond the minimum.
