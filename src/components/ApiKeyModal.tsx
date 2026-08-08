import { useState } from "react";
import { useUpdateApiKey, ApiError } from "@/lib/api";
import Icon from "./Icon";

/**
 * Shown when the user has exhausted their free trial. Collects a Gemini API
 * key, saves it encrypted on the backend, then calls onKeySaved() so the
 * parent can retry the analysis.
 */
export default function ApiKeyModal({
  onKeySaved,
  onClose,
}: {
  onKeySaved: () => void;
  onClose: () => void;
}) {
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");
  const updateApiKey = useUpdateApiKey();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = key.trim();
    if (!trimmed) {
      setError("Please paste your Gemini API key.");
      return;
    }

    try {
      await updateApiKey.mutateAsync({ data: { apiKey: trimmed } });
      onKeySaved();
    } catch (err) {
      setError(
        err instanceof ApiError && err.data?.error
          ? err.data.error
          : "Failed to save key. Please try again.",
      );
    }
  };

  const saving = updateApiKey.isPending;

  return (
    <div
      className="pf-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pf-modal animate-fade-slide-up">
        <button
          type="button"
          className="pf-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <Icon icon="lucide:x" size={18} />
        </button>

        <div className="pf-modal-icon">🎉</div>
        <h2 className="pf-modal-title">
          You've used your free career analysis
        </h2>
        <p className="pf-modal-body">
          To continue using CareerForge, connect your own Gemini API key. Your
          key is stored securely, encrypted, and used only to make Gemini API
          requests on your behalf. We never share or expose your key.
        </p>

        <form onSubmit={handleSave} className="pf-modal-form">
          <label className="pf-modal-label" htmlFor="gemini-key">
            Your Gemini API Key
          </label>
          <div className="pf-modal-input-row">
            <input
              id="gemini-key"
              type={showKey ? "text" : "password"}
              className="pf-modal-input"
              placeholder="AIza..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              disabled={saving}
            />
            <button
              type="button"
              className="pf-modal-eye"
              onClick={() => setShowKey((v) => !v)}
              aria-label={showKey ? "Hide key" : "Show key"}
              tabIndex={-1}
            >
              <Icon
                icon={showKey ? "lucide:eye-off" : "lucide:eye"}
                size={16}
              />
            </button>
          </div>

          {error && (
            <div className="pf-modal-error">
              <Icon icon="lucide:alert-circle" size={14} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-hero-primary pf-modal-submit"
            disabled={saving || !key.trim()}
          >
            {saving ? (
              <>
                <span className="pf-modal-spinner" />
                Saving & analyzing…
              </>
            ) : (
              <>
                <Icon icon="lucide:key" size={16} color="#fff" />
                Connect Gemini API Key
              </>
            )}
          </button>
        </form>

        <div className="pf-modal-security">
          <Icon icon="lucide:shield-check" size={14} color="var(--success)" />
          <span>
            Encrypted with AES-256 · Never exposed in responses · Delete anytime
          </span>
        </div>

        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="pf-modal-link"
        >
          <Icon icon="lucide:external-link" size={13} />
          How to get a free Gemini API key
        </a>
      </div>
    </div>
  );
}
