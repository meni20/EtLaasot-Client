# Environment-based branding — local review

Prepared on origin/main 91d8476af2c6ede44749f4bb626f1654111f61f1. This authorized release promotes the prepared branding changes to Client main only, without merging dev. All 29 runtime/asset/test files match the shared DEV infrastructure at e92cb497110f27b2e287ef2baef9e2cd978c6609; only this documentation differs. Server, Documents and databases require no changes.

## Architecture

`branding/legacy.ts` preserves the previous colors/chart values; `branding/production.ts` defines the official eight colors, accessible semantic variants and chart accents. `branding.config.ts` selects one complete descriptor using `VITE_BRAND_THEME`. React, MUI, generated CSS variables, HTML metadata, manifest and Push consume that same selection. Vite mode/NODE_ENV never selects the brand. Standard development/production env files are read for local builds; Railway build variables take precedence.

Production target signals (Railway main identity, explicit production API/environment) require an explicit production profile and reject mixed DEV target signals. Missing/unknown/legacy Production values fail before bundling. DEV rejects production branding. Unconfigured local previews default to legacy. This is configuration validation, not a replacement for existing environment/authentication attestation.

Shared spacing, typography, layout, features and signature ink/requirements are unchanged. Existing high-contrast and reduced-transparency/motion overrides remain in index.css. The official purple is the MUI secondary fill with dark-blue text. Existing brand text/white-label action tokens use dark blue to preserve readability; green/yellow status foregrounds use accessible dark variants. The official pastel accents also supply backgrounds and chart colors.

Production SVG/icons from the prior local logo work are preserved. Files remain outside public and are emitted only for Production. The full navbar logo has a small white backing to keep its dark text readable on the blue header. Legacy styling has no backing. No PDF source is shipped; original PDFs remain outside the checkout/public.

## Railway settings

- DEV Client: `VITE_BRAND_THEME=legacy`.
- Production Client: `VITE_BRAND_THEME=production`.
- Preserve existing API URLs, registration flags and all other environment settings.
- These are build-time values: changing them requires a new Client build.
- No Server, Documents or database setting/migration is needed.

## Verification

- Both profile builds, TypeScript and targeted lint passed.
- Five focused tests passed: profile selection, full legacy color/CSS/image snapshots, invalid/mixed environment rejection, Production text contrast and the existing registration environment boundary.
- Actual Vite Production builds rejected missing, legacy and invalid profile settings before output generation.
- Artifact checks verify unchanged legacy image/ICO/Push bytes, Production-only assets, favicon/Apple/manifest/Push selection, unchanged PWA identity, current precache hashes, and no source PDFs.
- Local Chrome previews cover 1440px desktop and 390px mobile login/application screens using fictional, browser-intercepted API data; no requests reach DEV or Production APIs. They check CSS colors, JS errors and horizontal overflow.
- Pixel comparisons against the prior legacy build were identical for the four captured screens. This proves the covered views, not an exhaustive visual audit of every screen or every OS-installed PWA.
- Existing bundle-size warnings remain. No service-worker reload/unsaved-form protection was changed.

Commands: `node --experimental-strip-types --test tests/production-branding.test.ts tests/registration-production-environment.test.ts`; `npm run build` with the selected environment; `node scripts/check-branding-build.mjs legacy|production <output-directory>`.

## Shared DEV/main mechanism

DEV already contains the shared mechanism at e92cb497110f27b2e287ef2baef9e2cd978c6609 with VITE_BRAND_THEME=legacy. Production uses the same code with VITE_BRAND_THEME=production. Keep environment configuration separate and run both profile/artifact checks before future promotions. Do not overwrite ongoing feature work or weaken the explicit Production configuration gate.

## Production release verification and rollback

28 focused tests, both profile builds, TypeScript and targeted lint passed. Local browser checks cover login, application and registration entry at desktop/mobile sizes using synthetic intercepted API responses. The prior Production source (91d8476af2c6ede44749f4bb626f1654111f61f1) also built successfully with the Production settings and the new brand variable, confirming source rollback compatibility.

Previous Production deployment: 220e26a7-3eee-4eae-aea3-db48ca93f0a1. Rollback is available via railway redeploy --commit 91d8476af2c6ede44749f4bb626f1654111f61f1 --project e950a261-d932-48c2-bc19-86287cb374ef --environment b5bc66a8-10fd-45ac-af6b-99a84c84a338 --service b9306c97-9da0-45f1-abdb-e8eddf842e2d --yes. This selects the prior Client source only; no database action or Git reset is needed. Preserve all existing environment variables. No rollback was executed.

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
