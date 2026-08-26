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
