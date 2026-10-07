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

// prefers-reduced-motion cannot be emulated with the tools available here, so
// verify it statically: every animated thing must be named inside the media
// block, otherwise it keeps moving for users who asked it not to.
console.log("\n=== CSS: every animated thing is honoured in reduced motion ===");
// Brace counting, not a regex: the stylesheet is minified onto one line, so
// `[\s\S]*?\n\}` matches nothing (and a non-greedy stop would end at the first
// nested rule anyway).
function mediaBlocks(source, needle) {
  const out = [];
  let i = source.indexOf(needle);
  while (i !== -1) {
    const open = source.indexOf("{", i);
    if (open === -1) break;
    let depth = 0;
    let j = open;
    for (; j < source.length; j += 1) {
      if (source[j] === "{") depth += 1;
      else if (source[j] === "}") {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    out.push(source.slice(open + 1, j));
    i = source.indexOf(needle, j);
  }
  return out;
}
const rmBlocks = mediaBlocks(css, "prefers-reduced-motion");
const rm = rmBlocks.join("\n");
console.log("  reduced-motion blocks found:", rmBlocks.length);
for (const name of [
  "grain-live",
  "glow-breathe",
  "sweep",
  "veil",
  "ticker-track",
  "spotlight",
]) {
  console.log(`  ${rm.includes(name) ? "OK  " : "MISS"} ${name} suppressed`);
}
console.log(`  ${/animation-duration:\s*\.?0?\.?001ms|animation:\s*none/.test(rm) ? "OK  " : "MISS"} blanket kill (animation-duration/animation:none)`);

// `will-change` pins an element to its own compositor layer. It belongs on the
// state that is about to move, not on the state that has already arrived.
console.log("\n=== CSS: will-change is released once the element settles ===");
// 3 continuously-animating layers (grain, sweep, spotlight) x2 + 3 pending-state
// hints that hand the hint back once the element settles.
console.log("  declarations total:", c(/will-change/g));
console.log("  ...of which release to auto when settled:", c(/will-change:\s*auto/g));
// Patterns stay agnostic about the minifier's habits: Lightning CSS strips the
// quotes from attribute selectors (`[data-reveal="in"]` -> `[data-reveal=in]`)
// and the second colon from pseudo-elements (`::after` -> `:after`). Written
// literally, both patterns silently matched nothing while the rule was present.
for (const [label, re] of [
  ["revealed state releases it", /\[data-reveal="?in"?\][^{]*\{[^}]*will-change:\s*auto/],
  ["stagger settled state releases it", /\[data-stagger\][^{]*\{[^}]*will-change:\s*auto/],
  ["curtain settled state releases it", /clip-target:{1,2}after[^{]*\{[^}]*will-change:\s*auto/],
]) {
  console.log(`  ${re.test(css) ? "OK  " : "MISS"} ${label}`);
}

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
//
// <script>/<style> bodies have to go first: the RSC flight payload inlined by
// Next contains every prop (`"data-decode":"true"`) and every boolean in the
// tree, so stripping tags alone leaves a wall of JSON that looks like copy.
const text = html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<template[\s\S]*?<\/template>/gi, " ")
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

// Regression guard. A bare JSX attribute lands in the DOM as `data-x="true"`,
// and a client script that reads such an attribute as a *payload* will echo the
// literal string "true" back over the real text. That shipped once; this fails
// the build check if it ever comes back.
const strayTrue = (text.match(/\btrue\b/gi) || []).length;
const markers = (html.match(/data-[a-z-]+="true"/g) || []).length;
console.log("\n=== regression guard: marker attributes stay invisible ===");
console.log(`  bare marker attributes in DOM: ${markers}`);
console.log(`  stray literal "true" in visible text: ${strayTrue} ${strayTrue === 0 ? "✓" : "✗ FAIL"}`);
for (const label of [
  "[ 01 ] Объект",
  "[ 02 ] Локации",
  "[ 03 ] Атмосфера",
  "[ 04 ] Почему объект",
]) {
  if (label.startsWith("[ 01") || label.startsWith("[ 03")) {
    console.log(`  eyebrow label intact: ${text.includes(label) ? "✓" : "✗"} ${label}`);
  }
}
