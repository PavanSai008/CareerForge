import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ApiError, useAnalyzeCareer } from '@/lib/api';
import { setActiveCareerAnalysis } from '@/lib/careerStore';
import LoadingScreen from '@/components/LoadingScreen';
import ApiKeyModal from '@/components/ApiKeyModal';
import Icon from '@/components/Icon';

const MIN_PROMPT_LENGTH = 20;
const MAX_PROMPT_LENGTH = 2000;

const EXAMPLE_PROMPT =
  'I want to become a full-stack developer. I know Python and basic React, and I want to learn FastAPI, databases, Docker, and system design.';

export default function StartPath() {
  const [, setLocation] = useLocation();
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const analyzeCareer = useAnalyzeCareer();

  const trimmedPrompt = prompt.trim();
  const isTooShort = trimmedPrompt.length > 0 && trimmedPrompt.length < MIN_PROMPT_LENGTH;
  const isValid = trimmedPrompt.length >= MIN_PROMPT_LENGTH;

  const submitPrompt = async () => {
    if (!isValid) {
      setError(`Please describe your goal in at least ${MIN_PROMPT_LENGTH} characters.`);
      return;
    }

    setError('');

    try {
      const result = await analyzeCareer.mutateAsync({ data: { prompt: trimmedPrompt } });
      setActiveCareerAnalysis(result);
      setLocation('/results');
    } catch (err) {
      if (err instanceof ApiError && err.status === 402 && (err.data as { needsApiKey?: boolean })?.needsApiKey) {
        setShowApiKeyModal(true);
        return;
      }
      setError(
        err instanceof ApiError && err.data?.error
          ? err.data.error
          : 'Something went wrong. Please try again.',
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPrompt();
  };

  if (analyzeCareer.isPending) return <LoadingScreen />;

  return (
    <div className="pf-quiz-page">
      <div className="pf-quiz-glow" />

      <div className="pf-quiz-container">
        <div className="start-path-header">
          <div className="quiz-q-badge">
            <Icon icon="lucide:route" size={12} color="#a99fff" />
            Choose your path
          </div>
          <h1 className="start-path-title">How do you want to build your path?</h1>
          <p className="start-path-subtitle">
            Describe your goal in your own words, or take our quiz to discover a career that fits you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="quiz-question-card start-path-card">
          <label htmlFor="goal-prompt" className="start-path-label">
            Describe your goal
          </label>
          <p className="start-path-hint">
            Tell us what you want to learn or achieve — your current skills, target role, technologies,
            and timeframe all help.
          </p>

          <textarea
            id="goal-prompt"
            className="start-path-textarea"
            placeholder="Tell us what you want to learn or achieve..."
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value.slice(0, MAX_PROMPT_LENGTH));
              if (error) setError('');
            }}
            rows={6}
            maxLength={MAX_PROMPT_LENGTH}
          />

          <div className="start-path-meta">
            <span className={isTooShort ? 'start-path-char-warn' : undefined}>
              {trimmedPrompt.length} / {MAX_PROMPT_LENGTH}
            </span>
            {isTooShort && (
              <span className="start-path-char-warn">
                At least {MIN_PROMPT_LENGTH} characters required
              </span>
            )}
          </div>

          <details className="start-path-example">
            <summary>See an example</summary>
            <p>{EXAMPLE_PROMPT}</p>
          </details>

          {error && <div className="quiz-error start-path-error">{error}</div>}

          <div className="start-path-actions">
            <button
              type="submit"
              className="btn-hero-primary"
              disabled={!isValid || analyzeCareer.isPending}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Generate My Roadmap
              <Icon icon="lucide:sparkles" size={18} color="#fff" />
            </button>

            <Link href="/quiz" className="btn-hero-secondary start-path-quiz-btn">
              <Icon icon="lucide:clipboard-list" size={16} />
              Take the Quiz
            </Link>
          </div>
        </form>

        <p className="start-path-footer-note">
          Not sure? The quiz takes about 3 minutes and matches you to a career based on your interests.
        </p>
      </div>

      {showApiKeyModal && (
        <ApiKeyModal
          onClose={() => setShowApiKeyModal(false)}
          onKeySaved={() => {
            setShowApiKeyModal(false);
            submitPrompt();
          }}
        />
      )}
    </div>
  );
}
