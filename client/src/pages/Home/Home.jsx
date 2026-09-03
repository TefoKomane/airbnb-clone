import { useState } from "react";
import { useNavigate } from "react-router-dom";
import inspirationData from "../../data/inspirationData.js";
import experiencesData from "../../data/experiencesData.js";
import futureGetaways from "../../data/futureGetaways.js";
import Footer from "../../components/Footer/Footer.jsx";
import Icon from "../../components/Icon/Icon.jsx";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const quickDestinations = ["Cape Town", "Johannesburg", "Durban", "New York"];

  const goToSearch = (location) => {
    navigate(`/search?location=${encodeURIComponent(location)}`);
  };

  return (
    <main>
      {/* Hero Banner */}
      <section className="hero">
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1>Not sure where to go? Perfect.</h1>
          <button className="btn hero__cta" onClick={() => goToSearch("")}>
            I&apos;m flexible
          </button>
          <div className="hero__chips" aria-label="Popular destinations">
            {quickDestinations.map((destination) => (
              <button key={destination} onClick={() => goToSearch(destination)}>{destination}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        {/* Inspiration for your next trip */}
        <section className="section">
          <h2>Inspiration for your next trip</h2>
          <div className="inspiration-grid">
            {inspirationData.map((item) => (
              <button
                key={item.id}
                className="inspiration-card"
                style={{
                  backgroundColor: item.color,
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, .12), rgba(0, 0, 0, .32)), url(${item.image})`,
                }}
                onClick={() => goToSearch(item.title.split(" ")[0])}
              >
                <div className="inspiration-card__image" />
                <div className="inspiration-card__text">
                  <p className="inspiration-card__title">{item.title}</p>
                  <p className="inspiration-card__subtitle">{item.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Discover Airbnb Experiences */}
        <section className="section">
          <h2>Discover Airbnb Experiences</h2>
          <div className="experiences-grid">
            {experiencesData.map((item) => (
              <div
                key={item.id}
                className="experience-card"
                style={{
                  backgroundColor: item.color,
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, .18), rgba(0, 0, 0, .45)), url(${item.image})`,
                }}
              >
                <h3>{item.title}</h3>
                <button className="btn btn-outline experience-card__btn" onClick={() => goToSearch("")}>
                  {item.buttonLabel}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ShopAirbnb Section */}
        <section className="section shop-section">
          <div className="shop-section__text">
            <h2>Shop Airbnb gift cards</h2>
            <button className="btn btn-dark" onClick={() => window.open("https://www.airbnb.com/giftcards", "_blank", "noopener,noreferrer")}>Learn more</button>
          </div>
          <div className="shop-section__cards">
            <div className="shop-card shop-card--1" />
            <div className="shop-card shop-card--2">
              <img src="/airbnb-logo.jfif" alt="Airbnb gift card logo" />
            </div>
            <div className="shop-card shop-card--3" />
          </div>
        </section>

        {/* Questions about hosting banner */}
        <section className="section hosting-banner">
          <div className="hosting-banner__overlay" />
          <div className="hosting-banner__content">
            <h2>Questions about hosting?</h2>
            <button className="btn hosting-banner__btn" onClick={() => window.open("http://localhost:5174/login", "_blank", "noopener,noreferrer")}>Ask a Superhost</button>
          </div>
        </section>

        {/* Inspiration for future getaways, tabbed section */}
        <section className="section">
          <h2>Inspiration for future getaways</h2>
          <div className="getaway-tabs" role="tablist">
            {futureGetaways.tabs.map((tab, index) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === index}
                className={`getaway-tab ${activeTab === index ? "getaway-tab--active" : ""}`}
                onClick={() => setActiveTab(index)}
              >
                {tab}
              </button>
            ))}
          </div>

          <ul className="getaway-list">
              {futureGetaways.destinations[activeTab].slice(0, showAllDestinations ? undefined : 4).map((place) => (
                <li key={place.city}>
                  <button onClick={() => goToSearch(place.city)}>
                    <span className="getaway-list__city">{place.city}</span>
                    <span className="getaway-list__region">{place.region}</span>
                  </button>
                </li>
              ))}
              <li>
                <button className="getaway-list__more" onClick={() => setShowAllDestinations((visible) => !visible)}>
                  {showAllDestinations ? "Show less" : "Show more"}
                </button>
              </li>
            </ul>
        </section>
      </div>

      <Footer />
    </main>
  );
}
