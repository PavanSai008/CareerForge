import { Link } from "wouter";
import Icon from "./Icon";

const FOOTER_LINKS = [
  "About",
  "Blog",
  "Careers",
  "Privacy",
  "Terms",
  "Contact",
];

export default function Footer() {
  return (
    <footer className="pf-footer">
      <div className="footer-inner">
        <Link href="/" className="footer-logo">
          <div className="footer-logo-icon">
            <Icon icon="lucide:zap" size={13} color="#fff" />
          </div>
          CareerForge
        </Link>

        <ul className="footer-links">
          {FOOTER_LINKS.map((link) => (
            <li key={link}>
              <a href="#">{link}</a>
            </li>
          ))}
        </ul>

        <div className="footer-copy">
          &copy; 2026 CareerForge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
