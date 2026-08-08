import { Router, type IRouter } from 'express';
import { requireAuth, type AuthedRequest } from '../middlewares/requireAuth';
import { AppUser } from '../models/AppUser';
import { encrypt } from '../lib/crypto';

const router: IRouter = Router();

router.get('/account/api-key', requireAuth, async (req, res): Promise<void> => {
  const { clerkUserId } = req as AuthedRequest;
  const user = await AppUser.findOne({ clerkUserId });

  res.json({
    hasApiKey: Boolean(user?.geminiApiKeyEncrypted),
    freeRequestsRemaining: user?.freeRequestsRemaining ?? 1,
    hasCompletedFreeTrial: user?.hasCompletedFreeTrial ?? false,
  });
});

router.put('/account/api-key', requireAuth, async (req, res): Promise<void> => {
  const apiKey = typeof req.body?.apiKey === 'string' ? req.body.apiKey.trim() : '';
  if (!apiKey) {
    res.status(400).json({ error: 'apiKey is required' });
    return;
  }
  if (!apiKey.startsWith('AIza')) {
    res.status(400).json({ error: "That doesn't look like a valid Gemini API key." });
    return;
  }

  const { clerkUserId } = req as AuthedRequest;
  const user = await AppUser.findOneAndUpdate(
    { clerkUserId },
    { $set: { geminiApiKeyEncrypted: encrypt(apiKey) } },
    { upsert: true, new: true },
  );

  res.json({
    hasApiKey: true,
    freeRequestsRemaining: user.freeRequestsRemaining,
    hasCompletedFreeTrial: user.hasCompletedFreeTrial,
  });
});

router.delete('/account/api-key', requireAuth, async (req, res): Promise<void> => {
  const { clerkUserId } = req as AuthedRequest;
  const user = await AppUser.findOneAndUpdate(
    { clerkUserId },
    { $unset: { geminiApiKeyEncrypted: '' } },
    { upsert: true, new: true },
  );

  res.json({
    hasApiKey: false,
    freeRequestsRemaining: user.freeRequestsRemaining,
    hasCompletedFreeTrial: user.hasCompletedFreeTrial,
  });
});

export default router;
