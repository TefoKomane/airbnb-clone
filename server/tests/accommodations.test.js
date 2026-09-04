/**
 * Accommodation endpoint tests
 *
 * Covers:
 *   GET  /api/accommodations          – public listing with filters
 *   GET  /api/accommodations/:id      – single public listing
 *   POST /api/accommodations          – create (host only)
 *   PUT  /api/accommodations/:id      – update (owner host only)
 *   DELETE /api/accommodations/:id    – delete (owner host only)
 *   GET  /api/accommodations/host/mine – host's own listings
 */

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const Accommodation = require("../models/Accommodation");

// ── helpers ──────────────────────────────────────────────────────────────────

const uniqueEmail = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`;

/** Register a host account and return its JWT token */
const createHost = async () => {
  const email = uniqueEmail("host");
  // create directly in DB so we can assign the host role
  // username must be unique per call, same as email
  const username = `host-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const user = await User.create({
    username,
    email,
    password: "hostpass99",
    role: "host",
  });
  const res = await request(app)
    .post("/api/users/login")
    .send({ email, password: "hostpass99" });
  return { token: res.body.token, userId: user._id.toString() };
};

/** Register a regular guest account and return its JWT token */
const createGuest = async () => {
  const email = uniqueEmail("guest");
  const username = `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const res = await request(app).post("/api/users/register").send({
    username,
    email,
    password: "guestpass99",
  });
  return res.body.token;
};

/** Minimal valid listing body */
const listingBody = (overrides = {}) => ({
  title: "Test Listing",
  type: "Entire apartment",
  location: "Test City",
  description: "A perfectly adequate place to test things in.",
  guests: 2,
  bedrooms: 1,
  bathrooms: 1,
  price: 100,
  cleaningFee: 20,
  serviceFee: 15,
  occupancyTaxes: 10,
  amenities: "wifi,kitchen",
  ...overrides,
});

// ── lifecycle ─────────────────────────────────────────────────────────────────

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

// ── public listing read ───────────────────────────────────────────────────────

describe("GET /api/accommodations", () => {
  test("returns an array of listings", async () => {
    const res = await request(app).get("/api/accommodations");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("filters by location (case-insensitive)", async () => {
    const { token } = await createHost();
    // create a uniquely named listing to filter by
    const location = `FilterCity-${Date.now()}`;
    await request(app)
      .post("/api/accommodations")
      .set("Authorization", `Bearer ${token}`)
      .send(listingBody({ location, title: "Filter Test Listing" }));

    const res = await request(app).get(
      `/api/accommodations?location=${encodeURIComponent(location.toLowerCase())}`
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(
      res.body.every((l) =>
        l.location.toLowerCase().includes(location.toLowerCase())
      )
    ).toBe(true);
  });

  test("filters by maxPrice", async () => {
    const res = await request(app).get("/api/accommodations?maxPrice=50");
    expect(res.statusCode).toBe(200);
    expect(res.body.every((l) => l.price <= 50)).toBe(true);
  });
});

describe("GET /api/accommodations/:id", () => {
  let listingId;

  beforeAll(async () => {
    const { token } = await createHost();
    const res = await request(app)
      .post("/api/accommodations")
      .set("Authorization", `Bearer ${token}`)
      .send(listingBody({ title: "Single Fetch Test" }));
    listingId = res.body._id;
  });

  test("returns the correct listing", async () => {
    const res = await request(app).get(`/api/accommodations/${listingId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(listingId);
    expect(res.body.title).toBe("Single Fetch Test");
  });

  test("returns 404 for a non-existent id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/accommodations/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  test("returns 404 for a malformed id", async () => {
    const res = await request(app).get("/api/accommodations/not-a-valid-id");
    expect(res.statusCode).toBe(404);
  });
});

// ── create ────────────────────────────────────────────────────────────────────

