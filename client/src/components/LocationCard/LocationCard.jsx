import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Icon from "../Icon/Icon.jsx";
import { formatCurrency } from "../../utils/currency.js";
import { resolveImage } from "../../utils/images.js";
import "./LocationCard.css";

// used on the Location (search results) page
// image on the left, details on the right, matching the reviewed design
export default function LocationCard({ accommodation }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(() => {
    try {
      const savedListings = JSON.parse(localStorage.getItem("airbnbSavedListings") || "[]");
      return Array.isArray(savedListings) && savedListings.includes(accommodation._id);
    } catch {
      localStorage.removeItem("airbnbSavedListings");
      return false;
    }
  });

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

  const image = resolveImage(images?.[0], accommodation);

  return (
    <article className="location-card" role="link" tabIndex="0" onClick={() => navigate(`/listing/${_id}`)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigate(`/listing/${_id}`); }}>
      <div className="location-card__image-wrap">
        <img
          src={image}
          alt={`Photo of ${title}`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80";
          }}
        />
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
            setSaved((current) => {
              const next = !current;
              let savedListings = [];
              try {
                const parsed = JSON.parse(localStorage.getItem("airbnbSavedListings") || "[]");
                savedListings = Array.isArray(parsed) ? parsed : [];
              } catch {
                localStorage.removeItem("airbnbSavedListings");
              }
              const updated = next
                ? [...new Set([...savedListings, _id])]
                : savedListings.filter((id) => id !== _id);
              localStorage.setItem("airbnbSavedListings", JSON.stringify(updated));
              return next;
            });
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
