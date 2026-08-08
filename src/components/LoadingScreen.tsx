import { useEffect, useState } from 'react';
import Icon from './Icon';

const STEPS = [
  'Analyzing your responses...',
  'Matching your profile to career paths...',
  'Building your personalized roadmap...',
  'Adding future switch paths...',
  'Almost ready!',
];

export default function LoadingScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pf-loading">
      <div className="pf-loading-glow" />
      <div className="pf-loading-rings">
        <div className="pf-loading-core">
          <Icon icon="lucide:zap" size={24} color="#fff" />
        </div>
      </div>

      <p className="pf-loading-title">Forging Your Path</p>
      <p className="pf-loading-step">{STEPS[step]}</p>

      <div className="pf-loading-dots">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="pf-loading-dot"
            style={{
              width: i === step ? 24 : 6,
              background:
                i <= step
                  ? 'linear-gradient(90deg, var(--primary), var(--accent))'
                  : 'var(--border)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
