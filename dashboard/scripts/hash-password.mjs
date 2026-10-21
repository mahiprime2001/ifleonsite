// Prints an ADMIN_PASSWORD_HASH value for .env. The password is read from a hidden prompt,
// so it never lands in shell history.
//   npm run hash-password
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";

const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
rl._writeToOutput = (s) => {
  if (s.includes("Password")) process.stdout.write(s);
};

rl.question("Password (min 12 chars): ", (password) => {
  rl.close();
  process.stdout.write("\n");
  if (password.length < 12) {
    console.error("Too short: use at least 12 characters.");
    process.exit(1);
  }
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("hex")}:${hash.toString("hex")}`);
});
