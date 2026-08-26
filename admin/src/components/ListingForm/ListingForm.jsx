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
