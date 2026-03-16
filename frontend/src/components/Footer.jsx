import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="ww-footer">
      <div className="f-left">
        <div className="logo">WealthWise</div>
        <p className="muted">Build better financial habits</p>
      </div>

      <div className="f-links">
        <a>About</a>
        <a>Docs</a>
        <a>Careers</a>
      </div>

      <div className="f-right">
        <div className="copyright">© {new Date().getFullYear()} WealthWise</div>
      </div>
    </footer>
  );
}
