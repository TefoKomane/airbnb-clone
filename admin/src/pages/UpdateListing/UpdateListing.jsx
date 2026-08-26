import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import ListingForm from "../../components/ListingForm/ListingForm.jsx";
import "./UpdateListing.css";

export default function UpdateListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/accommodations/${id}`);
        setListing(data);
      } catch (err) {
        setError("Could not load this listing.");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleUpdate = async (formData) => {
    setError("");
    setSubmitting(true);
    try {
      await api.put(`/accommodations/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/listings");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update the listing.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="page-status">Loading listing...</p>;
  if (error && !listing) return <p className="page-status">{error}</p>;
  if (!listing) return null;

  // the form component fills its fields from this object,
  // so the admin sees the existing listing data immediately, pre-filled
  const initialValues = {
    title: listing.title,
    type: listing.type,
    location: listing.location,
    description: listing.description,
    guests: listing.guests,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    price: listing.price,
    weeklyDiscount: listing.weeklyDiscount,
    cleaningFee: listing.cleaningFee,
    serviceFee: listing.serviceFee,
    occupancyTaxes: listing.occupancyTaxes,
    amenities: listing.amenities.join(", "),
    enhancedCleaning: listing.enhancedCleaning,
    selfCheckIn: listing.selfCheckIn,
  };

  return (
    <main className="container update-listing-page">
      <h1 className="page-heading">Update Listing</h1>
      {error && <p className="form-error">{error}</p>}
      <ListingForm
        initialValues={initialValues}
        onSubmit={handleUpdate}
        submitting={submitting}
        submitLabel="Save Changes"
      />
    </main>
  );
}
