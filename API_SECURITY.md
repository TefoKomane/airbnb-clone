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

