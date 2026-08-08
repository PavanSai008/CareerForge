import { Link, useLocation } from 'wouter';
import { useListCareerHistory } from '@/lib/api';
import { setActiveCareerAnalysis } from '@/lib/careerStore';
import Icon from '@/components/Icon';

export default function History() {
  const { data: history, isLoading } = useListCareerHistory();
  const [, setLocation] = useLocation();

  const handleView = (item: NonNullable<typeof history>[number]) => {
    setActiveCareerAnalysis(item);
    setLocation('/results');
  };

  return (
    <div className="pf-quiz-page">
      <div className="pf-quiz-glow" />

      <div className="pf-quiz-container">
        <div style={{ marginBottom: 32 }}>
          <div className="quiz-q-badge">
            <Icon icon="lucide:map" size={12} color="#a99fff" />
            History
          </div>
          <h1 className="section-title" style={{ maxWidth: '100%', marginBottom: 8 }}>
            Your past analyses
          </h1>
          <p style={{ color: 'var(--secondary-foreground)', fontSize: 14 }}>
            Revisit any career roadmap you've generated before.
          </p>
        </div>

        {isLoading && (
          <p style={{ color: 'var(--secondary-foreground)', fontSize: 14 }}>Loading…</p>
        )}

        {!isLoading && history?.length === 0 && (
          <div className="pf-card" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--secondary-foreground)', marginBottom: 16 }}>
              You haven&apos;t generated a roadmap yet.
            </p>
            <Link href="/start" className="btn-hero-primary" style={{ justifyContent: 'center' }}>
              Build your path
              <Icon icon="lucide:arrow-right" size={16} color="#fff" />
            </Link>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {history?.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleView(item)}
              className="pf-card"
              style={{ textAlign: 'left', cursor: 'pointer', width: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 32 }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)' }}>
                    {item.careerRole}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--secondary-foreground)', marginTop: 2 }}>
                    {item.tagline}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 6 }}>
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
