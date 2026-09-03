import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Icon from "../Icon/Icon.jsx";
import { formatCurrency } from "../../utils/currency.js";
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

  const image =
    images && images.length > 0
      ? images[0].startsWith("/uploads")
        ? `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${images[0]}`
        : images[0]
      : "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80";

  return (
    <article className="location-card" onClick={() => navigate(`/listing/${_id}`)}>
      <div className="location-card__image-wrap">
        <img src={image} alt={`Photo of ${title}`} />
      </div>

      <div className="location-card__body">
        <div>
          <p className="location-card__eyebrow">
            {type} in {location}
          </p>
          <h3 className="location-card__title">{title}</h3>
          <hr />
          <p className="location-card__meta">
            {guests} guests &middot; {type} &middot; {bedrooms} beds &middot; {bathrooms} bath
          </p>
          <p className="location-card__amenities">{amenities.slice(0, 3).join(" \u00b7 ")}</p>
          <p className="location-card__rating">
            <Icon name="star" size={14} color="#FF385C" filled /> {rating.toFixed(1)}{" "}
            <span>({reviews} reviews)</span>
          </p>
        </div>
      </div>

      <div className="location-card__side">
        <button
          className="location-card__heart"
          onClick={(e) => {
            e.stopPropagation();
            setSaved((s) => !s);
          }}
          aria-label={saved ? "Remove from saved" : "Save this listing"}
        >
          <Icon name="heart" size={20} color={saved ? "#FF385C" : "#222"} filled={saved} />
        </button>
        <p className="location-card__price">
          {formatCurrency(price)} <span>/night</span>
        </p>
      </div>
    </article>
  );
}
