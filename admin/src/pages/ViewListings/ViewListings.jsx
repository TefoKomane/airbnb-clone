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
