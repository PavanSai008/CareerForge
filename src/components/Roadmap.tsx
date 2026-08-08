import type { RoadmapPhase, SwitchPath } from '@/lib/api';

const PHASE_CLASSES: Record<string, string> = {
  violet: 'phase-violet',
  blue: 'phase-blue',
  cyan: 'phase-cyan',
  green: 'phase-green',
  gold: 'phase-gold',
};

const PHASE_DOT_COLORS: Record<string, string> = {
  violet: '#7c6fff',
  blue: '#5b6af7',
  cyan: '#00d4ff',
  green: '#10b981',
  gold: '#f59e0b',
};

function PhaseCard({
  phase,
  switchPaths,
}: {
  phase: RoadmapPhase;
  switchPaths: SwitchPath[];
}) {
  const colorKey = phase.colorKey || 'violet';
  const phaseClass = PHASE_CLASSES[colorKey] || PHASE_CLASSES.violet;
  const dotColor = PHASE_DOT_COLORS[colorKey] || '#7c6fff';
  const branches = (switchPaths || []).filter((sp) => sp.fromPhase === phase.phase);

  return (
    <div className="relative">
      <div
        className={`pf-card ${phaseClass}`}
        style={{ borderColor: `${dotColor}30`, padding: 24, marginBottom: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              minWidth: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 800,
              background: `${dotColor}25`,
              color: dotColor,
              border: `1.5px solid ${dotColor}`,
            }}
          >
            {phase.phase}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 4,
              }}
            >
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--foreground)' }}>
                {phase.title}
              </h3>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-xl)',
                  background: `${dotColor}15`,
                  color: dotColor,
                  border: `1px solid ${dotColor}40`,
                }}
              >
                {phase.duration}
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {phase.skills.map((skill) => (
                <span key={skill} className="skill-chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: 12,
            borderRadius: 'var(--radius-lg)',
            background: `${dotColor}10`,
            border: `1px solid ${dotColor}20`,
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 16 }}>🎯</span>
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 2,
              }}
            >
              Milestone
            </p>
            <p style={{ fontSize: 14, color: 'var(--foreground)' }}>{phase.milestone}</p>
          </div>
        </div>

        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--muted-foreground)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
            }}
          >
            Resources
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {phase.resources.map((r) => (
              <span
                key={r}
                style={{
                  fontSize: 12,
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--secondary-foreground)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>

      {branches.length > 0 && (
        <div style={{ marginTop: 12, marginLeft: 40 }}>
          {branches.map((sp) => (
            <SwitchPathBranch key={sp.role} switchPath={sp} />
          ))}
        </div>
      )}
    </div>
  );
}

function SwitchPathBranch({ switchPath }: { switchPath: SwitchPath }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
      <div style={{ width: 32, height: 1, background: 'rgba(248,113,113,0.5)', marginTop: 20 }} />
      <div className="switch-path-card" style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span>{switchPath.emoji}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fca5a5' }}>
            Switch → {switchPath.role}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--secondary-foreground)', marginBottom: 8 }}>
          {switchPath.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {switchPath.additionalSkills.map((s) => (
            <span key={s} className="switch-skill-chip">
              + {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhaseConnector({ colorKey }: { colorKey: string }) {
  const dotColor = PHASE_DOT_COLORS[colorKey] || '#7c6fff';
  return (
    <div
      className="phase-connector"
      style={{ background: `linear-gradient(to bottom, ${dotColor}80, transparent)` }}
    />
  );
}

export default function Roadmap({
  roadmap,
  switchPaths,
  completionTitle,
  completionText,
}: {
  roadmap: RoadmapPhase[];
  switchPaths: SwitchPath[];
  completionTitle?: string;
  completionText?: string;
}) {
  if (!roadmap || roadmap.length === 0) return null;

  const finalPhase = roadmap[roadmap.length - 1];
  const resolvedCompletionTitle = completionTitle ?? 'Goal Unlocked';
  const resolvedCompletionText =
    completionText ?? finalPhase?.milestone ?? 'Follow the phases above to reach your goal.';

  return (
    <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginBottom: 24,
          fontSize: 12,
          color: 'var(--muted-foreground)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--primary)' }} />
          <span>Main Path</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f87171' }} />
          <span>Career Switch Option</span>
        </div>
      </div>

      {roadmap.map((phase, index) => (
        <div key={phase.phase}>
          <PhaseCard phase={phase} switchPaths={switchPaths} />
          {index < roadmap.length - 1 && (
            <PhaseConnector colorKey={roadmap[index + 1]?.colorKey || 'violet'} />
          )}
        </div>
      ))}

      <div
        style={{
          marginTop: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: 20,
          borderRadius: 'var(--radius-xl)',
          background: 'rgba(245, 158, 11, 0.06)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
        }}
      >
        <span style={{ fontSize: 28 }}>🏆</span>
        <div>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#fde68a' }}>{resolvedCompletionTitle}</p>
          <p style={{ fontSize: 14, color: 'var(--secondary-foreground)' }}>{resolvedCompletionText}</p>
        </div>
      </div>
    </div>
  );
}
