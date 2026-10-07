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
console.log('behavior:"instant" present:', /behavior:"instant"/.test(bundle) || bundle.includes('"instant"'));
console.log('behavior:"smooth" in MY code (loc-related):', /sectionRef/.test(bundle));
console.log("scrollIntoView call sites:", (bundle.match(/scrollIntoView/g) || []).length);
console.log("'#loc-' string:", bundle.includes("#loc-"));

// Show the context around each call that looks like ours (options object).
const idx = [...bundle.matchAll(/scrollIntoView\(/g)].map((m) => m.index);
for (const i of idx) {
  const ctx = bundle.slice(i, i + 90);
  if (ctx.includes("behavior") || ctx.includes("block")) {
    console.log("\nOUR CALL SITE:", ctx.replace(/\s+/g, " "));
  }
}
