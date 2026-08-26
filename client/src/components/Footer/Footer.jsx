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

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__columns">
        {linkColumns.map((column) => (
