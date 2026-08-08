import crypto from 'crypto';

// AES-256-GCM encryption for storing users' personal Gemini API keys at rest.
// The key is derived from SESSION_SECRET so no extra secret is required.
// A stored key is never returned to the frontend — only a boolean
// "hasApiKey" status is exposed.

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

function getDerivedKey(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET must be set to encrypt/decrypt stored API keys.');
  }
  return crypto.createHash('sha256').update(secret).digest();
}

export function encrypt(plainText: string): string {
  const key = getDerivedKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv, authTag, encrypted].map((buf) => buf.toString('base64')).join('.');
}

export function decrypt(payload: string): string {
  const [ivB64, authTagB64, encryptedB64] = payload.split('.');
  if (!ivB64 || !authTagB64 || !encryptedB64) {
    throw new Error('Malformed encrypted payload');
  }
  const key = getDerivedKey();
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(authTagB64, 'base64');
  const encrypted = Buffer.from(encryptedB64, 'base64');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}
