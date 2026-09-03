const imageSets = {
  "new york": [
    "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85",
  ],
  bordeaux: [
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85",
  ],
  johannesburg: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=1200&q=85",
  ],
  durban: [
    "https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85",
  ],
  default: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=1200&q=85",
  ],
};

const getSetForListing = (listing = {}) => {
  const text = `${listing.title || ""} ${listing.location || ""}`.toLowerCase();
  const key = Object.keys(imageSets).find((candidate) => candidate !== "default" && text.includes(candidate));
  return imageSets[key || "default"];
};

export const resolveImage = (path, listing) => {
  if (path && !path.startsWith("/images/")) {
    if (path.startsWith("/uploads")) {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      return `${apiUrl.replace(/\/api\/?$/, "")}${path}`;
    }
    return path;
  }

  const fallbackSet = getSetForListing(listing);
  if (path === "/images/sample-bordeaux.jpg") return imageSets.bordeaux[0];
  if (path === "/images/sample-sandton.jpg") return imageSets.johannesburg[0];
  return fallbackSet[0];
};

export const getListingImages = (listing = {}) => {
  const fallbackSet = getSetForListing(listing);
  const existingImages = Array.isArray(listing.images) ? listing.images : [];
  const usableImages = existingImages.map((image) => resolveImage(image, listing));
  return [...usableImages, ...fallbackSet]
    .filter((image, index, images) => images.indexOf(image) === index)
    .slice(0, 5);
};