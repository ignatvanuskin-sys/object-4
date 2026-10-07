/**
 * Secondary type on near-black was sitting at 3.2:1 (paper/40 on shale), which
 * fails WCAG AA for body and label sizes. This lifts the muted steps to the
 * first values that clear 4.5:1 while staying visually quiet.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const MAP = [
  ["text-paper/30", "text-paper/50"],
  ["text-paper/35", "text-paper/55"],
  ["text-paper/40", "text-paper/55"],
  ["text-paper/45", "text-paper/60"],
  ["text-white/40", "text-white/60"],
  ["text-white/45", "text-white/60"],
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
    hits.push(`${from}->${to} (${n})`);
  }
  if (src !== before) {
    writeFileSync(path, src, "utf8");
    touched++;
    console.log(`${path}: ${hits.join(", ")}`);
  }
}
console.log(`files touched: ${touched}`);
