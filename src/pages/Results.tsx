import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import type { CareerAnalysis } from '@/lib/api';
import { getActiveCareerAnalysis } from '@/lib/careerStore';
import Roadmap from '@/components/Roadmap';
import Icon from '@/components/Icon';
import Footer from '@/components/Footer';

function MatchScoreRing({ score }: { score: number }) {
  const r = 46;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;

  return (
    <div className="results-score-ring">
      <svg
        width="112"
        height="112"
        viewBox="0 0 112 112"
        style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
      >
        <circle cx="56" cy="56" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ - filled}`}
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c6fff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ textAlign: 'center', position: 'relative' }}>
        <p className="results-score-value">{score}%</p>
        <p className="results-score-sub">match</p>
      </div>
    </div>
  );
}

export default function Results() {
  const [, setLocation] = useLocation();
  const [careerData, setCareerData] = useState<CareerAnalysis | null | undefined>(undefined);

  useEffect(() => {
    setCareerData(getActiveCareerAnalysis());
  }, []);

  useEffect(() => {
    if (careerData === null) setLocation('/');
  }, [careerData, setLocation]);

  if (!careerData) return null;

  const {
    sourceType,
    careerRole,
    tagline,
    matchScore,
    emoji,
    whyThisFits,
    personalityType,
    traits = [],
    roadmap = [],
    switchPaths = [],
    topCompanies = [],
    salaryRange,
    certifications = [],
  } = careerData;

  const isManualResult = sourceType === 'manual';

  return (
    <>
      <div className="pf-results-page">
        <div className="pf-results-glow-1" />
        <div className="pf-results-glow-2" />

        <div className="pf-results-container">
          <div className="results-hero-card animate-fade-slide-up">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div className="results-match-label">Your Learning Path</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 48 }}>{emoji}</span>
                  <h1 className="results-role-title">{careerRole}</h1>
                </div>
                <p className="results-tagline">{tagline}</p>
                <div className="results-traits">
                  {traits.map((t) => (
                    <span key={t} className="results-trait">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {!isManualResult && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <MatchScoreRing score={matchScore || 85} />
                  {personalityType && <span className="results-personality">{personalityType}</span>}
                </div>
              )}
              {isManualResult && personalityType && (
                <span className="results-personality">{personalityType}</span>
              )}
            </div>
          </div>

          <div className="pf-card animate-fade-slide-up" style={{ marginBottom: 20, padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Icon icon="lucide:lightbulb" size={20} color="var(--warning)" />
              <h2 style={{ fontSize: 17, fontWeight: 700 }}>Why This Fits You</h2>
            </div>
            <p style={{ color: 'var(--secondary-foreground)', fontSize: 14, lineHeight: 1.75 }}>
              {whyThisFits}
            </p>
          </div>

          <div className="results-info-grid">
            <div className="results-info-card">
              <h3>
                <Icon icon="lucide:banknote" size={12} style={{ marginRight: 6 }} />
                Salary Range
              </h3>
              <p className="value">{salaryRange}</p>
              <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4 }}>
                India market (fresher–5yr)
              </p>
            </div>

            <div className="results-info-card">
              <h3>
                <Icon icon="lucide:building-2" size={12} style={{ marginRight: 6 }} />
                Top Opportunities
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {topCompanies.map((c) => (
                  <span key={c} className="results-chip">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {certifications.length > 0 && (
            <div className="results-info-card" style={{ marginBottom: 32 }}>
              <h3>
                <Icon icon="lucide:graduation-cap" size={12} style={{ marginRight: 6 }} />
                Recommended Certifications
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {certifications.map((c) => (
                  <span key={c} className="results-chip results-cert-chip">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="results-section-header">
            <div className="results-roadmap-badge">
              <Icon icon="lucide:map" size={12} />
              Your 24-Month Roadmap
            </div>
            <h2 className="section-title" style={{ maxWidth: '100%', margin: '0 auto 12px' }}>
              Step-by-Step Path
            </h2>
            <p className="section-sub" style={{ margin: '0 auto', marginBottom: 0, textAlign: 'center' }}>
              Follow these phases in order. Optional branch nodes show related skills you can explore
              if your interests expand.
            </p>
          </div>

          <div className="pf-roadmap">
            <Roadmap roadmap={roadmap} switchPaths={switchPaths} />
          </div>

          {switchPaths.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  textAlign: 'center',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Icon icon="lucide:git-branch" size={20} color="var(--destructive)" />
                Future Career Switches
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16,
                }}
              >
                {switchPaths.map((sp) => (
                  <div key={sp.role} className="switch-path-card">
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{sp.emoji}</div>
                    <h4>{sp.role}</h4>
                    <p>{sp.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {sp.additionalSkills.slice(0, 3).map((s) => (
                        <span key={s} className="switch-skill-chip">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="results-actions">
            <Link href="/start" className="btn-hero-secondary">
              <Icon icon="lucide:rotate-ccw" size={16} />
              Create Another Path
            </Link>
            <button type="button" className="btn-hero-primary" onClick={() => window.print()}>
              <Icon icon="lucide:printer" size={18} color="#fff" />
              Save / Print Roadmap
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
