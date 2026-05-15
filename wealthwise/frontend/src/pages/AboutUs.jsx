import { Link } from "react-router-dom";
import "../styles/AboutUs.css";

/* ── SVG Icons ── */

const GithubIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
);

const LinkedinIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const EmailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const LogoMini = () => (
    <svg width="13" height="13" viewBox="0 0 22 22" fill="none">
        <polyline points="2,16 7,10 11,13 16,6 20,8" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="16,6 20,6 20,10" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ── Data ── */

const features = [
    { icon: "📊", title: "SIP Tracking", desc: "Monitor all your SIP investments in real-time with NAV updates, unit tracking, and return calculations." },
    { icon: "🔍", title: "Browse & Invest", desc: "Explore thousands of mutual funds across Equity, Debt, and Hybrid categories with risk ratings." },
    { icon: "📈", title: "Returns Estimator", desc: "Project your wealth growth with our interactive SIP and lumpsum calculator with visual charts." },
    { icon: "🎯", title: "Goal Planning", desc: "Set financial goals — a car, home, or retirement — and track exactly how your investments align." },
    { icon: "🔔", title: "Smart Alerts", desc: "Get notified about SIP due dates, market volatility, fund deactivations, and portfolio milestones." },
    { icon: "🗂️", title: "Transaction History", desc: "Complete audit trail of every lumpsum and SIP investment with fund-level breakdown and returns." },
];

const techStack = [
    { name: "React", role: "Frontend UI" },
    { name: "Spring Boot", role: "Framework" },
    { name: "MySQL", role: "Database" },
    { name: "Java", role: "Backend" },
    { name: "MFAPI", role: "Fund NAV Data" },
    { name: "JWT", role: "Auth" },
    { name: "Axios", role: "HTTP Client" },
];

const teamMembers = [
    {
        initials: "MM",
        name: "Mahevish Mulla",
        role: "Full Stack Developer",
        github: "https://github.com/mahevish-mulla/VTU_Intern_2026_Team9_Java.git",
        linkedin: "https://linkedin.com/in/mahevish-mulla",
        email: "mailto:mahevishmulla260@gmail.com",
    },

    {
        initials: "SK",
        name: "Shivshankar Kunchanur",
        role: "Backend Developer",
        github: "https://github.com/mahevish-mulla/VTU_Intern_2026_Team9_Java.git",
        linkedin: "https://www.linkedin.com/in/shivshankar-b-kunchanur/",
        email: "mailto:shivbk56@gmail.com",
    },

    {
        initials: "NP",
        name: "Nikhil Patil",
        role: "Backend Developer",
        github: "https://github.com/mahevish-mulla/VTU_Intern_2026_Team9_Java.git",
        linkedin: "https://www.linkedin.com/in/nikhilppatil",
        email: "mailto:nikhilpp2704@gmail.com",
    },

    {
        initials: "AP",
        name: "Abhishek Poojary",
        role: "Frontend Developer",
        github: "https://github.com/mahevish-mulla/VTU_Intern_2026_Team9_Java.git",
        linkedin: "https://www.linkedin.com/in/abhishek-poojary777",
        email: "mailto:abhishekpoojar69@gmail.com",
    },
    // Add more team members here
];

const changelog = [
    { version: "v1.0.0", date: "May 2026", note: "Initial release — Dashboard, Browse Funds, Transactions, Estimator, Goals, Notifications." },
    { version: "v0.9.0", date: "Apr 2026", note: "Added SIP due date notifications and market volatility alerts." },
    { version: "v0.8.0", date: "Mar 2026", note: "Goal tracking with linked investments, progress bars and target dates." },
    { version: "v0.7.0", date: "Feb 2026", note: "Returns Estimator with projected wealth growth charts for SIP and Lumpsum." },
];

/* ── Component ── */

export default function AboutUs() {
    return (
        <div className="about-page">

            {/* ════ Hero ════ */}
            <div className="about-hero">
                <div className="about-hero-glow" />

                <div className="about-hero-badge">
                    <LogoMini />
                    WealthWise · v1.0.0
                </div>

                <h1 className="about-hero-title">
                    Smart investing,<br />
                    <span>simplified.</span>
                </h1>

                <p className="about-hero-sub">
                    WealthWise is a full-stack SIP tracking and mutual fund management platform built
                    to help Indian investors manage, monitor, and grow their portfolios with clarity.
                </p>

                <div className="about-hero-actions">
                    <Link to="/dashboard" className="about-btn-primary">
                        Go to Dashboard →
                    </Link>
                    <a
                        href="https://github.com/your-username/wealthwise"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="about-btn-secondary"
                    >
                        <GithubIcon /> View on GitHub
                    </a>
                </div>
            </div>

            {/* ════ Content ════ */}
            <div className="about-content">

                {/* ── Features ── */}
                <section className="about-section">
                    <div className="about-section-label">Platform</div>
                    <h2 className="about-section-title">What WealthWise does</h2>
                    <div className="about-features-grid">
                        {features.map((f) => (
                            <div key={f.title} className="about-feature-card">
                                <div className="about-feature-icon">{f.icon}</div>
                                <div className="about-feature-title">{f.title}</div>
                                <p className="about-feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Disclaimer ── */}
                <div className="about-disclaimer">
                    <span className="about-disclaimer-icon">⚠️</span>
                    <p>
                        <strong>Disclaimer: </strong>
                        WealthWise is a portfolio project built for educational purposes. It is not SEBI
                        registered and does not provide financial advice. Mutual fund investments are subject
                        to market risk. Please consult a certified financial advisor before investing.
                    </p>
                </div>

                {/* ── Tech Stack ── */}
                <section className="about-section">
                    <div className="about-section-label">Engineering</div>
                    <h2 className="about-section-title">Built with</h2>
                    <div className="about-tech-grid">
                        {techStack.map((t) => (
                            <div key={t.name} className="about-tech-badge">
                                <span className="about-tech-name">{t.name}</span>
                                <span className="about-tech-role">{t.role}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Team ── */}
                <section id="team" className="about-section">
                    <div className="about-section-label">Team</div>
                    <h2 className="about-section-title">Who built this</h2>
                    <div className="about-team-grid">
                        {teamMembers.map((m) => (
                            <div key={m.name} className="about-team-card">
                                <div className="about-team-avatar">{m.initials}</div>
                                <div className="about-team-info">
                                    <div className="about-team-name">{m.name}</div>
                                    <div className="about-team-role">{m.role}</div>
                                    <div className="about-team-socials">
                                        <a href={m.github} className="about-team-social" target="_blank" rel="noopener noreferrer" aria-label="GitHub">   <GithubIcon />   </a>
                                        <a href={m.linkedin} className="about-team-social" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"> <LinkedinIcon /> </a>
                                        <a href={m.email} className="about-team-social" aria-label="Email">                                               <EmailIcon />    </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Changelog ── */}
                <section id="changelog" className="about-section about-section--last">
                    <div className="about-section-label">Changelog</div>
                    <h2 className="about-section-title">Release history</h2>
                    <div className="about-changelog">
                        {changelog.map((c, i) => (
                            <div
                                key={c.version}
                                className={`about-changelog-item${i === changelog.length - 1 ? " about-changelog-item--last" : ""}`}
                            >
                                <div className="about-changelog-meta">
                                    <span className="about-changelog-version">{c.version}</span>
                                    <span className="about-changelog-date">{c.date}</span>
                                </div>
                                <p className="about-changelog-note">{c.note}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
