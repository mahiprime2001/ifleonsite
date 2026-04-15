import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src";

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?|css|html)$/.test(name)) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
let changed = 0;

const DARK_TOKEN = /(^|[\s"'`{>])dark:[^\s"'`}<]+/g;

for (const file of files) {
  const before = readFileSync(file, "utf8");
  if (!/\bdark:/.test(before)) continue;

  let after = before.replace(DARK_TOKEN, (_m, lead) => lead);

  // Collapse extra spaces only inside string literals that look like class lists
  after = after.replace(/(["'`])([^"'`\n]*?)(\1)/g, (m, q, body, q2) => {
    if (!/\s{2,}/.test(body)) return m;
    return q + body.replace(/\s{2,}/g, " ").replace(/^\s+|\s+$/g, "") + q2;
  });

  if (after !== before) {
    writeFileSync(file, after);
    console.log("stripped:", file);
    changed++;
  }
}

console.log(`\n${changed} file(s) updated`);
