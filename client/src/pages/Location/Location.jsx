import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios.js";
import LocationCard from "../../components/LocationCard/LocationCard.jsx";
import "./Location.css";

export default function Location() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLocation = searchParams.get("location") || "";

  const [locationInput, setLocationInput] = useState(initialLocation);
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
        setAccommodations(data);
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
    setSearchParams(locationInput ? { location: locationInput } : {});
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
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      <h1 className="location-page__heading">
        {loading
          ? "Searching..."
          : `${accommodations.length}+ stays${activeLocation ? ` in ${activeLocation}` : ""}`}
      </h1>

      {error && <p className="form-error">{error}</p>}

      {!loading && accommodations.length === 0 && !error && (
        <p className="page-status">
          No stays matched that search. Try a different location.
        </p>
      )}

      <div className="location-page__list">
        {accommodations.map((item) => (
          <LocationCard key={item._id} accommodation={item} />
        ))}
      </div>
    </main>
  );
}
