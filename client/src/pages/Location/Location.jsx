import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios.js";
import LocationCard from "../../components/LocationCard/LocationCard.jsx";
import "./Location.css";

export default function Location() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLocation = searchParams.get("location") || "";
  const initialType = searchParams.get("type") || "";
  const initialMaxPrice = searchParams.get("maxPrice") || "";
  const initialGuests = searchParams.get("guests") || "";

  const [locationInput, setLocationInput] = useState(initialLocation);
  const [type, setType] = useState(initialType);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [guests, setGuests] = useState(initialGuests);
  const [sortBy, setSortBy] = useState("recommended");
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccommodations = async () => {
      setLoading(true);
      setError("");
      try {
        const currentLocation = searchParams.get("location") || "";
        const { data } = await api.get("/accommodations", {
          params: currentLocation ? { location: currentLocation } : {},
        });
        const currentType = searchParams.get("type") || "";
        const currentMaxPrice = Number(searchParams.get("maxPrice")) || 0;
        const currentGuests = Number(searchParams.get("guests")) || 0;
        setAccommodations(data.filter((item) =>
          (!currentType || item.type === currentType) &&
          (!currentMaxPrice || item.price <= currentMaxPrice) &&
          (!currentGuests || item.guests >= currentGuests)
        ));
      } catch (err) {
        setError("Could not load listings right now. Please try again shortly.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, [searchParams]);

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    const nextParams = {};
    if (locationInput) nextParams.location = locationInput;
    if (type) nextParams.type = type;
    if (maxPrice) nextParams.maxPrice = maxPrice;
    if (guests) nextParams.guests = guests;
    setSearchParams(nextParams);
  };

  const activeLocation = searchParams.get("location");

  return (
    <main className="container location-page">
      <form className="location-filter" onSubmit={handleFilterSubmit}>
        <label htmlFor="locationFilter">Location</label>
        <input
          id="locationFilter"
          type="text"
          placeholder="Search by location, e.g. New York"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Property type">
          <option value="">Any type</option>
          <option value="Entire home">Entire home</option>
          <option value="Entire apartment">Entire apartment</option>
          <option value="Entire rental unit">Entire rental unit</option>
          <option value="Private room">Private room</option>
        </select>
        <input
          type="number"
          min="0"
          placeholder="Max price (USD)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          aria-label="Maximum price"
        />
        <input
          type="number"
          min="1"
          placeholder="Guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          aria-label="Minimum guests"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      <h1 className="location-page__heading">
        {loading
          ? "Searching..."
          : `${accommodations.length}+ stays${activeLocation ? ` in ${activeLocation}` : ""}`}
      </h1>

      {!loading && accommodations.length > 0 && (
        <label className="location-sort">
          Sort by
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      )}

      {error && <p className="form-error">{error}</p>}

      {!loading && accommodations.length === 0 && !error && (
        <p className="page-status">
          No stays matched that search. Try a different location.
        </p>
      )}

      <div className="location-page__list">
        {[...accommodations].sort((a, b) => {
          if (sortBy === "price-low") return a.price - b.price;
          if (sortBy === "price-high") return b.price - a.price;
          if (sortBy === "rating") return b.rating - a.rating;
          return 0;
        }).map((item) => (
          <LocationCard key={item._id} accommodation={item} />
        ))}
      </div>
    </main>
  );
}
