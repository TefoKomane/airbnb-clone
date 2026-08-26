import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Icon from "../../components/Icon/Icon.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./LocationDetails.css";

// turns a raw image path into something the browser can actually load,
// whether it came from an uploaded file or a plain external URL
const resolveImage = (path) => {
  if (!path) return "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80";
  if (path.startsWith("/uploads")) {
    return `${import.meta.env.VITE_API_URL.replace("/api", "")}${path}`;
  }
  return path;
};

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

  if (loading) return <p className="page-status">Loading listing...</p>;
  if (error) return <p className="page-status">{error}</p>;
  if (!listing) return null;

  const images = listing.images && listing.images.length > 0 ? listing.images : [null, null, null, null, null];
  const [mainImage, ...smallImages] = images;

  return (
    <main>
      <div className="container listing-page">
        {/* Heading and subheading */}
        <div className="listing-page__heading">
          <h1>{listing.title}</h1>
          <p className="listing-page__subheading">
            <Icon name="star" size={14} color="#FF385C" filled /> {listing.rating.toFixed(1)}{" "}
            <span className="dot">&middot;</span>
            <span className="underline">{listing.reviews} reviews</span>{" "}
            <span className="dot">&middot;</span> {listing.location}
          </p>
        </div>

        {/* Image gallery: large image left, four smaller images stacked 2 over 2 */}
        <div className="listing-gallery">
