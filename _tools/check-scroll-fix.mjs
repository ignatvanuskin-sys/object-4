const ORIGIN = "https://object-4.vercel.app";
const html = await (await fetch(ORIGIN + "/?cf=" + Date.now())).text();
const scripts = [...html.matchAll(/src="([^"]+\.js)"/g)].map((m) => m[1]);

let bundle = "";
for (const s of scripts) {
  try {
    bundle += await (await fetch(s.startsWith("http") ? s : ORIGIN + s)).text();
  } catch {}
}

console.log("chunks:", scripts.length, "| bytes:", bundle.length);
console.log("scrollIntoView present:", bundle.includes("scrollIntoView"));
console.log("'#loc-' string present:", bundle.includes("#loc-"));
console.log("prefers-reduced-motion in bundle:", bundle.includes("prefers-reduced-motion"));

const i = bundle.indexOf("scrollIntoView");
if (i > -1) {
  console.log("\ncontext:");
  console.log(bundle.slice(Math.max(0, i - 220), i + 120));
} else {
  console.log("\nNOT FOUND — the deployed bundle predates the fix, or the code was dropped.");
}
