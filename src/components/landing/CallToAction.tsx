import { Link } from "wouter";
import Icon from "../Icon";

export default function CallToAction() {
  return (
    <section id="cta" className="pf-cta">
      <div className="cta-grid-bg" />
      <div className="cta-glow" />
      <h2>
        Your next chapter
        <br />
        <span className="hero-gradient-text">starts with one step</span>
      </h2>
      <p className="cta-desc">
        Tell CareerForge where you want to go, and we&apos;ll help you figure
        out how to get there.
      </p>
      <div className="cta-actions">
        <Link href="/start" className="btn-hero-primary">
          Start Forging Your Path
          <Icon icon="lucide:arrow-right" size={18} color="#fff" />
        </Link>
      </div>
      <div className="cta-note">
        Personalized guidance for your goals, your pace, and your path.
      </div>
    </section>
  );
}