describe("POST /api/accommodations", () => {
  let hostToken;
  let guestToken;

  beforeAll(async () => {
    const host = await createHost();
    hostToken = host.token;
    guestToken = await createGuest();
  });

  test("host can create a listing", async () => {
    const res = await request(app)
      .post("/api/accommodations")
      .set("Authorization", `Bearer ${hostToken}`)
      .send(listingBody({ title: "Created By Host" }));

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Created By Host");
    expect(res.body).toHaveProperty("_id");
  });

  test("guest cannot create a listing", async () => {
    const res = await request(app)
      .post("/api/accommodations")
      .set("Authorization", `Bearer ${guestToken}`)
      .send(listingBody());

    expect(res.statusCode).toBe(403);
  });

  test("unauthenticated request is rejected", async () => {
    const res = await request(app)
      .post("/api/accommodations")
      .send(listingBody());

    expect(res.statusCode).toBe(401);
  });

  test("rejects a listing missing required fields", async () => {
    const res = await request(app)
      .post("/api/accommodations")
      .set("Authorization", `Bearer ${hostToken}`)
      .send({ title: "Missing Fields" }); // no location, description, price etc.

    expect(res.statusCode).toBe(400);
  });
});

// ── update ────────────────────────────────────────────────────────────────────

describe("PUT /api/accommodations/:id", () => {
  let ownerToken;
  let otherHostToken;
  let listingId;

  beforeAll(async () => {
    const owner = await createHost();
    ownerToken = owner.token;

    const other = await createHost();
    otherHostToken = other.token;

    const res = await request(app)
      .post("/api/accommodations")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send(listingBody({ title: "Before Update" }));
    listingId = res.body._id;
  });

  test("owner can update their listing", async () => {
    const res = await request(app)
      .put(`/api/accommodations/${listingId}`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ title: "After Update" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("After Update");
  });

  test("a different host cannot update another host's listing", async () => {
    const res = await request(app)
      .put(`/api/accommodations/${listingId}`)
      .set("Authorization", `Bearer ${otherHostToken}`)
      .send({ title: "Hijacked" });

    expect(res.statusCode).toBe(403);
  });

  test("unauthenticated update is rejected", async () => {
    const res = await request(app)
      .put(`/api/accommodations/${listingId}`)
      .send({ title: "No auth" });

    expect(res.statusCode).toBe(401);
  });
});

// ── delete ────────────────────────────────────────────────────────────────────

describe("DELETE /api/accommodations/:id", () => {
  let ownerToken;
  let otherHostToken;
  let listingId;

  beforeAll(async () => {
    const owner = await createHost();
    ownerToken = owner.token;

    const other = await createHost();
    otherHostToken = other.token;

    const res = await request(app)
      .post("/api/accommodations")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send(listingBody({ title: "To Be Deleted" }));
    listingId = res.body._id;
  });

  test("a different host cannot delete another host's listing", async () => {
    const res = await request(app)
      .delete(`/api/accommodations/${listingId}`)
      .set("Authorization", `Bearer ${otherHostToken}`);

    expect(res.statusCode).toBe(403);
  });

  test("owner can delete their listing", async () => {
    const res = await request(app)
      .delete(`/api/accommodations/${listingId}`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(listingId);
  });

  test("deleted listing is no longer accessible", async () => {
    const res = await request(app).get(`/api/accommodations/${listingId}`);
    expect(res.statusCode).toBe(404);
  });
});

// ── host/mine ─────────────────────────────────────────────────────────────────

describe("GET /api/accommodations/host/mine", () => {
  let hostToken;

  beforeAll(async () => {
    const host = await createHost();
    hostToken = host.token;
    // create a listing owned by this host
    await request(app)
      .post("/api/accommodations")
      .set("Authorization", `Bearer ${hostToken}`)
      .send(listingBody({ title: "My Private Listing" }));
  });

  test("host can fetch only their own listings", async () => {
    const res = await request(app)
      .get("/api/accommodations/host/mine")
      .set("Authorization", `Bearer ${hostToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    // every listing in the result must have been created by this host
    expect(
      res.body.every((l) => l.title === "My Private Listing")
    ).toBe(true);
  });

  test("guest cannot access host/mine", async () => {
    const guestToken = await createGuest();
    const res = await request(app)
      .get("/api/accommodations/host/mine")
      .set("Authorization", `Bearer ${guestToken}`);

    expect(res.statusCode).toBe(403);
  });

  test("unauthenticated request to host/mine is rejected", async () => {
    const res = await request(app).get("/api/accommodations/host/mine");
    expect(res.statusCode).toBe(401);
  });
});
