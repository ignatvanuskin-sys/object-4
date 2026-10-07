/**
 * Tap-target fix.
 *
 * Standalone text links (footer navigation, contact rows, the little "→" links)
 * rendered at 18–22px of hit area — below the 24px WCAG 2.5.8 floor and well
 * below the 44px comfortable target. Each of them becomes an inline-flex box
 * with a 44px minimum height. Inline links inside running sentences are left
 * alone, as the guideline intends.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const PAD = "inline-flex min-h-11 items-center ";

const MAP = [
  // most specific first
  ['className="label wipe mt-6 inline-block text-paper"', `className="label wipe mt-6 ${PAD}text-paper"`],
  ['className="label wipe ', `className="label wipe ${PAD}`],
  ['className="label wipe"', `className="label wipe ${PAD}"`],
  ['className="wipe text-[0.9375rem] ', `className="wipe ${PAD}text-[0.9375rem] `],
  ['className="wipe"', `className="wipe ${PAD}"`],
];

const dir = "components";
let touched = 0;

for (const file of readdirSync(dir).filter((f) => f.endsWith(".tsx"))) {
  const path = join(dir, file);
  let src = readFileSync(path, "utf8");
  const before = src;
  const hits = [];
  for (const [from, to] of MAP) {
    if (!src.includes(from)) continue;
    const n = src.split(from).length - 1;
    src = src.split(from).join(to);
    hits.push(`${from.slice(0, 34)}… (${n})`);
  }
  if (src !== before) {
    writeFileSync(path, src, "utf8");
    touched++;
    console.log(`${path}: ${hits.join(" | ")}`);
  }
}
console.log(`files touched: ${touched}`);
