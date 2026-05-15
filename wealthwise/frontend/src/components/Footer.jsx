import { Link } from "react-router-dom";
import "../styles/Footer.css";

const GithubIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const EmailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const LogoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
    <polyline points="2,16 7,10 11,13 16,6 20,8" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="16,6 20,6 20,10" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const productLinks = [
  { label: "Dashboard", to: "/dashboard?tab=dashboard" },
  { label: "Browse Funds", to: "/dashboard?tab=browse" },
  { label: "Transactions", to: "/dashboard?tab=investments" },
  { label: "Returns Estimator", to: "/dashboard?tab=estimator" },
  { label: "Goals", to: "/dashboard?tab=goals" },
];

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Our Team", to: "/about#team" },
  { label: "Contact Us", href: "mailto:support@wealthwise.in" },
  { label: "GitHub Repo", href: "https://github.com/mahevish-mulla/VTU_Intern_2026_Team9_Java.git" },
];

const legalLinks = [
  { label: "Terms of Service", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Cookie Policy", to: "/privacy#cookies" },
  { label: "Disclaimer", to: "/terms#disclaimer" },
];

const socials = [
  { icon: <GithubIcon />, href: "https://github.com/mahevish-mulla/VTU_Intern_2026_Team9_Java.git", label: "GitHub" },
  { icon: <LinkedinIcon />, href: "https://linkedin.com/in/mahevish-mulla", label: "LinkedIn" },
  { icon: <EmailIcon />, href: "mailto:support@wealthwise.in", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="ww-footer">
      <div className="ww-footer-inner">

        {/* ── Brand Column ── */}
        <div className="ww-footer-brand">
          <div className="ww-footer-logo">
            <LogoIcon />
            <span>Wealth<em>Wise</em></span>
          </div>
          <p className="ww-footer-tagline">
            India's smart SIP tracker and mutual fund management platform.
            Invest with clarity, grow with confidence.
          </p>
          <div className="ww-footer-contact-info" style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Email Row */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ color: "#f59e0b", display: "flex" }}><EmailIcon /></span>
              <a 
                href="mailto:support@wealthwise.in" 
                style={{ 
                  color: "#f59e0b", 
                  textDecoration: "none", 
                  fontSize: "15px",
                  fontWeight: "500",
                  fontFamily: "var(--font-m, 'Inter', sans-serif)"
                }}
              >
                support@wealthwise.in
              </a>
            </div>

            {/* Location Row */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ color: "#f59e0b", display: "flex" }}><LocationIcon /></span>
              <span style={{ 
                color: "rgba(255, 255, 255, 0.45)", 
                fontSize: "15px",
                letterSpacing: "0.2px"
              }}>
                Bengaluru,&nbsp;&nbsp; Karnataka,&nbsp;&nbsp; India
              </span>
            </div>

            {/* Socials below contact info */}
            <div className="ww-footer-socials" style={{ marginTop: "8px", display: "flex", gap: "12px" }}>
              {socials.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="ww-social-btn"
                  style={{ 
                    width: "42px", 
                    height: "42px", 
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)"
                  }}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Link Columns ── */}
        <FooterCol title="Product" links={productLinks} />
        <FooterCol title="Company" links={companyLinks} />
        <FooterCol title="Legal" links={legalLinks} />

      </div>

      {/* ── Bottom Bar ── */}
      <div className="ww-footer-bottom">
        <span className="ww-footer-copy">
          © {new Date().getFullYear()} The WealthWise Team · All rights reserved
        </span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div className="ww-footer-col">
      <div className="ww-footer-col-title">{title}</div>
      {links.map(({ label, to, href }) =>
        href ? (
          <a
            key={label}
            href={href}
            className="ww-footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {label} ↗
          </a>
        ) : (
          <Link key={label} to={to} className="ww-footer-link">
            {label}
          </Link>
        )
      )}
    </div>
  );
}
