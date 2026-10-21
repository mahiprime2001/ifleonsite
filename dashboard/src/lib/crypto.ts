import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/*
 * Encrypts secrets (provider API keys) before they go into the database, with AES-256-GCM.
 * The key comes from SETTINGS_SECRET, or SESSION_SECRET if that isn't set. Changing it makes
 * stored secrets unreadable; they'd need to be entered again on the Settings page.
 * Format: "v1:" + base64(iv[12] | authTag[16] | ciphertext)
 */
function key() {
  const secret = process.env.SETTINGS_SECRET || process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SETTINGS_SECRET (or SESSION_SECRET) must be set");
  return createHash("sha256").update(`ifleon-settings:${secret}`).digest();
}

export function encryptSecret(plain: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return `v1:${Buffer.concat([iv, cipher.getAuthTag(), data]).toString("base64")}`;
}

/* Returns null if the value can't be decrypted (wrong secret or corrupted). */
export function decryptSecret(stored: string): string | null {
  if (!stored.startsWith("v1:")) return null;
  try {
    const raw = Buffer.from(stored.slice(3), "base64");
    const decipher = createDecipheriv("aes-256-gcm", key(), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    return Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

/* "…a1b2" for showing which key is saved without revealing it. */
export function secretHint(plain: string) {
  return `…${plain.slice(-4)}`;
}
