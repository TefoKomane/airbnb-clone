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

