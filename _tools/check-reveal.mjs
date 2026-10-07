const base = process.argv[2] ?? "http://localhost:3000";
const html = await (await fetch(base)).text();

const cssHrefs = [...html.matchAll(/href="([^"]+\.css)"/g)].map((m) => m[1]);
let css = "";
for (const href of cssHrefs) {
  const url = href.startsWith("http") ? href : base + href;
  css += await (await fetch(url)).text();
}

/** Prints every occurrence of a selector with the class that precedes it. */
function audit(css, selector) {
  const rows = [];
  let i = css.indexOf(selector);
  while (i !== -1) {
    const before = css.slice(Math.max(0, i - 30), i);
    const gated = before.includes(".js-reveal");
    rows.push(`${gated ? "GATED  " : "UNGATED"} …${before.replace(/\s+/g, " ")}${selector}`);
    i = css.indexOf(selector, i + 1);
  }
  return rows;
}

console.log("origin:", base);
console.log("inline js-reveal bootstrap:", /classList\.add\('js-reveal'\)/.test(html));
console.log("css bytes:", css.length);
console.log("clip markers:", (html.match(/data-reveal-clip/g) || []).length);

// Minifiers drop the quotes around attribute values, so search both spellings.
for (const sel of [
  "[data-reveal]{",
  "[data-reveal=in]",
  '[data-reveal="in"]',
  "[data-reveal-clip] .clip-target",
  "[data-reveal-clip=in] .clip-target",
]) {
  console.log(`\n--- ${sel} ---`);
  const rows = audit(css, sel);
  if (rows.length === 0) console.log("  (none found)");
  rows.forEach((r) => console.log("  " + r));
}
