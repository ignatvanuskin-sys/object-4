/**
 * /api/booking robustness.
 *
 * Invalid payloads are safe to fire at production: they are rejected by
 * validation before anything is forwarded. The valid-payload and oversized
 * cases are run against the local server only, so no real lead destination is
 * ever touched.
 */
const PROD = "https://object-4.vercel.app";
const LOCAL = "http://localhost:3000";

async function call(origin, body, method = "POST", label = "") {
  try {
    const res = await fetch(origin + "/api/booking", {
      method,
      headers: { "Content-Type": "application/json" },
      body: method === "GET" ? undefined : body,
    });
    const text = (await res.text()).slice(0, 160).replace(/\s+/g, " ");
    console.log(`${String(res.status).padEnd(4)} ${label.padEnd(42)} ${text}`);
  } catch (e) {
    console.log(`ERR  ${label.padEnd(42)} ${e.message}`);
  }
}

console.log("=== PRODUCTION (invalid payloads only — rejected before any forward) ===");
await call(PROD, "not json at all", "POST", "malformed JSON");
await call(PROD, "", "POST", "empty body");
await call(PROD, "{}", "POST", "{} (no fields)");
await call(PROD, JSON.stringify({ name: "A", phone: "123" }), "POST", "short name + short phone");
await call(PROD, JSON.stringify({ name: "Тест", phone: "abc" }), "POST", "letters as phone");
await call(PROD, JSON.stringify({ name: "   ", phone: "   " }), "POST", "whitespace only");
await call(PROD, JSON.stringify({ name: 123, phone: {} }), "POST", "wrong types");
await call(PROD, undefined, "GET", "GET (method not allowed?)");

console.log("\n=== LOCAL (valid payloads — no webhook configured locally) ===");
await call(LOCAL, JSON.stringify({ name: "Тест Аудит", phone: "+7 700 000 00 00", comment: "проверка" }), "POST", "valid submission");
await call(LOCAL, JSON.stringify({ name: "XSS <script>alert(1)</script>", phone: "+77001234567", comment: "\"><img src=x onerror=alert(1)>" }), "POST", "xss-like input");
await call(LOCAL, JSON.stringify({ name: "Ё😀".repeat(200), phone: "+77001234567", comment: "я".repeat(5000) }), "POST", "unicode + overlong (5k comment)");
await call(LOCAL, JSON.stringify({ name: "Тест", phone: "+77001234567", extra: "unknown-field" }), "POST", "unknown field");
await call(LOCAL, JSON.stringify({ name: "A".repeat(50000), phone: "+77001234567" }), "POST", "50k name (payload size)");
await call(LOCAL, undefined, "GET", "GET (method not allowed?)");
