import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Icon from "../Icon/Icon.jsx";
import "./LocationCard.css";

// used on the Location (search results) page
// image on the left, details on the right, matching the reviewed design
export default function LocationCard({ accommodation }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const {
    _id,
    title,
    type,
    location,
    guests,
    bedrooms,
    bathrooms,
    amenities,
    rating,
    reviews,
    price,
    images,
  } = accommodation;

