import assert from "node:assert/strict";
import { test } from "node:test";
import { registrationApiUrl } from "../src/features/parent-registration/environment.ts";

test("Production requires its explicit matching HTTPS origin; DEV cannot cross over", () => {
  const production = "https://etlaasot-server-main-main.up.railway.app";
  const dev = "https://etlaasot-server-dev-dev.up.railway.app";
  assert.equal(
    registrationApiUrl(production, production, "production"),
    production,
  );
  assert.equal(registrationApiUrl(dev, dev, "dev"), dev);
  for (const [requested, configured, environment] of [
    [production, production, "dev"],
    [dev, dev, "production"],
    [production, dev, "production"],
    [production, production, undefined],
    [production + "/other", production, "production"],
    ["http://127.0.0.1:3000", "http://127.0.0.1:3000", "production"],
    ["https://unapproved.example", "https://unapproved.example", "production"],
  ])
    assert.equal(registrationApiUrl(requested, configured, environment), null);
});
