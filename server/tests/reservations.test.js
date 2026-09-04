/**
 * Reservation endpoint tests
 *
 * Covers:
 *   POST   /api/reservations          – create (guest)
 *   GET    /api/reservations/user     – guest's reservations
 *   GET    /api/reservations/host     – host's reservations
 *   DELETE /api/reservations/:id      – cancel (guest or host)
 *
 * Validation checks covered:
 *   - past check-in dates are rejected
 *   - checkout before check-in is rejected
 *   - overlapping reservations are rejected
 *   - guest count exceeding listing capacity is rejected
 *   - unauthenticated access is rejected
 */

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const Accommodation = require("../models/Accommodation");

// ── helpers ──────────────────────────────────────────────────────────────────

const uniqueEmail = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`;

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

/** Create a host user directly and log in, returning token + userId */
const createHost = async () => {
  const email = uniqueEmail("res-host");
  const username = `res-host-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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

/** Create a guest user and return their token */
const createGuest = async () => {
  const email = uniqueEmail("res-guest");
  const username = `res-guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const res = await request(app).post("/api/users/register").send({
    username,
    email,
    password: "guestpass99",
  });
  return res.body.token;
};

/** Create a listing owned by the given host and return its id */
const createListing = async (hostToken, overrides = {}) => {
  const res = await request(app)
    .post("/api/accommodations")
    .set("Authorization", `Bearer ${hostToken}`)
    .send({
      title: "Reservation Test Listing",
      type: "Entire apartment",
      location: "Res City",
      description: "A place for testing reservations thoroughly.",
      guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      price: 150,
      cleaningFee: 30,
      serviceFee: 20,
      occupancyTaxes: 15,
      amenities: "wifi",
      ...overrides,
    });
  return res.body._id;
};

// ── lifecycle ─────────────────────────────────────────────────────────────────

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

// ── create reservation ────────────────────────────────────────────────────────

describe("POST /api/reservations", () => {
  let guestToken;
  let listingId;

  beforeAll(async () => {
    const host = await createHost();
    guestToken = await createGuest();
    listingId = await createListing(host.token);
  });

  test("guest can create a valid reservation", async () => {
    const res = await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${guestToken}`)
      .send({
        accommodationId: listingId,
        checkIn: daysFromNow(10),
        checkOut: daysFromNow(13),
        guests: 2,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.guests).toBe(2);
  });

  test("rejects a reservation with a past check-in date", async () => {
    const res = await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${guestToken}`)
      .send({
        accommodationId: listingId,
        checkIn: yesterday(),
        checkOut: tomorrow(),
        guests: 1,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/past/i);
  });

  test("rejects a reservation where checkout is before check-in", async () => {
    const res = await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${guestToken}`)
      .send({
        accommodationId: listingId,
        checkIn: daysFromNow(5),
        checkOut: daysFromNow(3),
        guests: 1,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/after/i);
  });

  test("rejects a reservation exceeding listing guest capacity", async () => {
    const res = await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${guestToken}`)
      .send({
        accommodationId: listingId,
        checkIn: daysFromNow(20),
        checkOut: daysFromNow(22),
        guests: 99, // listing only allows 4
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/guests/i);
  });

  test("rejects overlapping reservations for the same listing", async () => {
    // first reservation occupies days 30–35
    await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${guestToken}`)
      .send({
        accommodationId: listingId,
        checkIn: daysFromNow(30),
        checkOut: daysFromNow(35),
        guests: 1,
      });

    // second reservation overlaps with the first
    const res = await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${guestToken}`)
      .send({
        accommodationId: listingId,
        checkIn: daysFromNow(32),
        checkOut: daysFromNow(37),
        guests: 1,
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/already reserved/i);
  });

  test("rejects reservation without authentication", async () => {
    const res = await request(app)
      .post("/api/reservations")
      .send({
        accommodationId: listingId,
        checkIn: daysFromNow(50),
        checkOut: daysFromNow(53),
        guests: 1,
      });

    expect(res.statusCode).toBe(401);
  });

  test("rejects reservation for a non-existent listing", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${guestToken}`)
      .send({
        accommodationId: fakeId,
        checkIn: daysFromNow(60),
        checkOut: daysFromNow(63),
        guests: 1,
      });

    expect(res.statusCode).toBe(404);
  });
});

// ── guest reservations ────────────────────────────────────────────────────────

describe("GET /api/reservations/user", () => {
  let guestToken;

  beforeAll(async () => {
    const host = await createHost();
    guestToken = await createGuest();
    const lid = await createListing(host.token);
    // create one reservation so we have something to read back
    await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${guestToken}`)
      .send({
        accommodationId: lid,
        checkIn: daysFromNow(70),
        checkOut: daysFromNow(73),
        guests: 1,
      });
  });

  test("returns the guest's reservations", async () => {
    const res = await request(app)
      .get("/api/reservations/user")
      .set("Authorization", `Bearer ${guestToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test("unauthenticated request is rejected", async () => {
    const res = await request(app).get("/api/reservations/user");
    expect(res.statusCode).toBe(401);
  });
});

// ── host reservations ─────────────────────────────────────────────────────────

describe("GET /api/reservations/host", () => {
  let hostToken;
  let guestToken;

  beforeAll(async () => {
    const host = await createHost();
    hostToken = host.token;
    guestToken = await createGuest();
    const lid = await createListing(hostToken);
    await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${guestToken}`)
      .send({
        accommodationId: lid,
        checkIn: daysFromNow(80),
        checkOut: daysFromNow(83),
        guests: 1,
      });
  });

  test("host can see reservations on their listings", async () => {
    const res = await request(app)
      .get("/api/reservations/host")
      .set("Authorization", `Bearer ${hostToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test("guest cannot access host reservations endpoint", async () => {
    const res = await request(app)
      .get("/api/reservations/host")
      .set("Authorization", `Bearer ${guestToken}`);

    expect(res.statusCode).toBe(403);
  });

  test("unauthenticated request is rejected", async () => {
    const res = await request(app).get("/api/reservations/host");
    expect(res.statusCode).toBe(401);
  });
});

// ── delete reservation ────────────────────────────────────────────────────────

describe("DELETE /api/reservations/:id", () => {
  let guestToken;
  let otherGuestToken;
  let reservationId;

  beforeAll(async () => {
    const host = await createHost();
    guestToken = await createGuest();
    otherGuestToken = await createGuest();
    const lid = await createListing(host.token);

    const res = await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${guestToken}`)
      .send({
        accommodationId: lid,
        checkIn: daysFromNow(90),
        checkOut: daysFromNow(93),
        guests: 1,
      });
    reservationId = res.body._id;
  });

  test("a different user cannot cancel someone else's reservation", async () => {
    const res = await request(app)
      .delete(`/api/reservations/${reservationId}`)
      .set("Authorization", `Bearer ${otherGuestToken}`);

    expect(res.statusCode).toBe(403);
  });

  test("the guest who booked can cancel their own reservation", async () => {
    const res = await request(app)
      .delete(`/api/reservations/${reservationId}`)
      .set("Authorization", `Bearer ${guestToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(reservationId);
  });

  test("cancelled reservation cannot be found again", async () => {
    // re-attempt delete of the same now-deleted reservation
    const res = await request(app)
      .delete(`/api/reservations/${reservationId}`)
      .set("Authorization", `Bearer ${guestToken}`);

    expect(res.statusCode).toBe(404);
  });

  test("unauthenticated delete is rejected", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).delete(`/api/reservations/${fakeId}`);
    expect(res.statusCode).toBe(401);
  });
});
