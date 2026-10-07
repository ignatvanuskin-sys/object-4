const ORIGIN = process.argv[2] ?? "https://object-4.vercel.app";
const html = await (await fetch(ORIGIN + "/?ux=" + Date.now())).text();
const c = (re) => (html.match(re) || []).length;
const has = (s) => html.includes(s);

console.log("=== deployed ===");
console.log("viewport-fit=cover:", /viewport-fit=cover/.test(html));
console.log('translate="no":', c(/translate="no"/g));
console.log("theme-color #050506:", /content="#050506"/.test(html));

console.log("\n=== Intl output ===");
console.log("prices as ₸ (Intl):", c(/10\u00a0000\u00a0₸|10 000 ₸/g), "| any hardcoded old form:", /"10 000 ₸"/.test(html));
console.log("dates rendered:", (html.match(/\d{1,2} (января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря) 20\d\d/g) || []).slice(0, 3).join(" | ") || "NONE");
console.log("10000 formatted:", has("10\u00a0000\u00a0₸") || has("10 000 ₸"));
console.log("40000 formatted:", has("40\u00a0000\u00a0₸") || has("40 000 ₸"));

console.log("\n=== ticker pause control (WCAG 2.2.2) ===");
console.log("pause button present:", /Остановить бегущую строку/.test(html));
console.log("aria-pressed on it:", /aria-pressed/.test(html));

console.log("\n=== hash deep-link targets ===");
console.log("locations ids in data:", c(/dom-proklyatyh|pila/g) > 0);
console.log("faq panels have ids:", c(/id="faq-panel-\d"/g));

console.log("\n=== CSS rules present ===");
const cssHrefs = [...html.matchAll(/href="([^"]+\.css)"/g)].map((m) => m[1]);
let css = "";
for (const href of cssHrefs) css += await (await fetch(ORIGIN + href)).text();
const cc = (re) => (css.match(re) || []).length;
console.log("touch-action:manipulation:", cc(/touch-action:manipulation/g));
console.log("tap-highlight-color:", cc(/tap-highlight-color/g));
console.log("overscroll-behavior:contain:", cc(/overscroll-behavior:contain/g));
console.log("env(safe-area-inset-*):", cc(/env\(safe-area-inset/g));
console.log("pad-x utility:", cc(/\.pad-x/g));
console.log("curtain uses transform:", cc(/translateY\(-101%\)/g));
console.log("clip-path in animation (should be 0):", cc(/clip-path/g) - cc(/\.sr-only/g));
