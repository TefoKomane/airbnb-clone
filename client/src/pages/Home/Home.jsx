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
                style={{ backgroundColor: item.color }}
                onClick={() => goToSearch(item.title.split(" ")[0])}
              >
                <div className="inspiration-card__image" />
                <div className="inspiration-card__text">
                  <p className="inspiration-card__title">{item.title}</p>
                  <p className="inspiration-card__subtitle">{item.subtitle}</p>
                </div>
              </button>
