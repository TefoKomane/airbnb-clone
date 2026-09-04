import { useState } from "react";
import Icon from "../Icon/Icon.jsx";
import "./Footer.css";

// static footer matching the four column layout from the design brief
const linkColumns = [
  {
    heading: "Support",
    links: [
      "Help Center",
      "Safety information",
      "Cancellation options",
      "Our COVID-19 Response",
      "Supporting people with disabilities",
      "Report a neighborhood concern",
    ],
  },
  {
    heading: "Community",
    links: [
      "Airbnb.org: disaster relief housing",
      "Support: Afghan refugees",
      "Celebrating diversity & belonging",
      "Combating discrimination",
    ],
  },
  {
    heading: "Hosting",
    links: [
      "Try hosting",
      "AirCover: protection for Hosts",
      "Explore hosting resources",
      "Visit our community forum",
      "How to host responsibly",
    ],
  },
  {
    heading: "About",
    links: [
      "Newsroom",
      "Learn about new features",
      "Letter from our founders",
      "Careers",
      "Investors",
      "Airbnb Luxe",
    ],
  },
];

const footerUrls = {
  "Help Center": "https://www.airbnb.com/help",
  "Safety information": "https://www.airbnb.com/help/article/3066",
  "Cancellation options": "https://www.airbnb.com/help/article/149",
  "Try hosting": "https://airbnb-clone-qw8t.vercel.app/login",
  "AirCover: protection for Hosts": "https://www.airbnb.com/aircover",
  Newsroom: "https://news.airbnb.com/",
  Careers: "https://careers.airbnb.com/",
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (email.includes("@")) setSubscribed(true);
  };

  return (
    <footer className="site-footer">
      <div className="container site-footer__columns">
        {linkColumns.map((column) => (
          <div key={column.heading}>
            <h4>{column.heading}</h4>
            <ul>
              {column.links.map((link) => (
                <li key={link}>
                  <a href={footerUrls[link] || "https://www.airbnb.com/help"} target="_blank" rel="noreferrer">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container site-footer__newsletter">
        <div>
          <h4>Stay in the know</h4>
          <p>Get destination inspiration and hosting news in your inbox.</p>
        </div>
        <form onSubmit={handleSubscribe}>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" aria-label="Email address" required />
          <button className="btn btn-primary" type="submit">{subscribed ? "Subscribed" : "Subscribe"}</button>
        </form>
      </div>

      <div className="site-footer__bottom container">
        <p>&copy; {new Date().getFullYear()} Airbnb Clone, Inc. &middot; Privacy &middot; Terms &middot; Sitemap</p>
        <div className="site-footer__meta">
          <span>English (US)</span>
          <span>R ZAR</span>
          <a href="https://www.facebook.com/airbnb" target="_blank" rel="noreferrer" aria-label="Facebook" className="site-footer__social">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.563 9.878v-6.988h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/></svg>
          </a>
          <a href="https://twitter.com/airbnb" target="_blank" rel="noreferrer" aria-label="Twitter / X" className="site-footer__social">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://www.instagram.com/airbnb" target="_blank" rel="noreferrer" aria-label="Instagram" className="site-footer__social">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          </a>
          <button className="site-footer__top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top</button>
        </div>
      </div>
    </footer>
  );
}
