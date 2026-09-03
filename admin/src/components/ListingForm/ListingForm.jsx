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
  const [previews, setPreviews] = useState([]);
  const [imageNotice, setImageNotice] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const rejectedCount = files.filter((file) => file.size > 5 * 1024 * 1024).length;
    const selectedImages = files.filter((file) => file.size <= 5 * 1024 * 1024).slice(0, 10);
    setImageNotice(rejectedCount ? `${rejectedCount} image${rejectedCount === 1 ? "" : "s"} exceeded the 5 MB limit.` : "");
    setImages(selectedImages);
    setPreviews(selectedImages.map((file) => URL.createObjectURL(file)));
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
    ["bedrooms", "bathrooms", "weeklyDiscount", "cleaningFee", "serviceFee", "occupancyTaxes"].forEach((field) => {
      if (Number(values[field]) < 0) newErrors[field] = "Value cannot be negative.";
    });
    if (Number(values.weeklyDiscount) > Number(values.price || 0)) {
      newErrors.weeklyDiscount = "Discount cannot exceed the nightly price.";
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

  const resetForm = () => {
    setValues({ ...emptyValues, ...initialValues });
    setImages([]);
    setPreviews([]);
    setImageNotice("");
    setErrors({});
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
          <label htmlFor="price">Price per night (ZAR)</label>
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
          <label htmlFor="weeklyDiscount">Weekly discount (ZAR)</label>
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
          <label htmlFor="cleaningFee">Cleaning fee (ZAR)</label>
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
          <label htmlFor="serviceFee">Service fee (ZAR)</label>
          <input
            id="serviceFee"
            name="serviceFee"
            type="number"
            min="0"
            value={values.serviceFee}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="occupancyTaxes">Occupancy taxes and fees (ZAR)</label>
          <input
            id="occupancyTaxes"
            name="occupancyTaxes"
            type="number"
            min="0"
            value={values.occupancyTaxes}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={values.description}
          onChange={handleChange}
        />
        <p className="listing-form__hint">{values.description.length}/500 characters</p>
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="amenities">Amenities (comma separated)</label>
        <input
          id="amenities"
          name="amenities"
          placeholder="wifi, kitchen, free parking"
          value={values.amenities}
          onChange={handleChange}
        />
      </div>

      <div className="listing-form__checkboxes">
        <label className="listing-form__checkbox">
          <input
            type="checkbox"
            name="enhancedCleaning"
            checked={values.enhancedCleaning}
            onChange={handleChange}
          />
          Enhanced cleaning
        </label>
        <label className="listing-form__checkbox">
          <input
            type="checkbox"
            name="selfCheckIn"
            checked={values.selfCheckIn}
            onChange={handleChange}
          />
          Self check-in
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="images">Listing images</label>
        <input id="images" name="images" type="file" accept="image/*" multiple onChange={handleImageChange} />
        <p className="listing-form__hint">
          Optional. You can upload jpg, png or webp images, up to 5mb each.
        </p>
        {imageNotice && <p className="form-error">{imageNotice}</p>}
        {previews.length > 0 && (
          <div className="listing-form__previews">
            {previews.map((preview) => <img key={preview} src={preview} alt="Selected listing preview" />)}
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary listing-form__submit" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
      <button type="button" className="btn btn-outline" onClick={resetForm} disabled={submitting}>Reset form</button>
    </form>
  );
}
