import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="ww-footer">
      <div className="ww-footer-inner">
        <div className="f-left">
          <div className="logo">
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
              <polyline points="2,16 7,10 11,13 16,6 20,8" stroke="#00e676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="16,6 20,6 20,10" stroke="#00e676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Wealth<em>Wise</em>
          </div>
          <p className="muted">Build better financial habits</p>
        </div>

        <div className="f-links">
          <a>About Us</a>
          <a>Documentation</a>
          <a>Terms</a>
        </div>

        <div className="f-right">
          <div className="copyright">© {new Date().getFullYear()} WealthWise Project</div>
        </div>
      </div>
    </footer>
  );
}
