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
  "Try hosting": "http://localhost:5174/login",
  "AirCover: protection for Hosts": "https://www.airbnb.com/aircover",
  Newsroom: "https://news.airbnb.com/",
  Careers: "https://careers.airbnb.com/",
};

export default function Footer() {
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

      <div className="site-footer__bottom container">
        <p>&copy; {new Date().getFullYear()} Airbnb Clone, Inc. &middot; Privacy &middot; Terms &middot; Sitemap</p>
        <div className="site-footer__meta">
          <span>English (US)</span>
          <span>R ZAR</span>
          <Icon name="search" size={16} />
        </div>
      </div>
    </footer>
  );
}
