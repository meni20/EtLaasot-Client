# Environment-based branding — local review

Shared infrastructure adapted in a separate worktree on origin/dev eac9b47eb1d475b36d1e4d36820f9eed5fde1d01 from the reviewed origin/main branding worktree. The source worktree is preserved. This release targets Client DEV only; Production, main, Server, Documents and databases remain untouched.

## Architecture

`branding/legacy.ts` preserves the previous colors/chart values; `branding/production.ts` defines the official eight colors, accessible semantic variants and chart accents. `branding.config.ts` selects one complete descriptor using `VITE_BRAND_THEME`. React, MUI, generated CSS variables, HTML metadata, manifest and Push consume that same selection. Vite mode/NODE_ENV never selects the brand. Standard development/production env files are read for local builds; Railway build variables take precedence.

Production target signals (Railway main identity, explicit production API/environment) require an explicit production profile and reject mixed DEV target signals. Missing/unknown/legacy Production values fail before bundling. DEV rejects production branding. Unconfigured local previews default to legacy. This is configuration validation, not a replacement for existing environment/authentication attestation.

Shared spacing, typography, layout, features and signature ink/requirements are unchanged. Existing high-contrast and reduced-transparency/motion overrides remain in index.css. The official purple is the MUI secondary fill with dark-blue text. Existing brand text/white-label action tokens use dark blue to preserve readability; green/yellow status foregrounds use accessible dark variants. The official pastel accents also supply backgrounds and chart colors.

Production SVG/icons from the prior local logo work are preserved. Files remain outside public and are emitted only for Production. The full navbar logo has a small white backing to keep its dark text readable on the blue header. Legacy styling has no backing. No PDF source is shipped; original PDFs remain outside the checkout/public.

## Railway settings

- DEV Client: `VITE_BRAND_THEME=legacy`, explicitly configured for this authorized DEV rollout.
- Future Production Client release requires `VITE_BRAND_THEME=production`; do not configure or deploy Production as part of the DEV rollout.
- Preserve existing API URLs, registration flags and all other environment settings.
- These are build-time values: changing them requires a new Client build.
- No Server, Documents or database setting/migration is needed.

## Verification

- Both profile builds, TypeScript and targeted lint passed.
- 28 focused tests passed, covering registration, approval/signature rules, access blocking, attendance retries, update protection, and: profile selection, full legacy color/CSS/image snapshots, invalid/mixed environment rejection, Production text contrast and the existing registration environment boundary.
- Actual Vite Production builds rejected missing, legacy and invalid profile settings before output generation.
- Artifact checks verify unchanged legacy image/ICO/Push bytes, Production-only assets, favicon/Apple/manifest/Push selection, unchanged PWA identity, current precache hashes, and no source PDFs.
- Local Chrome previews cover 1440px desktop and 390px mobile login/application screens using fictional, browser-intercepted API data; no requests reach DEV or Production APIs. They check CSS colors, JS errors and horizontal overflow.
- Pixel comparisons against a fresh origin/dev build using the same Railway DEV Vite settings were identical for six captured screens: login, application and registration entry at desktop/mobile sizes. Registration switching preserved national ID and branch; recovery-code input remained functional. This proves the covered views, not an exhaustive visual audit of every screen or every OS-installed PWA.
- Existing bundle-size warnings remain. No service-worker reload/unsaved-form protection was changed.

Commands: `node --experimental-strip-types --test tests/production-branding.test.ts tests/registration-production-environment.test.ts`; `npm run build` with the selected environment; `node scripts/check-branding-build.mjs legacy|production <output-directory>`.

## Future promotion and merge safety

The shared code is now prepared for Client dev with legacy branding. Keep dev's own API/build configuration. A future approved main release should use this same shared code and set Production Client to production before building. Run both builds/artifact checks and the legacy visual comparisons before merging. Do not copy main wholesale over dev or overwrite active feature work. Both branches should ultimately contain the same profiles and selection code; environment configuration supplies their different look. Keeping these checks in the release workflow detects removal/bypass of the mechanism; Git itself cannot prevent arbitrary future edits.

## Changed files (including the previously prepared logo changes)

- `BRANDING.md`
- `branding.config.ts`
- `branding/legacy.ts`
- `branding/production.ts`
- `branding/production/apple-touch-icon-180x180.png`
- `branding/production/favicon.ico`
- `branding/production/logo.svg`
- `branding/production/maskable-icon-512x512.png`
- `branding/production/pwa-192x192.png`
- `branding/production/pwa-512x512.png`
- `branding/production/pwa-64x64.png`
- `scripts/check-branding-build.mjs`
- `src/branding.d.ts`
- `src/components/Navbar/Navbar.tsx`
- `src/config/branding.ts`
- `src/features/parent-admission/TwoStepLogin.tsx`
- `src/features/parent-registration/Fields.tsx`
- `src/features/parent-registration/RegistrationAdmin.tsx`
- `src/features/parent-registration/RegistrationMobile.tsx`
- `src/features/parent-registration/SignaturePad.tsx`
- `src/features/parent-registration/Stages.tsx`
- `src/index.css`
- `src/main.tsx`
- `src/pages/DesktopPages/MentorAssignmentPage/MentorAssignment.styles.ts`
- `src/pages/Mobile/LoginPage/Login.tsx`
- `src/theme/them.ts`
- `src/theme/tokens.ts`
- `tests/legacy-branding.snapshot.json`
- `tests/production-branding.test.ts`
- `vite.config.ts`
