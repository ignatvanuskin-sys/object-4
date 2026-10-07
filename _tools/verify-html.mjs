const res = await fetch("http://localhost:3000");
const t = await res.text();

const count = (re) => (t.match(re) || []).length;

const markers = [...t.matchAll(/<[^>]*data-reveal-clip[^>]*>/g)].map((m) => m[0]);
let bad = 0;
for (const m of markers) {
  const i = t.indexOf(m);
  const after = t.slice(i + m.length, i + m.length + 240);
  if (!after.includes("clip-target")) {
    bad++;
    console.log("NO .clip-target INSIDE MARKER:", m.slice(0, 120));
  }
}

console.log("status:", res.status, "| html bytes:", t.length);
console.log("reveal-clip markers:", markers.length, "| without .clip-target:", bad);
console.log("clip-target occurrences:", count(/clip-target/g));
console.log("aria-controls=loc-detail:", count(/aria-controls="loc-detail"/g), '| id="loc-detail":', count(/id="loc-detail"/g));
console.log("stale loc-panel ids:", count(/loc-panel-/g));
console.log("h1:", count(/<h1/g), "h2:", count(/<h2/g), "h3:", count(/<h3/g));
console.log("iframe:", count(/<iframe /g), "| canonical:", count(/rel="canonical"/g), "| ld+json:", count(/application\/ld\+json/g));
console.log('skip link:', t.includes("К содержимому") ? "yes" : "NO");

console.log("\n--- images ---");
const imgs = [...t.matchAll(/<img[^>]*>/g)].map((m) => m[0]);
imgs.forEach((s, i) => {
  const src = (s.match(/src="([^"]*)"/) || [, "?"])[1];
  console.log(
    String(i).padStart(2),
    src.replace("/media/", "").slice(0, 26).padEnd(26),
    "lazy:" + /loading="lazy"/.test(s),
    "eager:" + /loading="eager"/.test(s),
    "srcset:" + /srcset=/i.test(s),
    "sizes:" + /sizes=/.test(s),
    "prio:" + /fetchpriority/i.test(s),
    "wh:" + /width="/.test(s),
    "alt:" + /alt="/.test(s),
  );
});

const sources = [...t.matchAll(/<source[^>]*>/g)].map((m) => m[0]);
console.log("\n<picture> sources:", sources.length);
sources.forEach((s) => console.log("  ", s.slice(0, 90), "... srcset:", /srcset=/i.test(s)));
