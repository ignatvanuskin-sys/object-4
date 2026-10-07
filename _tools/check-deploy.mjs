const origin = process.argv[2] ?? "https://object-4.vercel.app";
const html = await (await fetch(origin + "/?bust=" + Date.now())).text();
const count = (re) => (html.match(re) || []).length;

console.log("=== deploy freshness ===");
console.log("opacity-45 (should be 0):", count(/opacity-45/g));
console.log("text-paper/70 on step titles:", count(/text-paper\/70/g));
console.log("aria-invalid markup present:", /aria-invalid=/.test(html));
console.log("border-ember class referenced:", count(/border-ember/g));
console.log("bg-ember/5 class referenced:", count(/bg-ember\/5/g));
console.log("min-h-11 occurrences:", count(/min-h-11/g));
console.log("old text-paper/50 remaining:", count(/text-paper\/50/g));
console.log("truncate on hero strip (should be 0):", count(/truncate/g));
console.log("siteUrl localhost refs:", count(/localhost/g));
console.log("title:", (html.match(/<title>([^<]*)<\/title>/) || [, ""])[1]);
