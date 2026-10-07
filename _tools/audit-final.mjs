const ORIGIN = process.argv[2] ?? "https://object-4.vercel.app";
const html = await (await fetch(ORIGIN + "/?final=" + Date.now())).text();
const c = (re) => (html.match(re) || []).length;

console.log("=== DEPLOY FRESHNESS ===");
console.log("hero section is a flex column:", /id="top" class="screen-h relative isolate flex flex-col/.test(html));
console.log("screen-h on inner wrapper (should be 0):", c(/screen-h relative z-10/g));
console.log("hero copy flexes to fill:", c(/w-full max-w-\[1440px\] flex-1 flex-col/g));
console.log("opacity-45 (should be 0):", c(/opacity-45/g));
console.log("backdrop-blur (should be 0):", c(/backdrop-blur/g));

console.log("\n=== FIXES STILL IN PLACE ===");
console.log("canonical:", (html.match(/rel="canonical" href="([^"]*)"/) || [, ""])[1]);
console.log("og:image:", (html.match(/property="og:image" content="([^"]*)"/) || [, ""])[1]);
console.log("localhost refs (should be 0):", c(/localhost/g));
console.log("title:", (html.match(/<title>([^<]*)<\/title>/) || [, ""])[1]);
console.log("aria-invalid wiring present:", /aria-invalid=/.test(html));
console.log("role=img on rating:", c(/role="img"/g));
console.log("min-h-11 tap targets:", c(/min-h-11/g));
console.log("text-paper/50 (should be 0):", c(/text-paper\/50/g));
console.log("truncate (should be 0):", c(/truncate/g));
console.log("h1 count:", c(/<h1/g), "| images:", c(/<img /g), "| without alt:", (html.match(/<img (?![^>]*\balt=)/g) || []).length);

console.log("\n=== DEMO MODE (leads must NOT be delivered anywhere) ===");
for (const path of ["/robots.txt", "/sitemap.xml", "/manifest.webmanifest", "/og.png", "/icon.svg", "/apple-icon.png"]) {
  const res = await fetch(ORIGIN + path, { redirect: "manual" });
  console.log(`  ${path} -> ${res.status} ${(res.headers.get("content-type") || "").split(";")[0]}`);
}
const api = await fetch(ORIGIN + "/api/booking", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Финал Аудита", phone: "+77001112233", comment: "demo check" }),
});
const apiJson = await api.json().catch(() => ({}));
console.log("  POST /api/booking ->", api.status, JSON.stringify(apiJson));
console.log("  delivered=false means: accepted, logged server-side, forwarded nowhere ✓");
