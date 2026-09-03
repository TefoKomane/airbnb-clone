import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import LocationCard from "../../components/LocationCard/LocationCard.jsx";
import "./SavedStays.css";

const readSavedIds = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("airbnbSavedListings") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    localStorage.removeItem("airbnbSavedListings");
    return [];
  }
};

export default function SavedStays() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSavedStays = async () => {
      try {
        const savedIds = readSavedIds();
        const { data } = await api.get("/accommodations");
        setListings(data.filter((listing) => savedIds.includes(listing._id)));
      } catch {
        setError("We could not load your saved stays right now.");
      } finally {
        setLoading(false);
      }
    };
    loadSavedStays();
  }, []);

  if (loading) return <main className="container saved-stays-page"><div className="loading-shimmer" /></main>;

  return (
    <main className="container saved-stays-page">
      <div className="saved-stays-page__heading">
        <div>
          <p className="saved-stays-page__eyebrow">Your collection</p>
          <h1>Saved stays</h1>
        </div>
        <Link className="btn btn-outline" to="/search">Explore more</Link>
      </div>
      {error && <p className="form-error">{error}</p>}
      {!error && listings.length === 0 && (
        <div className="saved-stays-page__empty">
          <h2>Your next favorite stay is waiting.</h2>
          <p>Tap the heart on a listing to keep it here for later.</p>
          <Link className="btn btn-primary" to="/search">Start exploring</Link>
        </div>
      )}
      <div className="saved-stays-page__list">
        {listings.map((listing) => <LocationCard key={listing._id} accommodation={listing} />)}
      </div>
    </main>
  );
}