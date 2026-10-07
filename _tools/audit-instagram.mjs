/**
 * Instagram-traffic readiness.
 *
 * Two things matter for an audience arriving from a profile link:
 *  1. the link preview Meta builds from the og: tags (fetched here with Meta's
 *     own crawler UA), and
 *  2. whether the in-app WebView can actually render the CSS we ship.
 */
const ORIGIN = process.argv[2] ?? "https://object-4.vercel.app";

const META_UA =
  "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";
const IG_ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 12; SM-A125F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36 Instagram 269.0.0.18.75 Android";
const IG_IOS_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 269.0.0.18.75";

const fetchAs = async (ua) => {
  const res = await fetch(ORIGIN, { headers: { "User-Agent": ua } });
  return { status: res.status, html: await res.text() };
};

const meta = (html, re) => (html.match(re) || [, ""])[1];

// ---------------------------------------------------- 1. Meta crawler view
console.log("=== 1. LINK PREVIEW (Meta crawler) ===");
const crawler = await fetchAs(META_UA);
console.log("facebookexternalhit status:", crawler.status);
const tags = {
  "og:title": /property="og:title" content="([^"]*)"/,
  "og:description": /property="og:description" content="([^"]*)"/,
  "og:image": /property="og:image" content="([^"]*)"/,
  "og:image:width": /property="og:image:width" content="([^"]*)"/,
  "og:image:height": /property="og:image:height" content="([^"]*)"/,
  "og:image:alt": /property="og:image:alt" content="([^"]*)"/,
  "og:type": /property="og:type" content="([^"]*)"/,
  "og:locale": /property="og:locale" content="([^"]*)"/,
  "og:site_name": /property="og:site_name" content="([^"]*)"/,
  "og:url": /property="og:url" content="([^"]*)"/,
  "twitter:card": /name="twitter:card" content="([^"]*)"/,
  "twitter:image": /name="twitter:image" content="([^"]*)"/,
};
for (const [key, re] of Object.entries(tags)) {
  const value = meta(crawler.html, re);
  const flag = value ? "ok " : "MISSING ";
  console.log(`  ${flag}${key}: ${value.slice(0, 78)}`);
}

// og:image must be absolute https and actually resolve to a real image
const ogImage = meta(crawler.html, tags["og:image"]);
if (ogImage) {
  const res = await fetch(ogImage);
  const buf = Buffer.from(await res.arrayBuffer());
  const isPng = buf.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
  const w = isPng ? buf.readUInt32BE(16) : 0;
  const h = isPng ? buf.readUInt32BE(20) : 0;
  console.log(`  og:image -> ${res.status} ${res.headers.get("content-type")} ${w}x${h} ${Math.round(buf.length / 1024)}KB https=${ogImage.startsWith("https://")}`);
}

// ---------------------------------------------------- 2. WebView UAs
console.log("\n=== 2. INSTAGRAM WEBVIEW USER AGENTS ===");
for (const [label, ua] of [["Instagram iOS 15.6", IG_IOS_UA], ["Instagram Android (Chrome 110)", IG_ANDROID_UA]]) {
  const r = await fetchAs(ua);
  console.log(`  ${label}: ${r.status}, html ${r.html.length} bytes, no UA sniffing differences`);
}

// ---------------------------------------------------- 3. viewport / mobile
console.log("\n=== 3. VIEWPORT ===");
const vp = meta(crawler.html, /name="viewport" content="([^"]*)"/);
console.log("  content:", vp || "MISSING");
console.log("  zoom allowed:", !/maximum-scale|user-scalable\s*=\s*no/i.test(vp) ? "yes" : "NO — blocks zoom");

// ---------------------------------------------------- 4. mixed content
console.log("\n=== 4. MIXED CONTENT ===");
const insecure = [...crawler.html.matchAll(/(?:src|href)="(http:\/\/[^"]+)"/g)].map((m) => m[1]);
console.log("  http:// subresources:", insecure.length, insecure.slice(0, 3).join(" ") || "");

// ---------------------------------------------------- 5. quick contact paths
console.log("\n=== 5. QUICK CONTACT FROM INSTAGRAM ===");
const count = (re) => (crawler.html.match(re) || []).length;
console.log("  tel: links:", count(/href="tel:/g));
console.log("  wa.me links:", count(/href="https:\/\/wa\.me\//g));
console.log("  instagram profile links:", count(/instagram\.com\/object\.rdn/g));
console.log("  target=_blank on external:", count(/target="_blank"/g));
console.log("  rel=noopener on external:", count(/rel="noopener/g));

// ---------------------------------------------------- 6. CSS feature risk
console.log("\n=== 6. CSS FEATURES THE WEBVIEW MUST SUPPORT ===");
const cssHrefs = [...crawler.html.matchAll(/href="([^"]+\.css)"/g)].map((m) => m[1]);
let css = "";
for (const href of cssHrefs) css += await (await fetch(ORIGIN + href)).text();
const risk = {
  "color-mix() — needed by Tailwind's /opacity colours": /color-mix\(/g,
  "oklab()": /oklab\(/g,
  "svh units": /\dsvh/g,
  "dvh/lvh units": /\d[l|d]vh/g,
  ":has()": /:has\(/g,
  "@container queries": /@container/g,
  "text-wrap: balance": /text-wrap:\s*balance/g,
  "backdrop-filter": /backdrop-filter/g,
};
for (const [label, re] of Object.entries(risk)) {
  const n = (css.match(re) || []).length;
  console.log(`  ${String(n).padStart(4)} × ${label}`);
}
const vhFallback = css.indexOf("min-height:100vh") !== -1 && css.indexOf("min-height:100svh") !== -1;
console.log("  hero vh fallback declared before svh:", vhFallback ? "yes" : "NO");
