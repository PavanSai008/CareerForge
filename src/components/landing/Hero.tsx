import { Link } from "wouter";
import Icon from "../Icon";

const VALUE_POINTS = [
  {
    number: "AI-Powered",
    label: "Personalized roadmaps built around your goals",
  },
  {
    number: "Any Career",
    label: "Explore paths across tech, business, design, healthcare, and more",
  },
  {
    number: "Actionable",
    label: "Turn goals into concrete learning steps and projects",
  },
  {
    number: "Your Pace",
    label: "Build a roadmap around your current skills and available time",
  },
];

export default function Hero() {
  return (
    <section className="pf-hero">
      <div className="hero-glow-1" />
      <div className="hero-glow-2" />
      <div className="hero-glow-3" />

      <div className="hero-badge">
        <div className="dot" />
        Built for ambitious learners across every field
      </div>

      <h1>
        Your Career.
        <br />
        <span className="hero-gradient-text">Your Path. Your Future.</span>
      </h1>

      <p className="hero-desc">
        CareerForge uses AI to turn your goals into a personalized roadmap,
        helping you discover what to learn, what to build, and what to do next,
        no matter where you want your career to take you.
      </p>

      <div className="hero-cta-group">
        <Link href="/start" className="btn-hero-primary">
          Start Your Path
          <Icon icon="lucide:arrow-right" size={18} color="#fff" />
        </Link>
        <a href="#how-it-works" className="btn-hero-secondary">
          <Icon
            icon="lucide:play"
            size={16}
            color="var(--secondary-foreground)"
          />
          See how it works
        </a>
      </div>
      {/* 
      <div className="hero-stats">
        {VALUE_POINTS.map((point, i) => (
          <div key={point.label} style={{ display: "contents" }}>
            {i > 0 && <div className="hero-divider" />}
            <div className="hero-stat">
              <div className="stat-number">{point.number}</div>
              <div className="stat-label">{point.label}</div>
            </div>
          </div>
        ))}
      </div> */}

      {/* <div className="hero-mockup">
        <img
          src="https://storage.googleapis.com/banani-generated-images/generated-images/1cd3e055-6ea4-453e-84c5-2e3d737c3e7d.jpg"
          alt="CareerForge dashboard preview showing personalized roadmaps and progress charts"
        />
        <div className="mockup-glow" />
      </div> */}
    </section>
  );
}
