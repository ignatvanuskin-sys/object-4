/**
 * Deterministic audit: link inventory, anchor resolution, SEO artefacts,
 * data consistency and mock/demo residue. No browser involved.
 */
const ORIGIN = process.argv[2] ?? "https://object-4.vercel.app";

const get = async (path, init) => {
  try {
    const res = await fetch(path.startsWith("http") ? path : ORIGIN + path, {
      redirect: "manual",
      ...init,
    });
    return res;
  } catch (e) {
    return { error: e.message, status: 0, headers: new Headers(), text: async () => "" };
  }
};

const html = await (await fetch(ORIGIN)).text();

// ---------------------------------------------------------------- headings
const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) =>
  m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
);
const h2 = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) =>
  m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
);
console.log("=== STRUCTURE ===");
console.log("h1 count:", h1.length);
h1.forEach((t) => console.log("   H1:", t.slice(0, 90)));
console.log("h2 count:", h2.length);

// ---------------------------------------------------------------- links
const links = [...html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({
  href: m[1],
  text: m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 42),
}));
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

const anchors = links.filter((l) => l.href.startsWith("#"));
const tel = links.filter((l) => l.href.startsWith("tel:"));
const wa = links.filter((l) => l.href.includes("wa.me"));
const external = links.filter((l) => l.href.startsWith("http"));
const other = links.filter(
  (l) => !["#", "tel:", "http"].some((p) => l.href.startsWith(p)) && !l.href.includes("wa.me"),
);

console.log("\n=== LINKS ===");
console.log("total <a>:", links.length);
console.log("anchors:", anchors.length, "| tel:", tel.length, "| whatsapp:", wa.length, "| external:", external.length, "| other:", other.length);

const deadAnchors = anchors.filter((l) => l.href !== "#" && !ids.has(l.href.slice(1)));
console.log("dead anchors:", deadAnchors.length);
deadAnchors.forEach((l) => console.log("   DEAD:", l.href, "|", l.text));

console.log("tel targets:", [...new Set(tel.map((l) => l.href))].join(", "));
console.log("wa targets:", [...new Set(wa.map((l) => l.href))].join(", "));
console.log("other hrefs:", [...new Set(other.map((l) => l.href))].join(", ") || "(none)");
console.log("javascript:void / empty href:", links.filter((l) => /javascript:|^$/.test(l.href)).length);

console.log("\n--- external targets (live status) ---");
const uniqExt = [...new Set(external.map((l) => l.href))];
for (const url of uniqExt) {
  const res = await get(url);
  const status = res.status ?? res.error;
  console.log(`  ${String(status).padEnd(6)} ${url}`);
}

// ---------------------------------------------------------------- metadata
const meta = (re) => (html.match(re) || [, ""])[1];
console.log("\n=== SEO ===");
console.log("title:", meta(/<title>([^<]*)<\/title>/).slice(0, 120));
console.log("description len:", meta(/name="description" content="([^"]*)"/).length);
console.log("canonical:", meta(/rel="canonical" href="([^"]*)"/));
console.log("og:url:", meta(/property="og:url" content="([^"]*)"/));
console.log("og:image:", meta(/property="og:image" content="([^"]*)"/));
console.log("og:type:", meta(/property="og:type" content="([^"]*)"/));
console.log("twitter:card:", meta(/name="twitter:card" content="([^"]*)"/));
console.log("lang:", meta(/<html[^>]*lang="([^"]*)"/));
console.log("viewport:", /name="viewport"/.test(html) ? "present" : "MISSING");
console.log("theme-color:", /name="theme-color"/.test(html) ? "present" : "MISSING");
console.log("icons:", (html.match(/rel="(icon|apple-touch-icon)"/g) || []).join(", ") || "MISSING");
console.log("imgs:", (html.match(/<img /g) || []).length, "| without alt:", (html.match(/<img (?![^>]*\balt=)/g) || []).length);
console.log("localhost refs in html:", (html.match(/localhost|127\.0\.0\.1/g) || []).length);

const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
console.log("ld+json blocks:", ld.length);
for (const block of ld) {
  try {
    const obj = JSON.parse(block);
    const type = Array.isArray(obj) ? obj.map((o) => o["@type"]).join(",") : obj["@type"];
    console.log("  parsed ok:", type, "| keys:", Object.keys(obj).length);
    if (obj.address) {
      console.log("    address:", obj.address.streetAddress, "|", obj.address.addressLocality, "|", obj.address.postalCode);
    }
    if (obj.telephone) console.log("    telephone:", obj.telephone);
    if (obj.openingHoursSpecification) console.log("    hours:", JSON.stringify(obj.openingHoursSpecification[0].opens), "-", JSON.stringify(obj.openingHoursSpecification[0].closes));
    if (obj.aggregateRating) console.log("    rating:", JSON.stringify(obj.aggregateRating));
    if (obj.mainEntity) console.log("    FAQ questions:", obj.mainEntity.length);
  } catch (e) {
    console.log("  PARSE ERROR:", e.message);
  }
}

for (const path of ["/robots.txt", "/sitemap.xml", "/manifest.webmanifest", "/icon.svg", "/apple-icon.png", "/og.png"]) {
  const res = await get(path);
  const ct = res.headers?.get?.("content-type") ?? "";
  console.log(`  ${path} -> ${res.status ?? res.error} ${ct.split(";")[0]}`);
}
const robots = await (await get("/robots.txt")).text();
console.log("\nrobots.txt:\n" + robots.split("\n").map((l) => "   " + l).join("\n"));
const sitemap = await (await get("/sitemap.xml")).text();
console.log("sitemap urls:", (sitemap.match(/<loc>/g) || []).length, "|", (sitemap.match(/<loc>([^<]*)<\/loc>/) || [, ""])[1]);

// ---------------------------------------------------------------- consistency
console.log("\n=== DATA CONSISTENCY (occurrences in HTML) ===");
const checks = [
  ["phone +7 708 941 92 83", /\+7 708 941 92 83/g],
  ["tel:+77089419283", /tel:\+77089419283/g],
  ["WhatsApp wa.me/77089419283", /wa\.me\/77089419283/g],
  ["address 'Автовокзала, 2'", /Автовокзала, 2/g],
  ["city Рудный", /Рудный/g],
  ["hours 12:00 — 00:00", /12:00 — 00:00/g],
  ["rating 5,0", /5,0/g],
  ["ratings 28", /28 оценок/g],
  ["reviews 25", /25 отзывов/g],
  ["instagram object.rdn", /object\.rdn/g],
  ["Дом проклятых", /Дом проклятых/g],
  ["Пила", /Пила/g],
];
for (const [label, re] of checks) console.log(`  ${String((html.match(re) || []).length).padStart(3)} × ${label}`);

console.log("\n=== MOCK/DEMO RESIDUE IN HTML ===");
const residue = ["MOCK", "mock", "demo", "fake", "placeholder", "lorem", "example.com", "TODO", "FIXME", "dummy", "test@"];
for (const token of residue) {
  const n = (html.match(new RegExp(token, "g")) || []).length;
  if (n) console.log(`  ${n} × "${token}"`);
}
console.log("  (only 'demo'/'placeholder' as attribute names is fine)");
