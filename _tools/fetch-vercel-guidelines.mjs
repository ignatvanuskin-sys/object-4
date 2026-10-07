/**
 * Downloads the rulebook that the vercel-labs/agent-skills `web-design-guidelines`
 * skill tells the agent to fetch fresh before every review, and saves it locally
 * so the review can be run offline and re-run later.
 */
import { writeFileSync } from "node:fs";

const SRC = "https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md";
const res = await fetch(SRC);
const text = await res.text();
writeFileSync("_tools/vercel-web-guidelines.md", text, "utf8");
console.log("status:", res.status, "| bytes:", text.length, "| lines:", text.split("\n").length);
console.log("saved to _tools/vercel-web-guidelines.md");
