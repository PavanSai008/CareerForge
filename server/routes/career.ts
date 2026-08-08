import crypto from 'crypto';
import { Router, type IRouter } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth, type AuthedRequest } from '../middlewares/requireAuth.js';
import { AppUser } from '../models/AppUser.js';
import { decrypt } from '../lib/crypto.js';
import { generateCareerAnalysisFromSource, type CareerAnswerInput } from '../lib/gemini.js';

const MIN_PROMPT_LENGTH = 20;
const MAX_PROMPT_LENGTH = 2000;

function parseAnalyzeRequest(body: unknown):
  | { ok: true; source: { type: 'quiz'; answers: CareerAnswerInput[] } | { type: 'manual'; prompt: string } }
  | { ok: false; error: string } {
  const answers = (body as { answers?: CareerAnswerInput[] })?.answers;
  const prompt = (body as { prompt?: string })?.prompt;

  if (Array.isArray(answers) && answers.length > 0) {
    return { ok: true, source: { type: 'quiz', answers } };
  }

  if (typeof prompt === 'string') {
    const trimmed = prompt.trim();
    if (trimmed.length < MIN_PROMPT_LENGTH) {
      return {
        ok: false,
        error: `Please describe your goal in at least ${MIN_PROMPT_LENGTH} characters.`,
      };
    }
    if (trimmed.length > MAX_PROMPT_LENGTH) {
      return {
        ok: false,
        error: `Goal description must be at most ${MAX_PROMPT_LENGTH} characters.`,
      };
    }
    return { ok: true, source: { type: 'manual', prompt: trimmed } };
  }

  return { ok: false, error: 'Either answers or prompt is required' };
}

const router: IRouter = Router();

// Basic rate limiting: at most 10 analyses per IP per hour.
const analyzeRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

router.post('/career/analyze', analyzeRateLimiter, requireAuth, async (req, res): Promise<void> => {
  const parsed = parseAnalyzeRequest(req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const { clerkUserId } = req as AuthedRequest;
  let user = await AppUser.findOne({ clerkUserId });
  if (!user) {
    user = await AppUser.create({ clerkUserId });
  }

  let apiKey: string | undefined;
  let usingFreeTrial = false;

  if (user.freeRequestsRemaining > 0) {
    apiKey = process.env.GEMINI_API_KEY;
    usingFreeTrial = true;
  } else if (user.geminiApiKeyEncrypted) {
    apiKey = decrypt(user.geminiApiKeyEncrypted);
  }

  if (!apiKey) {
    res.status(402).json({
      error: "You've used your free career analysis. Connect your own Gemini API key to continue.",
      needsApiKey: true,
    });
    return;
  }

  let generated;
  try {
    generated = await generateCareerAnalysisFromSource(parsed.source, apiKey);
  } catch (err) {
    console.error('Career analysis generation failed', err);
    const message =
      err instanceof Error && err.message ? err.message : 'Failed to generate career analysis. Please try again.';
    res.status(500).json({ error: message });
    return;
  }

  const analysis = {
    id: crypto.randomUUID(),
    ...generated,
    sourceType: parsed.source.type,
    createdAt: new Date(),
  };

  user.careerHistory.push(analysis);
  if (usingFreeTrial) {
    user.freeRequestsRemaining -= 1;
    user.hasCompletedFreeTrial = true;
  }
  await user.save();

  res.json(analysis);
});

router.get('/career/history', requireAuth, async (req, res): Promise<void> => {
  const { clerkUserId } = req as AuthedRequest;
  const user = await AppUser.findOne({ clerkUserId });
  const history = [...(user?.careerHistory ?? [])].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  res.json(history);
});

export default router;
