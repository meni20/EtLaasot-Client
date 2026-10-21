import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

assert.ok(existsSync("dist/index.html"), "Run npm run build first");
assert.equal(
  existsSync("dist/parent-registration-demo.html"),
  false,
  "Demo entry must not be published",
);
const markers = [
  "createDemoAdapter",
  "fictional@example.test",
  "demo-north",
  "סביבת הדגמה מקומית",
];
function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) inspect(path);
    else if (/\.(js|html|json)$/.test(entry.name)) {
      const content = readFileSync(path, "utf8");
      for (const marker of markers)
        assert.equal(
          content.includes(marker),
          false,
          `Demo marker in production artifact: ${path}`,
        );
    }
  }
}
inspect("dist");
console.log("PASS: production dist contains no demo entry or mock fixtures.");
