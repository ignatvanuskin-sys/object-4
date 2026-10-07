import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)],
  );

let css = "";
for (const f of walk(".next").filter((f) => /\.css$/.test(f))) css += readFileSync(f, "utf8");
const html = readFileSync(".next/server/app/index.html", "utf8");

const c = (re) => (css.match(re) || []).length;
const h = (s) => html.includes(s);

console.log("=== CSS: new atmosphere rules ===");
const rules = {
  "grain-drift keyframes": /grain-drift/,
  "scanlines ::before": /\.scanlines/,
  "glow-breathe ::after": /\.glow-breathe/,
  "spotlight": /\.spotlight/,
  "veil + veil-lift": /veil-lift/,
  "mask-line (+descender guard)": /\.mask-line/,
  "sweep (CRT)": /@keyframes sweep/,
  "data-stagger reveal": /\[data-stagger\]/,
};
for (const [label, re] of Object.entries(rules)) {
  console.log(`  ${re.test(css) ? "✓" : "✗"} ${label}`);
}

console.log("\n=== CSS hygiene ===");
console.log("  clip-path in animation:", c(/clip-path/g) - c(/\.sr-only/g), "(0 expected)");
console.log("  transition:all:", c(/transition:all/g), "(0 expected)");
console.log("  animation/transition only on transform/opacity:",
  /@keyframes grain-drift[\s\S]{0,400}?transform/.test(css) ? "yes" : "check");

console.log("\n=== HTML: hooks present ===");
for (const [label, needle] of [
  ["data-spotlight section", "data-spotlight"],
  ["data-parallax element", "data-parallax"],
  ["data-count stat", "data-count="],
  ["data-decode label", "data-decode"],
  ["data-stagger word", "data-stagger"],
  ["mask-line hero", "mask-line"],
  ["spotlight element", 'class="spotlight"'],
  ["veil element", 'class="veil"'],
]) {
  console.log(`  ${h(needle) ? "✓" : "✗"} ${label}`);
}

// StaggerText wraps every word in its own span, so a heading never exists as a
// contiguous substring in the markup. Compare against tag-stripped text instead
// (and collapse the whitespace that the removed tags left behind).
const text = html
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<[^>]+>/g, "")
  .replace(/&nbsp;/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const words = (html.match(/data-stagger/g) || []).length;
console.log("\n  staggered word spans:", words);
console.log("  headline text still present as text:", text.includes("Вход добровольный."));
for (const heading of [
  "Две локации. Разная вместимость",
  "Фотографии сделаны внутри объекта",
  "От сообщения до закрытой двери",
]) {
  console.log(`  heading present in visible text: ${text.includes(heading) ? "✓" : "✗"} ${heading}`);
}
