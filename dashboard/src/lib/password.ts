import { scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

/* Checks a password against an `scrypt:<saltHex>:<hashHex>` value made by scripts/hash-password.mjs. */
export async function verifyPassword(password: string, stored: string) {
  const [algo, saltHex, hashHex] = stored.split(":");
  if (algo !== "scrypt" || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
