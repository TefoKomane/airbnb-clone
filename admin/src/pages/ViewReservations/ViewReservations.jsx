import { useState, useEffect } from "react";
import api from "../../api/axios.js";
import "./ViewReservations.css";

// shows every reservation made across all listings owned by the logged in host
// matches the "My Reservations" table from the reviewed design
export default function ViewReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/reservations/host");
        setReservations(data);
      } catch (err) {
        setError("Could not load reservations right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this reservation?");
    if (!confirmed) return;

