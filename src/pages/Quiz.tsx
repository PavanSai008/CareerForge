import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { ApiError, useAnalyzeCareer } from '@/lib/api';
import { QUIZ_QUESTIONS } from '@/data/quizQuestions';
import { setActiveCareerAnalysis } from '@/lib/careerStore';
import LoadingScreen from '@/components/LoadingScreen';
import ApiKeyModal from '@/components/ApiKeyModal';
import Icon from '@/components/Icon';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function Quiz() {
  const [, setLocation] = useLocation();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState('');
  const [animKey, setAnimKey] = useState(0);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const analyzeCareer = useAnalyzeCareer();

  const q = QUIZ_QUESTIONS[current];
  const selectedOption = answers[q?.id];
  const progress = (current / QUIZ_QUESTIONS.length) * 100;
  const isLast = current === QUIZ_QUESTIONS.length - 1;

  const goTo = (index: number) => {
    setAnimKey((k) => k + 1);
    setCurrent(index);
  };

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: optionId }));
  };

  const handleSubmit = async () => {
    const payload = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
      questionId: Number(questionId),
      selectedOption: selectedOptionId,
    }));

    setError('');

    try {
      const result = await analyzeCareer.mutateAsync({ data: { answers: payload } });
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

  const handleNext = () => {
    if (!selectedOption) return;
    if (isLast) handleSubmit();
    else goTo(current + 1);
  };

  const handlePrev = () => {
    if (current > 0) goTo(current - 1);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!q) return;
      const keyMap: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
      const idx = keyMap[e.key.toLowerCase()];
      if (idx !== undefined && q.options[idx]) {
        handleSelect(q.options[idx].id);
      }
      if (e.key === 'Enter' || e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, selectedOption, current],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (analyzeCareer.isPending) return <LoadingScreen />;

  return (
    <div className="pf-quiz-page">
      <div className="pf-quiz-glow" />

      <div className="pf-quiz-container">
        <div className="quiz-progress-header">
          <div className="quiz-progress-top">
            <span className="quiz-progress-label">
              Question <span>{current + 1}</span>
              <span style={{ color: 'var(--muted-foreground)', fontWeight: 500 }}>
                {' '}
                / {QUIZ_QUESTIONS.length}
              </span>
            </span>
            <span className="quiz-progress-pct">{Math.round(progress)}% done</span>
          </div>
          <div className="quiz-progress-track">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div key={animKey} className="quiz-question-card animate-fade-slide-up">
          <div className="quiz-q-badge">
            <Icon icon="lucide:help-circle" size={12} color="#a99fff" />
            Question {current + 1} of {QUIZ_QUESTIONS.length}
          </div>

          <h2 className="quiz-question-text">{q?.question}</h2>

          <div className="quiz-options">
            {q?.options.map((option, i) => (
              <button
                key={option.id}
                type="button"
                className={`quiz-option${selectedOption === option.id ? ' selected' : ''}`}
                onClick={() => handleSelect(option.id)}
              >
                <span className="quiz-option-label">{OPTION_LABELS[i]}</span>
                <span>{option.text}</span>
              </button>
            ))}
          </div>

          <p style={{ marginTop: 20, fontSize: 12, color: 'var(--muted-foreground)' }}>
            Tip: Press 1–4 or A–D to select quickly
          </p>
        </div>

        {error && <div className="quiz-error">{error}</div>}

        <div className="quiz-nav">
          <button
            type="button"
            className="btn-hero-secondary"
            onClick={handlePrev}
            disabled={current === 0}
            style={{ opacity: current === 0 ? 0.4 : 1, cursor: current === 0 ? 'not-allowed' : 'pointer' }}
          >
            <Icon icon="lucide:arrow-left" size={16} />
            Previous
          </button>

          <button
            type="button"
            className="btn-hero-primary"
            onClick={handleNext}
            disabled={!selectedOption}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {isLast ? 'Analyze My Career Path' : 'Next'}
            <Icon icon={isLast ? 'lucide:sparkles' : 'lucide:arrow-right'} size={18} color="#fff" />
          </button>
        </div>

        <div className="quiz-dots">
          {QUIZ_QUESTIONS.map((question, i) => (
            <button
              key={question.id}
              type="button"
              className="quiz-dot"
              onClick={() => goTo(i)}
              title={`Question ${i + 1}`}
              style={{
                background: answers[question.id]
                  ? 'linear-gradient(90deg, var(--primary), var(--accent))'
                  : i === current
                    ? 'rgba(124, 111, 255, 0.5)'
                    : 'var(--border)',
                width: i === current ? 24 : 8,
                borderRadius: i === current ? 999 : '50%',
              }}
            />
          ))}
        </div>
      </div>

      {showApiKeyModal && (
        <ApiKeyModal
          onClose={() => setShowApiKeyModal(false)}
          onKeySaved={() => {
            setShowApiKeyModal(false);
            handleSubmit();
          }}
        />
      )}
    </div>
  );
}
