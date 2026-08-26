import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import Login from "./pages/Login/Login.jsx";
import CreateListing from "./pages/CreateListing/CreateListing.jsx";
import ViewListings from "./pages/ViewListings/ViewListings.jsx";
import UpdateListing from "./pages/UpdateListing/UpdateListing.jsx";
import ViewReservations from "./pages/ViewReservations/ViewReservations.jsx";

// every page except login is wrapped in ProtectedRoute, so only a
// logged in host account can reach the actual dashboard pages
export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/listings"
          element={
            <ProtectedRoute>
              <ViewListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listings/new"
          element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listings/:id/edit"
          element={
            <ProtectedRoute>
              <UpdateListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <ProtectedRoute>
              <ViewReservations />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<ProtectedRoute><ViewListings /></ProtectedRoute>} />
      </Routes>
    </>
  );
}
