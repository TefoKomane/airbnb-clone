import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import "./ViewListings.css";
import { formatCurrency } from "../../utils/currency.js";

// resolves an image path the same way the client app does, so uploaded
// files and plain external URLs both render correctly
const resolveImage = (path) => {
  if (!path) {
    return "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80";
  }
  if (path.startsWith("/uploads")) {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    return `${apiUrl.replace(/\/api\/?$/, "")}${path}`;
  }
  return path;
};

export default function ViewListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [reloadKey, setReloadKey] = useState(0);
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
  }, [reloadKey]);

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

  const visibleListings = listings
    .filter((listing) => `${listing.title} ${listing.location}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  const portfolioValue = listings.reduce((total, listing) => total + Number(listing.price || 0), 0);

  return (
    <main className="container view-listings-page">
      <h1 className="page-heading">My Hotel List</h1>

      <div className="listing-stats">
        <div><strong>{listings.length}</strong><span>Active listings</span></div>
        <div><strong>{listings.reduce((total, listing) => total + Number(listing.guests || 0), 0)}</strong><span>Total guest capacity</span></div>
        <div><strong>{formatCurrency(portfolioValue)}</strong><span>Combined nightly rate</span></div>
      </div>

      <div className="listing-tools">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your listings" aria-label="Search your listings" />
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort listings">
          <option value="newest">Newest first</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
        <button className="btn btn-outline" type="button" onClick={() => setReloadKey((key) => key + 1)}>Refresh</button>
      </div>

      {error && <p className="form-error">{error}</p>}

      {!loading && listings.length === 0 && !error && (
        <p className="page-status">
          You have not created any listings yet. Use Create Listing to add your first one.
        </p>
      )}

      <div className="listings-list">
        {visibleListings.map((listing) => (
          <div key={listing._id} className="listing-row">
            <img
              src={resolveImage(listing.images && listing.images[0])}
              alt={`Photo of ${listing.title}`}
              className="listing-row__image"
              onError={(event) => {
                event.currentTarget.src = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80";
              }}
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
                {formatCurrency(listing.price)} <span>/night</span>
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
        {listings.length > 0 && visibleListings.length === 0 && (
          <p className="page-status">No listings match “{search}”. Clear the search to see your full portfolio.</p>
        )}
      </div>
    </main>
  );
}
