/**
 * Confirms the live deployment actually contains the newest client code.
 * HTML alone is not enough here: the hash-change listeners live in the JS
 * chunks, so the chunks themselves have to be fetched and searched.
 */
const ORIGIN = process.argv[2] ?? "https://object-4.vercel.app";

const html = await (await fetch(ORIGIN + "/?fresh=" + Date.now())).text();
const scripts = [...html.matchAll(/src="([^"]+\.js)"/g)].map((m) => m[1]);
console.log("script chunks referenced:", scripts.length);

let bundle = "";
for (const src of scripts) {
  const url = src.startsWith("http") ? src : ORIGIN + src;
  try {
    bundle += await (await fetch(url)).text();
  } catch {
    /* a missing chunk is reported below by absence of markers */
  }
}
console.log("bundle bytes:", bundle.length);

const markers = {
  "hashchange listener (commit 3585ec8)": /hashchange/,
  "faq deep-link (#faq-panel-)": /faq-panel-/,
  "locations deep-link (#loc-)": /#loc-/,
  "ticker pause control": /Возобновить бегущую строку/,
  "aria-invalid wiring": /aria-invalid/,
  "focus moves to invalid field": /Укажите имя/,
};
for (const [label, re] of Object.entries(markers)) {
  console.log(`  ${re.test(bundle) ? "✓" : "✗"} ${label}`);
}
