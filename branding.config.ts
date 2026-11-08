import { legacyColors, legacyChart } from "./branding/legacy.ts";
import {
  officialPalette,
  productionColors,
  productionChart,
} from "./branding/production.ts";

// Build mode is also "production" in Railway DEV; require the explicit target.
export function selectBranding(env: Record<string, string | undefined>) {
  const requested = env.VITE_BRAND_THEME;
  if (requested !== undefined && !["legacy", "production"].includes(requested))
    throw new Error("VITE_BRAND_THEME must be legacy or production");
  const railway = env.RAILWAY_ENVIRONMENT_NAME;
  const productionTarget =
    railway === "main" ||
    env.RAILWAY_ENVIRONMENT_ID === "b5bc66a8-10fd-45ac-af6b-99a84c84a338" ||
    env.VITE_PARENT_REGISTRATION_ENVIRONMENT === "production" ||
    env.VITE_SERVER_URL === "https://etlaasot-server-main-main.up.railway.app";
  const devTarget =
    railway === "dev" ||
    env.RAILWAY_ENVIRONMENT_ID === "6b2b0ac3-9131-454c-9a42-4df26937f521" ||
    env.VITE_PARENT_REGISTRATION_ENVIRONMENT === "dev" ||
    env.VITE_SERVER_URL === "https://etlaasot-server-dev-dev.up.railway.app";
  if (productionTarget && (requested !== "production" || devTarget))
    throw new Error(
      "Production requires explicit VITE_BRAND_THEME=production and a consistent target",
    );
  if (devTarget && requested === "production")
    throw new Error("DEV must use VITE_BRAND_THEME=legacy");
  const production = requested === "production";
  const prefix = production ? "/branding/production/" : "/";
  return {
    production,
    name: production ? ("production" as const) : ("legacy" as const),
    colors: production ? productionColors : legacyColors,
    chart: production ? productionChart : legacyChart,
    secondary: production
      ? {
          main: officialPalette.purple,
          dark: "#B188FF",
          light: "#F4EDFF",
          contrastText: officialPalette.blue,
        }
      : {
          main: legacyColors.brand,
          dark: legacyColors.brandHover,
          light: legacyColors.brandSoft,
          contrastText: "#FFFFFF",
        },
    loginLogo: production ? `${prefix}logo.svg` : "/etlaasot-favicon.png",
    navbarLogo: production
      ? `${prefix}logo.svg`
      : "/et-laasot-bat-yam-logo.png",
    navbarAlt: production ? "עת לעשות" : "עת לעשות בת ים",
    favicon: `${prefix}favicon.ico`,
    apple: `${prefix}apple-touch-icon-180x180.png`,
    pwa64: `${prefix}pwa-64x64.png`,
    pwa192: `${prefix}pwa-192x192.png`,
    pwa512: `${prefix}pwa-512x512.png`,
    maskable: `${prefix}maskable-icon-512x512.png`,
  };
}

export function brandingCss(brand: ReturnType<typeof selectBranding>) {
  const names: Record<string, string> = { primaryHover: "primary-dark" };
  const rgb = (hex: string) =>
    [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(", ");
  const entries = Object.entries(brand.colors).map(
    ([name, value]) =>
      `--color-${names[name] ?? name.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}: ${value};`,
  );
  entries.push(
    `--color-primary-rgb: ${rgb(brand.colors.primary)};`,
    `--color-brand-rgb: ${rgb(brand.colors.brand)};`,
    `--color-success-rgb: ${rgb(brand.colors.success)};`,
  );
  return `:root {${entries.join("\n")}}`;
}
