/**
 * Confirms the darkness + motion work actually reached the edge.
 *
 * The HTML is prerendered, so every hook (data-parallax, data-stagger, …) can
 * be grepped straight out of it. The CSS is a separate hashed asset and is the
 * only place the keyframes live, so it has to be fetched on its own — the HTML
 * looking right says nothing about whether the stylesheet shipped.
 */
const ORIGIN = process.argv[2] ?? "https://object-4.vercel.app";

const html = await (await fetch(ORIGIN + "/?t=" + Date.now(), { cache: "no-store" })).text();
console.log("html bytes:", html.length);

const hrefs = [...html.matchAll(/<link[^>]+href="([^"]+\.css)"/g)].map((m) => m[1]);
let css = "";
for (const href of hrefs) {
  const url = href.startsWith("http") ? href : ORIGIN + href;
  const body = await (await fetch(url, { cache: "no-store" })).text();
  css += body;
  console.log("  css", url.split("/").pop(), body.length, "bytes");
}
console.log("css total:", css.length, "bytes");

console.log("\n=== live CSS: atmosphere rules ===");
const cssRules = {
  "grain-drift keyframes": /@keyframes grain-drift/,
  "scanlines ::before": /\.scanlines:before|\.scanlines::before/,
  "glow-breathe ::after": /\.glow-breathe:after|\.glow-breathe::after/,
  "spotlight": /\.spotlight/,
  "veil-lift keyframes": /@keyframes veil-lift/,
  "mask-line (+descender guard)": /\.mask-line/,
  "@keyframes sweep": /@keyframes sweep/,
  "[data-stagger] reveal": /\[data-stagger\]/,
  "prefers-reduced-motion block": /prefers-reduced-motion/,
  "deep ink #030304": /#030304/,
};
for (const [label, re] of Object.entries(cssRules)) {
  console.log(`  ${re.test(css) ? "OK  " : "MISS"} ${label}`);
}

console.log("\n=== live HTML: motion hooks ===");
const hooks = [
  "data-spotlight",
  "data-parallax",
  "data-count=",
  "data-decode",
  "data-stagger",
  "mask-line",
  'class="spotlight"',
  'class="veil"',
  "grain-live",
];
for (const hook of hooks) {
  console.log(`  ${html.includes(hook) ? "OK  " : "MISS"} ${hook}`);
}

// Headings are word-split by StaggerText, so compare tag-stripped text.
const text = html
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<[^>]+>/g, "")
  .replace(/\s+/g, " ")
  .trim();
console.log("\n=== live HTML: copy survived the split ===");
for (const s of [
  "Вход добровольный.",
  "Две локации. Разная вместимость",
  "Фотографии сделаны внутри объекта",
  "От сообщения до закрытой двери",
]) {
  console.log(`  ${text.includes(s) ? "OK  " : "MISS"} ${s}`);
}

console.log("\n  staggered word spans on the page:", (html.match(/data-stagger/g) || []).length);
console.log("  animated-things-on-fine-pointer only:", /pointer:\s*fine/.test(css) ? "guarded" : "check");
