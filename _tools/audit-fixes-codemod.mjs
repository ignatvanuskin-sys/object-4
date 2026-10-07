/**
 * Audit fixes that are purely mechanical.
 *
 * axe-core reported 25 nodes failing color-contrast; all of them were
 * `text-paper/50` (= 4.29:1 on the #16151a surface, below the 4.5:1 AA floor).
 * /65 measures 5.9:1. The header phone and the scroll hint were also below a
 * comfortable reading level.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const MAP = [
  ["text-paper/50", "text-paper/65"],
  ["text-paper/70", "text-paper/85"],
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
