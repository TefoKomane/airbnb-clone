import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import "./ViewListings.css";

// resolves an image path the same way the client app does, so uploaded
// files and plain external URLs both render correctly
const resolveImage = (path) => {
  if (!path) {
    return "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80";
  }
  if (path.startsWith("/uploads")) {
    return `${import.meta.env.VITE_API_URL.replace("/api", "")}${path}`;
  }
  return path;
};

export default function ViewListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/accommodations/host/mine");
        setListings(data);
      } catch (err) {
        setError("Could not load your listings right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this listing? This cannot be undone.");
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await api.delete(`/accommodations/${id}`);
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      setError("Could not delete that listing. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="page-status">Loading your listings...</p>;

  return (
    <main className="container view-listings-page">
      <h1 className="page-heading">My Hotel List</h1>

      {error && <p className="form-error">{error}</p>}

      {!loading && listings.length === 0 && !error && (
        <p className="page-status">
          You have not created any listings yet. Use Create Listing to add your first one.
        </p>
      )}

      <div className="listings-list">
        {listings.map((listing) => (
          <div key={listing._id} className="listing-row">
            <img
              src={resolveImage(listing.images && listing.images[0])}
              alt={`Photo of ${listing.title}`}
              className="listing-row__image"
            />

            <div className="listing-row__body">
              <p className="listing-row__eyebrow">
                {listing.bedrooms} Room Bedroom &middot; {listing.type} in {listing.location}
              </p>
              <h3>{listing.title}</h3>
              <hr />
              <p className="listing-row__meta">
                {listing.guests} guests &middot; {listing.type} &middot; {listing.bedrooms} beds
                &middot; {listing.bathrooms} bath
              </p>
              <p className="listing-row__amenities">
                {listing.amenities.slice(0, 3).join(" \u00b7 ")}
              </p>
              <p className="listing-row__rating">
                {listing.rating.toFixed(1)} &#9733; ({listing.reviews} reviews)
              </p>
            </div>

            <div className="listing-row__side">
              <p className="listing-row__price">
                ${listing.price} <span>/night</span>
              </p>
              <button
                className="btn btn-update listing-row__btn"
                onClick={() => navigate(`/listings/${listing._id}/edit`)}
              >
                Update
              </button>
              <button
                className="btn btn-primary listing-row__btn"
                onClick={() => handleDelete(listing._id)}
                disabled={deletingId === listing._id}
              >
                {deletingId === listing._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
