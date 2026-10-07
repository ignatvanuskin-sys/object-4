/**
 * One-shot codemod: moves the five "light" sections onto the dark palette and
 * swaps small accent text from the fill colour to the ember tone (which is
 * readable at label sizes on near-black).
 *
 * Order matters: the most specific patterns run first so that a short pattern
 * can never eat part of a longer one.
 */
import { readFileSync, writeFileSync } from "node:fs";

/** Patterns applied only to sections that used to be cream/white. */
const LIGHT_SECTION = [
  ["bg-paper text-ink", "bg-shale text-paper"],
  ["bg-paper-soft", "bg-shale-2"],
  ["--grid-color: \"rgba(11,11,12,0.055)\"", "--grid-color: \"rgba(231,227,219,0.045)\""],
  ["--grid-color: \"rgba(11,11,12,0.07)\"", "--grid-color: \"rgba(231,227,219,0.06)\""],
  ["text-ink/70", "text-paper/70"],
  ["text-ink/50", "text-paper/40"],
  ["text-ink/45", "text-paper/40"],
  ["text-ink/40", "text-paper/35"],
  ["text-ink/35", "text-paper/30"],
  ["text-graphite", "text-paper/65"],
  ["hover:border-ink/50", "hover:border-white/40"],
  ["border-ink/25", "border-white/20"],
  ["border-ink/20", "border-white/14"],
  ["border-ink/15", "border-white/12"],
  ["hover:border-ink hover:bg-ink hover:text-paper", "hover:border-paper hover:bg-paper hover:text-ink"],
  ["hover:border-ink", "hover:border-paper"],
  ["bg-ink text-paper hover:bg-signal", "bg-paper text-ink hover:bg-signal hover:text-white"],
  ["bg-ink", "bg-paper"],
  ["placeholder:text-ink", "placeholder:text-paper"],
  ["text-ink", "text-paper"],
  ["border-ink", "border-white/20"],
];

/** Applied to every component. */
const GLOBAL = [
  [' tone="light"', ""],
  [' tone="dark"', ""],
  // Small red type on near-black needs the lighter ember tone to stay legible.
  ["text-signal", "text-ember"],
  ["fill-signal", "fill-ember"],
];

const LIGHT_FILES = [
  "components/about.tsx",
  "components/atmosphere.tsx",
  "components/reviews.tsx",
  "components/faq.tsx",
  "components/contacts.tsx",
  "components/booking-form.tsx",
];

const ALL_FILES = [
  ...LIGHT_FILES,
  "components/ui.tsx",
  "components/locations.tsx",
  "components/process.tsx",
  "components/advantages.tsx",
  "components/hero.tsx",
  "components/ticker.tsx",
  "components/site-header.tsx",
  "components/site-footer.tsx",
  "components/final-cta.tsx",
  "components/lightbox.tsx",
  "components/mobile-cta.tsx",
];

const report = [];

for (const file of ALL_FILES) {
  let src = readFileSync(file, "utf8");
  const before = src;
  const applied = [];

  const passes = LIGHT_FILES.includes(file) ? [LIGHT_SECTION, GLOBAL] : [GLOBAL];
  for (const pass of passes) {
    for (const [from, to] of pass) {
      if (!src.includes(from)) continue;
      const n = src.split(from).length - 1;
      src = src.split(from).join(to);
      applied.push(`${from} -> ${to} (${n})`);
    }
  }

  if (src !== before) {
    writeFileSync(file, src, "utf8");
    report.push(`${file}\n    ${applied.join("\n    ")}`);
  } else {
    report.push(`${file}\n    (no change)`);
  }
}

console.log(report.join("\n"));
