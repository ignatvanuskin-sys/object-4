/**
 * Checks this codebase against the vercel-labs web-interface-guidelines rulebook
 * and the react-best-practices bundle rules. Deterministic, no browser.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SKIP = ["node_modules", ".next", "_tools", "_source_photos", ".git", ".vercel"];
const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    SKIP.includes(e.name)
      ? []
      : e.isDirectory()
        ? walk(join(d, e.name))
        : [join(d, e.name)],
  );

const codeFiles = walk(".").filter((f) => /\.(tsx|ts|mjs)$/.test(f));
const source = codeFiles.map((f) => ({ f, t: readFileSync(f, "utf8") }));
const merged = source.map((s) => s.t).join("\n");
const css = readFileSync("app/globals.css", "utf8");

const report = (label, hits) => {
  console.log(`\n${label}`);
  if (hits.length === 0) console.log("  ✓ pass");
  else hits.forEach((h) => console.log("  " + h));
};

// ---------------------------------------------------------------- dependencies
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const declared = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
const unused = Object.keys(declared).filter((name) => {
  const re = new RegExp(`["'\`]${name}["'\`]`);
  return !source.some((s) => !s.f.includes("package.json") && re.test(s.t));
});
report("bundle: declared dependencies never imported", unused);

// ---------------------------------------------------------------- CSS rules
const cssChecks = [
  ["touch-action: manipulation", /touch-action:\s*manipulation/],
  ["-webkit-tap-highlight-color set intentionally", /-webkit-tap-highlight-color/],
  ["overscroll-behavior: contain (drawers/modals)", /overscroll-behavior:\s*contain/],
  ["overscroll-behavior on html for fine pointers", /overscroll-behavior:\s*none/],
];
console.log("\ntouch & interaction (app/globals.css + components)");
cssChecks.forEach(([label, re]) => {
  const inCss = re.test(css);
  // Tailwind ships `overscroll-contain`, which is the same declaration.
  const inTsx = re.test(merged) || /overscroll-contain/.test(merged);
  console.log(`  ${inCss || inTsx ? "✓" : "✗"} ${label}`);
});

console.log("\nanimation");
console.log(`  ${/transition:\s*all/.test(css) ? "✗" : "✓"} no \`transition: all\``);
console.log(`  ${/clip-path:\s*inset/.test(css) ? "✗ clip-path animated (not compositor-friendly)" : "✓"} animation stays on transform/opacity`);
console.log(`  ${/@supports \(height: 100svh\)/.test(css) ? "✓" : "✗"} svh behind @supports`);

console.log("\nsafe areas & layout");
const layout = readFileSync("app/layout.tsx", "utf8");
console.log(`  ${/viewportFit/.test(layout) ? "✓" : "✗"} viewportFit: cover (env(safe-area-inset-*) is inert without it)`);
console.log(`  ${/safe-area-inset/.test(merged) ? "✓" : "✗"} safe-area insets used`);

console.log("\ndark mode & theming");
console.log(`  ${/color-scheme:\s*dark/.test(css) ? "✓" : "✗"} color-scheme: dark on html`);
console.log(`  ${/themeColor/.test(layout) ? "✓" : "✗"} theme-color meta`);

console.log("\nhydration safety");
console.log(`  ${/classList\.add\('js-reveal'\)/.test(layout) ? "✓" : "✗"} inline script before paint for client-only state`);

// ---------------------------------------------------------------- locale
console.log("\nlocale & i18n");
const site = readFileSync("lib/site.ts", "utf8");
const hardcodedDates = (site.match(/date:\s*"\d{1,2} \w+ 20\d\d"/g) || []).length;
const hardcodedMoney = (site.match(/price:\s*"[\d\s]+₸"/g) || []).length;
console.log(`  ${hardcodedDates === 0 ? "✓" : `✗ ${hardcodedDates} hardcoded date strings`} (should use Intl.DateTimeFormat)`);
console.log(`  ${hardcodedMoney === 0 ? "✓" : `✗ ${hardcodedMoney} hardcoded money strings`} (should use Intl.NumberFormat)`);
console.log(`  ${/translate="no"/.test(merged) ? "✓" : "✗"} brand names wrapped in translate="no"`);

// ---------------------------------------------------------------- typography
console.log("\ntypography (checked against rendered text, not source)");
const html = readFileSync(".next/server/app/index.html", "utf8") || "";
// Drop script/style bodies first — the RSC payload is thousands of JSON quotes —
// then strip tags, so what remains is prose only.
const visibleText = html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<[^>]*>/g, " ");
const straightInProse = (visibleText.match(/"/g) || []).length;
console.log(`  ${straightInProse === 0 ? "✓" : `✗ ${straightInProse} straight quotes in visible text`} guillemets for Russian`);
const threeDots = (visibleText.match(/\.\.\./g) || []).length;
console.log(`  ${threeDots === 0 ? "✓" : `✗ ${threeDots} × "..."`} use … not ...`);
const nbsp = (visibleText.match(/\u00a0/g) || []).length;
console.log(`  ${nbsp > 0 ? `✓ ${nbsp} non-breaking spaces` : "✗ no non-breaking spaces"} brand/units bound`);

// ---------------------------------------------------------------- forms
console.log("\nforms");
const form = readFileSync("components/booking-form.tsx", "utf8");
// Strip comments: the explanatory note mentions the very class we removed.
const formCode = form.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
const hasGlobalRing = /:focus-visible\s*\{[^}]*outline/.test(css);
console.log(
  `  ${!formCode.includes("focus:outline-none") && hasGlobalRing ? "✓" : "✗"} focus replacement (global :focus-visible ring, no bare outline-none)`,
);
console.log(`  ${/aria-invalid/.test(form) ? "✓" : "✗"} aria-invalid wired`);
const placeholders = [...form.matchAll(/placeholder="([^"]*)"/g)].map((m) => m[1]);
console.log(`  placeholders: ${placeholders.length}, ending with …: ${placeholders.filter((p) => p.trim().endsWith("…")).length}`);

// ---------------------------------------------------------------- hover
console.log("\nhover states");
for (const f of readdirSync("components").filter((f) => f.endsWith(".tsx"))) {
  const t = readFileSync(join("components", f), "utf8");
  const interactive = (t.match(/<(button|a|Link)\b/g) || []).length;
  const hover = (t.match(/hover:|group-hover:|active:/g) || []).length;
  const wipe = (t.match(/\bwipe\b/g) || []).length;
  if (interactive > 0 && hover === 0 && wipe === 0) {
    console.log(`  ✗ ${f}: ${interactive} interactive elements, no hover/active state`);
  }
}
console.log("  (files not listed have hover/active states)");

// ---------------------------------------------------------------- navigation state
console.log("\nnavigation & state");
const locations = readFileSync("components/locations.tsx", "utf8");
const f = readFileSync("components/faq.tsx", "utf8");
console.log(`  ${/replaceState|pushState|useSearchParams|usePathname/.test(locations) ? "✓" : "✗"} locations tab state is deep-linkable`);
console.log(`  ${/replaceState|pushState|useSearchParams/.test(f) ? "✓" : "✗"} faq expanded state is deep-linkable`);
console.log(`  ${/aria-live/.test(merged) ? "✓" : "✗"} aria-live for async/announced updates`);
