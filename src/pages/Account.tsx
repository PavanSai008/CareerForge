import { useState } from 'react';
import { Link } from 'wouter';
import { useUser } from '@clerk/react';
import { ApiError, useDeleteApiKey, useGetApiKeyStatus, useUpdateApiKey } from '@/lib/api';
import Icon from '@/components/Icon';

export default function Account() {
  const { user } = useUser();
  const { data: status, isLoading } = useGetApiKeyStatus();
  const updateApiKey = useUpdateApiKey();
  const deleteApiKey = useDeleteApiKey();

  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmed = key.trim();
    if (!trimmed) {
      setError('Please paste your Gemini API key.');
      return;
    }

    try {
      await updateApiKey.mutateAsync({ data: { apiKey: trimmed } });
      setKey('');
      setSuccess('API key saved.');
    } catch (err) {
      setError(err instanceof ApiError && err.data?.error ? err.data.error : 'Failed to save key.');
    }
  };

  const handleDelete = async () => {
    setError('');
    setSuccess('');
    try {
      await deleteApiKey.mutateAsync();
      setSuccess('API key removed.');
    } catch (err) {
      setError(err instanceof ApiError && err.data?.error ? err.data.error : 'Failed to remove key.');
    }
  };

  return (
    <div className="pf-quiz-page">
      <div className="pf-quiz-glow" />

      <div className="pf-quiz-container">
        <div style={{ marginBottom: 32 }}>
          <div className="quiz-q-badge">
            <Icon icon="lucide:key" size={12} color="#a99fff" />
            Account
          </div>
          <h1 className="section-title" style={{ maxWidth: '100%', marginBottom: 8 }}>
            {user?.firstName ? `Hi, ${user.firstName}` : 'Your account'}
          </h1>
          <p style={{ color: 'var(--secondary-foreground)', fontSize: 14 }}>{user?.primaryEmailAddress?.emailAddress}</p>
        </div>

        {!isLoading && status && (
          <div className="pf-card" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Free trial status</h2>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <div className="results-info-card" style={{ flex: 1, minWidth: 180 }}>
                <h3>Free analyses remaining</h3>
                <p className="value">{status.freeRequestsRemaining}</p>
              </div>
              <div className="results-info-card" style={{ flex: 1, minWidth: 180 }}>
                <h3>Your Gemini key</h3>
                <p className="value" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {status.hasApiKey ? (
                    <>
                      <Icon icon="lucide:check-circle" size={16} color="var(--success)" />
                      Connected
                    </>
                  ) : (
                    'Not connected'
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pf-card">
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Gemini API key</h2>
          <p style={{ fontSize: 14, color: 'var(--secondary-foreground)', lineHeight: 1.7, marginBottom: 20 }}>
            Connect your own Gemini API key to keep generating career analyses after your free
            trial runs out. Your key is encrypted at rest and never returned to the browser.
          </p>

          <form onSubmit={handleSave} className="pf-modal-form" style={{ marginBottom: 0 }}>
            <label className="pf-modal-label" htmlFor="account-gemini-key">
              {status?.hasApiKey ? 'Replace your Gemini API key' : 'Add your Gemini API key'}
            </label>
            <div className="pf-modal-input-row">
              <input
                id="account-gemini-key"
                type={showKey ? 'text' : 'password'}
                className="pf-modal-input"
                placeholder="AIza..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                disabled={updateApiKey.isPending}
              />
              <button
                type="button"
                className="pf-modal-eye"
                onClick={() => setShowKey((v) => !v)}
                aria-label={showKey ? 'Hide key' : 'Show key'}
                tabIndex={-1}
              >
                <Icon icon={showKey ? 'lucide:eye-off' : 'lucide:eye'} size={16} />
              </button>
            </div>

            {error && (
              <div className="pf-modal-error">
                <Icon icon="lucide:alert-circle" size={14} />
                {error}
              </div>
            )}
            {success && (
              <div
                className="pf-modal-error"
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                  color: '#6ee7b7',
                }}
              >
                <Icon icon="lucide:check-circle" size={14} />
                {success}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button
                type="submit"
                className="btn-hero-primary"
                disabled={updateApiKey.isPending || !key.trim()}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Icon icon="lucide:key" size={16} color="#fff" />
                {updateApiKey.isPending ? 'Saving…' : 'Save key'}
              </button>
              {status?.hasApiKey && (
                <button
                  type="button"
                  className="btn-hero-secondary"
                  onClick={handleDelete}
                  disabled={deleteApiKey.isPending}
                >
                  <Icon icon="lucide:x" size={16} />
                  Remove
                </button>
              )}
            </div>
          </form>

          <div className="pf-modal-security" style={{ marginTop: 20, marginBottom: 0, justifyContent: 'flex-start' }}>
            <Icon icon="lucide:shield-check" size={14} color="var(--success)" />
            <span>Encrypted with AES-256 · Never exposed in responses</span>
          </div>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link href="/history" className="btn-ghost">
            View your career history
          </Link>
        </div>
      </div>
    </div>
  );
}
