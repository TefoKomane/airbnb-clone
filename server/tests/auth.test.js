/**
 * Auth endpoint tests
 *
 * Covers: POST /api/users/register, POST /api/users/login, GET /api/users/me
 *
 * Each test group uses its own isolated email addresses so tests never
 * interfere with each other when the suite is re-run against a shared DB.
 */

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");

// ── helpers ──────────────────────────────────────────────────────────────────

const uniqueEmail = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`;

// ── lifecycle ─────────────────────────────────────────────────────────────────

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

// ── registration ──────────────────────────────────────────────────────────────

describe("POST /api/users/register", () => {
  test("creates a new guest account and returns a JWT", async () => {
    const res = await request(app).post("/api/users/register").send({
      username: `testuser-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      email: uniqueEmail("reg-ok"),
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.role).toBe("user");
    expect(res.body).not.toHaveProperty("password");
  });

  test("rejects registration when email is already taken", async () => {
    const email = uniqueEmail("reg-dup");

    // first registration should succeed
    await request(app).post("/api/users/register").send({
      username: `firstuser-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      email,
      password: "password123",
    });

    // second registration with the same email should fail
    const res = await request(app).post("/api/users/register").send({
      username: `seconduser-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      email,
      password: "password456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already/i);
  });

  test("rejects registration with an invalid email format", async () => {
    const res = await request(app).post("/api/users/register").send({
      username: `bademail-${Date.now()}`,
      email: "not-an-email",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
  });

  test("rejects registration when required fields are missing", async () => {
    const res = await request(app).post("/api/users/register").send({
      email: uniqueEmail("reg-missing"),
    });

    expect(res.statusCode).toBe(400);
  });
});

// ── login ─────────────────────────────────────────────────────────────────────

describe("POST /api/users/login", () => {
  const loginEmail = uniqueEmail("login");
  const loginPassword = "loginpass99";

  // create the user once before these tests
  beforeAll(async () => {
    await request(app).post("/api/users/register").send({
      username: `logintester-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      email: loginEmail,
      password: loginPassword,
    });
  });

  test("returns a JWT on valid credentials", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: loginEmail,
      password: loginPassword,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.email).toBe(loginEmail);
    expect(res.body).not.toHaveProperty("password");
  });

  test("returns 401 on wrong password", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: loginEmail,
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid/i);
  });

  test("returns 401 on unknown email", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "nobody@nowhere.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(401);
  });

  test("returns 400 when body is empty", async () => {
    const res = await request(app).post("/api/users/login").send({});
    expect(res.statusCode).toBe(400);
  });
});

// ── profile ───────────────────────────────────────────────────────────────────

describe("GET /api/users/me", () => {
  let token;

  beforeAll(async () => {
    const email = uniqueEmail("me");
    await request(app).post("/api/users/register").send({
      username: `metester-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      email,
      password: "mepassword1",
    });
    const res = await request(app)
      .post("/api/users/login")
      .send({ email, password: "mepassword1" });
    token = res.body.token;
  });

  test("returns the authenticated user's profile", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("username");
    expect(res.body).not.toHaveProperty("password");
  });

  test("returns 401 without a token", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.statusCode).toBe(401);
  });

  test("returns 401 with a malformed token", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", "Bearer totally.invalid.token");
    expect(res.statusCode).toBe(401);
  });
});
