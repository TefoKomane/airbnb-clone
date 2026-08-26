import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Icon from "../../components/Icon/Icon.jsx";
import "./Reservations.css";

// shows every reservation the logged in guest has made
// reachable from the profile dropdown in the header
export default function Reservations() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchReservations = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/reservations/user");
        setReservations(data);
      } catch (err) {
        setError("Could not load your reservations right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user, navigate]);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await api.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError("Could not cancel that reservation. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  if (loading) return <p className="page-status">Loading your reservations...</p>;

  return (
    <main className="container reservations-page">
      <h1>My Reservations</h1>

      {error && <p className="form-error">{error}</p>}

      {!loading && reservations.length === 0 && !error && (
        <p className="page-status">
          You have not made any reservations yet.{" "}
          <Link to="/search">Start exploring stays</Link>
        </p>
      )}

      {reservations.length > 0 && (
        <div className="reservations-table-wrap">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Check in</th>
                <th>Check out</th>
                <th>Total</th>
