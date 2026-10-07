const base = process.argv[2] ?? "http://localhost:3000";
const html = await (await fetch(base)).text();

const refs = [...html.matchAll(/\/media\/[A-Za-z0-9._\/-]*/g)].map((m) => m[0]);
const unique = [...new Set(refs)];
const stale = unique.filter((u) => !u.startsWith("/media/v2/"));

console.log("origin:", base);
console.log("total media refs:", refs.length);
console.log("unique:", unique.length);
console.log("versioned (/media/v2/):", unique.filter((u) => u.startsWith("/media/v2/")).length);
console.log("NON-versioned:", stale.length);
stale.forEach((s) => console.log("   ", s));

// Fetch a couple of them to confirm they exist and are webp.
for (const u of unique.slice(0, 3)) {
  const res = await fetch(base + u, { method: "GET" });
  console.log(`  ${res.status} ${res.headers.get("content-type")} ${res.headers.get("content-length")}B  ${u}`);
}
