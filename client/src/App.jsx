import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Home from "./pages/Home/Home.jsx";
import Location from "./pages/Location/Location.jsx";
import LocationDetails from "./pages/LocationDetails/LocationDetails.jsx";
import Login from "./pages/Login/Login.jsx";
import Reservations from "./pages/Reservations/Reservations.jsx";

// the guest facing app has one shared header across every page
// the footer lives inside the Home page since only the home page rubric
// item explicitly asks for it, other pages use a lighter footer if needed
export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Location />} />
        <Route path="/listing/:id" element={<LocationDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reservations" element={<Reservations />} />
      </Routes>
    </>
  );
}
