import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import ListingForm from "../../components/ListingForm/ListingForm.jsx";
import "./CreateListing.css";

export default function CreateListing() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    setError("");
    setSubmitting(true);
    try {
      await api.post("/accommodations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/listings");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create the listing.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container create-listing-page">
      <h1 className="page-heading">Create Listing</h1>
      {error && <p className="form-error">{error}</p>}
      <ListingForm onSubmit={handleCreate} submitting={submitting} submitLabel="Create Listing" />
    </main>
  );
}
