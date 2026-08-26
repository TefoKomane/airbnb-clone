import { useState } from "react";
import "./ListingForm.css";

// shared form used by both the Create Listing page and the Update Listing page
// Update passes in "initialValues" to pre-fill every field, Create leaves it empty
const emptyValues = {
  title: "",
  type: "",
  location: "",
  description: "",
  guests: 1,
  bedrooms: 1,
  bathrooms: 1,
  price: "",
  weeklyDiscount: 0,
  cleaningFee: 0,
  serviceFee: 0,
  occupancyTaxes: 0,
  amenities: "",
  enhancedCleaning: false,
  selfCheckIn: false,
};

export default function ListingForm({ initialValues, onSubmit, submitting, submitLabel }) {
  const [values, setValues] = useState({ ...emptyValues, ...initialValues });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    setImages(Array.from(event.target.files));
  };

  const validate = () => {
    const newErrors = {};
    if (!values.title || values.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }
    if (!values.type) {
      newErrors.type = "Please choose a property type.";
    }
    if (!values.location || values.location.trim().length < 2) {
      newErrors.location = "Please enter a location.";
    }
    if (!values.description || values.description.trim().length < 20) {
      newErrors.description = "Description should be at least 20 characters.";
    }
    if (!values.price || Number(values.price) <= 0) {
      newErrors.price = "Please enter a price greater than 0.";
    }
    if (!values.guests || Number(values.guests) < 1) {
      newErrors.guests = "Guests must be at least 1.";
    }
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    images.forEach((file) => {
      formData.append("images", file);
    });

    onSubmit(formData);
  };

  return (
    <form className="listing-form" onSubmit={handleSubmit} noValidate>
      <div className="listing-form__grid">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={values.title} onChange={handleChange} />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="type">Property type</label>
          <select id="type" name="type" value={values.type} onChange={handleChange}>
            <option value="">Select a type</option>
            <option value="Entire home">Entire home</option>
            <option value="Entire apartment">Entire apartment</option>
            <option value="Entire rental unit">Entire rental unit</option>
            <option value="Private room">Private room</option>
            <option value="Shared room">Shared room</option>
          </select>
          {errors.type && <p className="form-error">{errors.type}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input id="location" name="location" value={values.location} onChange={handleChange} />
          {errors.location && <p className="form-error">{errors.location}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Price per night ($)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            value={values.price}
            onChange={handleChange}
          />
          {errors.price && <p className="form-error">{errors.price}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="guests">Guests</label>
          <input
            id="guests"
            name="guests"
            type="number"
            min="1"
            value={values.guests}
            onChange={handleChange}
          />
          {errors.guests && <p className="form-error">{errors.guests}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="bedrooms">Bedrooms</label>
          <input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min="0"
            value={values.bedrooms}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bathrooms">Bathrooms</label>
          <input
            id="bathrooms"
            name="bathrooms"
            type="number"
            min="0"
            value={values.bathrooms}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="weeklyDiscount">Weekly discount ($)</label>
          <input
            id="weeklyDiscount"
            name="weeklyDiscount"
            type="number"
            min="0"
            value={values.weeklyDiscount}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cleaningFee">Cleaning fee ($)</label>
          <input
            id="cleaningFee"
            name="cleaningFee"
            type="number"
            min="0"
            value={values.cleaningFee}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="serviceFee">Service fee ($)</label>
