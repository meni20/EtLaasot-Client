import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { selectBranding, brandingCss } from "../branding.config.ts";
import { officialPalette } from "../branding/production.ts";

const snapshot = JSON.parse(
  readFileSync(
    new URL("./legacy-branding.snapshot.json", import.meta.url),
    "utf8",
  ),
);
const main = {
  RAILWAY_ENVIRONMENT_NAME: "main",
  VITE_BRAND_THEME: "production",
};

test("explicit profile independently selects all branding, including local previews", () => {
  for (const env of [main, { VITE_BRAND_THEME: "production" }]) {
    const b = selectBranding(env);
    assert.equal(b.production, true);
    for (const key of [
      "loginLogo",
      "navbarLogo",
      "favicon",
      "apple",
      "pwa64",
      "pwa192",
      "pwa512",
      "maskable",
    ] as const)
      assert.ok(b[key].startsWith("/branding/production/"));
    assert.equal(b.colors.primary, "#0F228F");
    assert.equal(b.secondary.main, "#B58DFF");
    assert.equal(b.colors.canvas, "#FFF9F2");
    assert.deepEqual(Object.values(officialPalette), [
      "#FFB850",
      "#FB883C",
      "#B58DFF",
      "#0F228F",
      "#FFA6B9",
      "#B8D6FD",
      "#6DE495",
      "#FFF9F2",
    ]);
  }
});

test("DEV and default local builds retain every original color, CSS variable and asset byte", () => {
  for (const env of [
    {},
    { NODE_ENV: "production" },
    { VITE_BRAND_THEME: "legacy", RAILWAY_ENVIRONMENT_NAME: "dev" },
  ]) {
    const b = selectBranding(env);
    assert.equal(b.production, false);
    assert.deepEqual(b.colors, snapshot.colors);
    assert.deepEqual(b.chart, snapshot.chart);
    const css = Object.fromEntries(
      [...brandingCss(b).matchAll(/(--color-[\w-]+):\s*([^;]+);/g)].map((m) => [
        m[1],
        m[2],
      ]),
    );
    for (const [key, value] of Object.entries(snapshot.variables)) {
      if (String(value).startsWith("var(")) continue; // Existing aliases remain in index.css.
      const normalize = (v: string) => v.toLowerCase().replaceAll(" ", "");
      assert.equal(normalize(css[key]), normalize(String(value)), key);
    }
    assert.equal(b.loginLogo, "/etlaasot-favicon.png");
    assert.equal(b.navbarLogo, "/et-laasot-bat-yam-logo.png");
    assert.equal(b.favicon, "/favicon.ico");
    assert.equal(b.apple, "/apple-touch-icon-180x180.png");
    assert.equal(b.pwa192, "/pwa-192x192.png");
    assert.equal(b.pwa512, "/pwa-512x512.png");
    assert.equal(b.maskable, "/maskable-icon-512x512.png");
  }
  for (const [file, hash] of Object.entries(snapshot.assets))
    assert.equal(
      createHash("sha256")
        .update(readFileSync(new URL("../public/" + file, import.meta.url)))
        .digest("hex"),
      hash,
    );
});

test("Production cannot silently fall back; conflicts and invalid values stop the build", () => {
  for (const target of [
    { RAILWAY_ENVIRONMENT_NAME: "main" },
    { RAILWAY_ENVIRONMENT_ID: "b5bc66a8-10fd-45ac-af6b-99a84c84a338" },
    { VITE_PARENT_REGISTRATION_ENVIRONMENT: "production" },
    { VITE_SERVER_URL: "https://etlaasot-server-main-main.up.railway.app" },
  ])
    for (const value of [undefined, "legacy", "", "typo"])
      assert.throws(() =>
        selectBranding({ ...target, VITE_BRAND_THEME: value }),
      );
  for (const value of ["typo", "", "PRODUCTION"])
    assert.throws(() => selectBranding({ VITE_BRAND_THEME: value }));
  for (const env of [
    { RAILWAY_ENVIRONMENT_NAME: "dev" },
    { VITE_PARENT_REGISTRATION_ENVIRONMENT: "dev" },
    { VITE_SERVER_URL: "https://etlaasot-server-dev-dev.up.railway.app" },
  ])
    assert.throws(() =>
      selectBranding({ ...env, VITE_BRAND_THEME: "production" }),
    );
});

function luminance(hex: string) {
  const rgb = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

test("Production text, buttons and status messages meet 4.5:1 contrast", () => {
  const b = selectBranding(main),
    c = b.colors;
  const pairs = [
    ["#FFFFFF", c.primary],
    ["#FFFFFF", c.primaryHover],
    ["#FFFFFF", c.primaryPressed],
    [b.secondary.contrastText, b.secondary.main],
    [b.secondary.contrastText, b.secondary.dark],
    [c.text, c.canvas],
    [c.textSecondary, c.canvas],
    [c.textMuted, c.canvas],
    [c.brand, c.surface],
    [c.brand, c.brandSoft],
    [c.success, c.successSoft],
    [c.warning, c.warningSoft],
    [c.info, c.infoSoft],
    [c.danger, c.dangerSoft],
    [c.primary, c.primarySelected],
  ];
  for (const [foreground, background] of pairs)
    assert.ok(
      contrast(foreground, background) >= 4.5,
      `${foreground} on ${background}: ${contrast(foreground, background)}`,
    );
});
