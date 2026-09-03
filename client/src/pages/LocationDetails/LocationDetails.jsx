import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Icon from "../../components/Icon/Icon.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { formatCurrency } from "../../utils/currency.js";
import { getListingImages, resolveImage } from "../../utils/images.js";
import "./LocationDetails.css";

// turns a raw image path into something the browser can actually load,
// whether it came from an uploaded file or a plain external URL
const fallbackImage = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80";

export default function LocationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [reportMessage, setReportMessage] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/accommodations/${id}`);
        setListing(data);
      } catch (err) {
        setError("This listing could not be found.");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  // recalculated automatically any time the dates or the listing change
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }, [checkIn, checkOut]);

  const costBreakdown = useMemo(() => {
    if (!listing || nights === 0) return null;

    const subtotal = listing.price * nights;
    const weeklyDiscount = nights >= 7 ? listing.weeklyDiscount : 0;
    const total =
      subtotal -
      weeklyDiscount +
      listing.cleaningFee +
      listing.serviceFee +
      listing.occupancyTaxes;

    return {
      subtotal,
      weeklyDiscount,
      cleaningFee: listing.cleaningFee,
      serviceFee: listing.serviceFee,
      occupancyTaxes: listing.occupancyTaxes,
      total,
    };
  }, [listing, nights]);

  const handleReserve = async (event) => {
    event.preventDefault();
    setBookingError("");
    setBookingSuccess("");

    if (!user) {
      navigate("/login");
      return;
    }

    if (!checkIn || !checkOut || nights === 0) {
      setBookingError("Please choose a valid check in and check out date.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/reservations", {
        accommodationId: listing._id,
        checkIn,
        checkOut,
        guests: guestCount,
        totalPrice: costBreakdown.total,
      });
      setBookingSuccess("Reservation confirmed. You can view it under your reservations.");
    } catch (err) {
      setBookingError(
        err.response?.data?.message || "Could not complete the reservation."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage("Link copied");
    } catch {
      setShareMessage("Copy this page URL to share it");
    }
  };

  const chooseStayLength = (days) => {
    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + days);
    setCheckIn(start.toISOString().split("T")[0]);
    setCheckOut(end.toISOString().split("T")[0]);
  };

  const toggleSaved = () => {
    const savedListings = JSON.parse(localStorage.getItem("airbnbSavedListings") || "[]");
    const next = !saved;
    const updated = next ? [...new Set([...savedListings, listing._id])] : savedListings.filter((savedId) => savedId !== listing._id);
    localStorage.setItem("airbnbSavedListings", JSON.stringify(updated));
    setSaved(next);
  };

  if (loading) return <p className="page-status">Loading listing...</p>;
  if (error) return <p className="page-status">{error}</p>;
  if (!listing) return null;

  const images = getListingImages(listing);
  const [mainImage, ...smallImages] = images;

  return (
    <main>
      <div className="container listing-page">
        {/* Heading and subheading */}
        <div className="listing-page__heading">
          <h1>{listing.title}</h1>
          <button className="listing-share" onClick={handleShare}>Share</button>
          <button className="listing-share" onClick={toggleSaved}>{saved ? "Saved" : "Save"}</button>
          {shareMessage && <span className="listing-share__message">{shareMessage}</span>}
          <p className="listing-page__subheading">
            <Icon name="star" size={14} color="#FF385C" filled /> {listing.rating.toFixed(1)}{" "}
            <span className="dot">&middot;</span>
            <span className="underline">{listing.reviews} reviews</span>{" "}
            <span className="dot">&middot;</span> {listing.location}
          </p>
        </div>

        {/* Image gallery: large image left, four smaller images stacked 2 over 2 */}
        <div className="listing-gallery">
          <div className="listing-gallery__main">
            <img
              src={resolveImage(mainImage)}
              alt={`Main photo of ${listing.title}`}
              onError={(event) => {
                event.currentTarget.src = fallbackImage;
              }}
            />
          </div>
          <div className="listing-gallery__grid">
            {smallImages.slice(0, 4).map((img, index) => (
              <img
                key={index}
                src={resolveImage(img)}
                alt={`Photo ${index + 2} of ${listing.title}`}
                onError={(event) => {
                  event.currentTarget.src = fallbackImage;
                }}
              />
            ))}
          </div>
        </div>

        {/* Two column layout: details left, cost calculator right */}
        <div className="listing-columns">
          <div className="listing-details">
            <div className="listing-details__host">
              <div>
                <h2>
                  {listing.type} hosted by {listing.host}
                </h2>
                <p>
                  {listing.guests} guests &middot; {listing.bedrooms} bedroom
                  {listing.bedrooms !== 1 ? "s" : ""} &middot; {listing.bathrooms} bath
                  {listing.bathrooms !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="listing-details__host-avatar">
                {listing.host.charAt(0).toUpperCase()}
              </div>
            </div>

            <hr />

            <div className="listing-highlights">
              <div className="listing-highlight">
                <Icon name="guest" size={22} />
                <div>
                  <p className="listing-highlight__title">Entire home</p>
                  <p className="listing-highlight__desc">You&apos;ll have the place to yourself</p>
                </div>
              </div>
              {listing.enhancedCleaning && (
                <div className="listing-highlight">
                  <Icon name="check" size={22} />
                  <div>
                    <p className="listing-highlight__title">Enhanced Clean</p>
                    <p className="listing-highlight__desc">
                      This host follows an enhanced cleaning process.
                    </p>
                  </div>
                </div>
              )}
              {listing.selfCheckIn && (
                <div className="listing-highlight">
                  <Icon name="check" size={22} />
                  <div>
                    <p className="listing-highlight__title">Self check-in</p>
                    <p className="listing-highlight__desc">Check yourself in with the keypad.</p>
                  </div>
                </div>
              )}
            </div>

            <hr />

            <p className="listing-description">{listing.description}</p>

            <hr />

            {/* Accommodation details */}
            <section className="listing-section">
              <h3>What this place offers</h3>
              <ul className="amenities-list">
                {listing.amenities.map((amenity) => (
                  <li key={amenity}>
                    <Icon name="check" size={16} /> {amenity}
                  </li>
                ))}
              </ul>
            </section>

            <hr />

            {/* nights summary */}
            {nights > 0 && (
              <section className="listing-section">
                <h3>
                  {nights} night{nights !== 1 ? "s" : ""} in {listing.location}
                </h3>
                <p className="listing-page__dates">
                  {checkIn} &ndash; {checkOut}
                </p>
              </section>
            )}

            <hr />

            {/* Reviews */}
            <section className="listing-section">
              <h3>
                <Icon name="star" size={16} color="#FF385C" filled /> {listing.rating.toFixed(1)} &middot;{" "}
                {listing.reviews} reviews
              </h3>
              <div className="ratings-grid">
                {Object.entries(listing.specificRatings || {}).map(([key, value]) => (
                  <div key={key} className="ratings-grid__row">
                    <span className="ratings-grid__label">{key}</span>
                    <div className="ratings-grid__bar">
                      <div style={{ width: `${(value / 5) * 100}%` }} />
                    </div>
                    <span>{value.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </section>

            <hr />

            {/* Host details */}
            <section className="listing-section">
              <h3>Meet your host, {listing.host}</h3>
              <p className="listing-description">
                {listing.host} is a host on this platform and is looking forward to welcoming
                you.
              </p>
            </section>

            <hr />

            {/* House rules, health and safety, cancellation policy */}
            <section className="listing-section listing-policies">
              <div>
                <h4>House rules</h4>
                <p>Check-in after 3:00 PM &middot; Checkout before 11:00 AM &middot; No parties or events</p>
              </div>
              <div>
                <h4>Health &amp; safety</h4>
                <p>Committed to the platform&apos;s enhanced cleaning process.</p>
              </div>
              <div>
                <h4>Cancellation policy</h4>
                <p>Free cancellation for 48 hours after booking.</p>
              </div>
            </section>
          </div>

          {/* Cost calculator */}
          <aside className="cost-calculator">
            <div className="cost-calculator__header">
              <p className="cost-calculator__price">
                {formatCurrency(listing.price)} <span>/ night</span>
              </p>
              <p className="cost-calculator__rating">
                <Icon name="star" size={14} color="#FF385C" filled /> {listing.rating.toFixed(1)}{" "}
                &middot; {listing.reviews} reviews
              </p>
            </div>

            <form onSubmit={handleReserve}>
              <div className="cost-calculator__dates">
                <div className="form-group">
                  <label htmlFor="checkIn">CHECK-IN</label>
                  <input
                    id="checkIn"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="checkOut">CHECKOUT</label>
                  <input
                    id="checkOut"
                    type="date"
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="stay-presets">
                <button type="button" onClick={() => chooseStayLength(2)}>Weekend</button>
                <button type="button" onClick={() => chooseStayLength(7)}>One week</button>
              </div>

              <div className="form-group">
                <label htmlFor="guests">GUESTS</label>
                <select
                  id="guests"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                >
                  {Array.from({ length: listing.guests }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} guest{n !== 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary cost-calculator__reserve" disabled={submitting}>
                {submitting ? "Reserving..." : "Reserve"}
              </button>

              <p className="cost-calculator__note">You won&apos;t be charged yet</p>

              {bookingError && <p className="form-error">{bookingError}</p>}
              {bookingSuccess && <p className="cost-calculator__success">{bookingSuccess} <Link to="/reservations">View reservations</Link></p>}

              {costBreakdown && (
                <div className="cost-calculator__breakdown">
                  <div className="cost-row">
                    <span>
                      {formatCurrency(listing.price)} &times; {nights} night{nights !== 1 ? "s" : ""}
                    </span>
                    <span>{formatCurrency(costBreakdown.subtotal)}</span>
                  </div>
                  {costBreakdown.weeklyDiscount > 0 && (
                    <div className="cost-row cost-row--discount">
                      <span>Weekly discount</span>
                      <span>-{formatCurrency(costBreakdown.weeklyDiscount)}</span>
                    </div>
                  )}
                  <div className="cost-row">
                    <span>Cleaning fee</span>
                    <span>{formatCurrency(costBreakdown.cleaningFee)}</span>
                  </div>
                  <div className="cost-row">
                    <span>Service fee</span>
                    <span>{formatCurrency(costBreakdown.serviceFee)}</span>
                  </div>
                  <div className="cost-row">
                    <span>Occupancy taxes and fees</span>
                    <span>{formatCurrency(costBreakdown.occupancyTaxes)}</span>
                  </div>
                  <hr />
                  <div className="cost-row cost-row--total">
                    <span>Total</span>
                    <span>{formatCurrency(costBreakdown.total)}</span>
                  </div>
                </div>
              )}
            </form>

            <button className="listing-report" onClick={() => setReportMessage("Thanks. We will review this listing.")}>
              <Icon name="close" size={14} /> Report this listing
            </button>
            {reportMessage && <p className="cost-calculator__success">{reportMessage}</p>}
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
