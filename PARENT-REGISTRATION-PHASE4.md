# Phase 4 Client — local only

Branch: `feature/parent-registration-phase4`, based on local unpushed Phase 3 commit `58c73d1507cb7d8e936b73e7b9ada4558f1655c3`. The local `dev`/Phase 3 commits are preserved. No Phase 4 commit, push, merge, environment edit or deployment was performed.

## Behavior

- `VITE_ID_FIRST_LOGIN_ENABLED=true` opts into an ID-only first step; existing users continue through the existing AuthContext password login and mandatory-password-change page. With the flag off, the previous login remains. The backend's password, role, reCAPTCHA, lockout, password-reset administration and session mechanism are retained.
- `VITE_APPLICANT_REGISTRATION_ENABLED=true` exposes `/apply` before authentication and a separate administrator route/menu at `/parent-applications-admin`. New applications choose server-provided active branches. Account creation is never performed by the public form.
- Applicant HTTP/session scope is independent of the application's JWT and unauthorized-session interceptor. Medical/draft data uses its own ephemeral React Query client. Session fallback tokens stay in memory; national IDs, draft data, signatures, recovery codes and temporary passwords are not put in URLs or browser persistent storage.
- A recovery code is returned once for explicit private download and acknowledgement. Recovery posts only the code; a national ID is never a recovery credential. The backend rotates both credentials. Losing/revoking the code has no ID-only fallback.
- The existing five stages, full original letter, all ten exact declarations, autosave, free navigation, first-parent requirement and optional separate second-parent signature/ID are reused. Content edits still invalidate both signatures. The chosen application branch is shown. Feedback and terminal approval/rejection states are shown through the credential-protected application API.
- Real uploads, submission and approval remain explicitly unavailable because the private evidence/PDF adapters are not installed. Local file/signature interaction does not pretend to upload or generate documents. No fixture references are used by the live adapter.
- Administrators list new applicants separately from renewals, review read-only signed versions and their selected branch, provide correction/rejection reasons, and must confirm manual identity verification. Approval remains disabled without current verified evidence and available integration; the Server rechecks independently. A successful future approval shows the existing temporary password once for manual delivery and clears it when the screen/selection is closed, without storing it in the query cache.
- `VITE_PARENT_REGISTRATION_BLOCKING_ENABLED=true` opts into authenticated trainee status checks and registration-only navigation. The Server's restriction response also triggers a fresh status check without logging out. Old routes/bookmarks are replaced by the registration route, mandatory password change retains priority, status failures fail closed, and admin/volunteer roles remain unaffected. Existing PWA update behavior is retained; no medical/API runtime caching was added.

All new flags default off; existing `VITE_PARENT_REGISTRATION_ENABLED` controls the authenticated Phase 3 route/menu. Live integration requires the existing explicit matching approved API URLs (`VITE_PARENT_REGISTRATION_API_URL`, `VITE_SERVER_URL`) and DEV opt-in where appropriate. No real `.env` file or Railway variable was changed.

## Safe offline commands

```powershell
npm run typecheck:registration
npm run test:registration
npm run test:phase4
npm run build
npm run test:registration:build
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
npm run test:registration:ui
npm run test:phase4:ui
```

The Phase 4 browser suite starts a dedicated loopback-only server on port 5184, loads no `.env` files, and uses a separate QA HTML entry plus mocked local HTTP responses. It never mounts the real application, contacts cloud services, registers a real service worker or logs into an account. Its PWA hook is stubbed only in the QA Vite configuration; browser tests cover restricted navigation/bookmarks, not a deployed service-worker upgrade on a physical installed PWA. There is no UI safety claim for unexecuted live integrations.

`npm run dev:phase4` serves the isolated harness at `http://127.0.0.1:5184/phase4-demo.html`. It requires a local mock responder (the Playwright suite supplies it); it is not a real registration service. The ordinary Phase 3 demo remains at port 5183. Both demo HTML files and fixture markers are excluded from published build artifacts by `test:registration:build`. QA screenshots/results remain ignored under `.registration-qa`.

Actual API testing requires separately approved isolated database preparation and migration 031. Do not point the normal application at DEV/Production or run migrations to preview these screens. See the Server's `PARENT-REGISTRATION-PHASE4.md` for API routes, credentials, migration order, seven prepared PostgreSQL tests, upload/PDF contract mismatches and the approval checkpoint.

See the Server's `PARENT-REGISTRATION-PHASE4-RESULTS.md` for the complete file inventory and final validation results. Documents, Storage, encryption keys, cloud records and main/Production are outside this local change.
