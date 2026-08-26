import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios.js";
import LocationCard from "../../components/LocationCard/LocationCard.jsx";
import "./Location.css";

export default function Location() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLocation = searchParams.get("location") || "";

  const [locationInput, setLocationInput] = useState(initialLocation);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccommodations = async () => {
      setLoading(true);
      setError("");
      try {
        const currentLocation = searchParams.get("location") || "";
        const { data } = await api.get("/accommodations", {
          params: currentLocation ? { location: currentLocation } : {},
        });
        setAccommodations(data);
      } catch (err) {
        setError("Could not load listings right now. Please try again shortly.");
      } finally {
