import { useState, useEffect } from "react";
import api from "../../api/axios.js";
import { formatCurrency } from "../../utils/currency.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "./ViewReservations.css";

// shows every reservation made across all listings owned by the logged in host
// matches the "My Reservations" table from the reviewed design
export default function ViewReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [propertyFilter, setPropertyFilter] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const { logout } = useAuth();

  const exportReservations = () => {
    const rows = [["Guest", "Property", "Check in", "Check out", "Total"], ...reservations.map((reservation) => [reservation.guest?.username || "Guest", reservation.accommodation?.title || "Listing removed", reservation.checkIn, reservation.checkOut, reservation.totalPrice])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "airbnb-reservations.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/reservations/host");
        setReservations(data);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          setError("Your session has expired. Please log in again.");
        } else {
          setError(err.response?.data?.message || "Could not load reservations right now.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [reloadKey]);

  const visibleReservations = reservations.filter((reservation) => !propertyFilter || reservation.accommodation?._id === propertyFilter);
  const reservationRevenue = reservations.reduce((total, reservation) => total + Number(reservation.totalPrice || 0), 0);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this reservation?");
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await api.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError("Could not delete that reservation.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-GB");

  if (loading) return <p className="page-status">Loading reservations...</p>;

  return (
    <main className="container view-reservations-page">
      <h1 className="page-heading">My Reservations</h1>
      <div className="reservation-tools">
        <button className="btn btn-outline" onClick={() => setReloadKey((key) => key + 1)}>Refresh</button>
        <button className="btn btn-primary" onClick={exportReservations} disabled={reservations.length === 0}>Export CSV</button>
        <select value={propertyFilter} onChange={(event) => setPropertyFilter(event.target.value)} aria-label="Filter reservations by property">
          <option value="">All properties</option>
          {[...new Map(reservations.map((reservation) => [reservation.accommodation?._id, reservation.accommodation?.title])).entries()].filter(([id]) => id).map(([id, title]) => <option key={id} value={id}>{title}</option>)}
        </select>
      </div>

      <p className="reservation-summary">{reservations.length} booking{reservations.length === 1 ? "" : "s"} · {formatCurrency(reservationRevenue)} booked revenue</p>

      {error && <p className="form-error">{error}</p>}

      {!loading && reservations.length === 0 && !error && (
        <p className="page-status">No reservations have been made on your listings yet.</p>
      )}

      {reservations.length > 0 && (
        <div className="reservations-table-wrap">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Booked by</th>
                <th>Property</th>
                <th>Checkin</th>
                <th>Checkout</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleReservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>{reservation.guest?.username || "Guest"}</td>
                  <td>{reservation.accommodation?.title || "Listing removed"}</td>
                  <td>{formatDate(reservation.checkIn)}</td>
                  <td>{formatDate(reservation.checkOut)}</td>
                  <td>{formatCurrency(reservation.totalPrice)}</td>
                  <td>
                    <button
                      className="btn btn-primary reservations-table__delete"
                      onClick={() => handleDelete(reservation._id)}
                      disabled={deletingId === reservation._id}
                    >
                      {deletingId === reservation._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
