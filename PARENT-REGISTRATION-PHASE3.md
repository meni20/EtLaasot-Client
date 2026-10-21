# Parent Registration — Phase 3 local review

Implemented on `feature/parent-registration-frontend`, created from the existing local `dev` on 2026-10-21. All work is uncommitted. Server remains on `feature/parent-registration-backend`; its existing Phase 2 working tree was preserved. This phase made no Server or Documents changes, database connections, SQL queries, migrations, commits, pushes, merges, deployments or external resource changes.

## Open the interface safely

From `C:\Users\User\Et-Laasot-2\EtLaasot-Client`:

```powershell
npm run dev:registration
```

Open <http://127.0.0.1:5183/parent-registration-demo.html>. The server binds only to `127.0.0.1`; strict port selection prevents using another application accidentally. The preview is currently running there. Stop this preview with Ctrl+C in its terminal when finished.

This is an explicitly labelled, in-memory **UX demonstration**, not a database integration environment. Refresh clears all fictional drafts, selected files and completed signatures. Actor/scenario changes reset that session. Select trainee, branch administrator or super administrator, and the desired scenario. “טיוטה מלאה לחתימה” provides fictional completed fields so signatures and local submission validation can be tried immediately. Parent 1 ID is `000000018`; Parent 2 ID is `000000026` in that fixture; both are fictional checksum examples. Clear Parent 2 ID to try one-parent signing.

Do **not** start the ordinary Client/Server development commands for isolated integration yet. The ordinary application has existing environment/configuration and providers that contact its configured API.

## Implemented screens

- Full original parent letter, clarifications and medical-summary requirement before the stages, with a reopenable accessible dialog. The exact Hebrew text was copied read-only from the reviewed Documents content.
- Five freely navigable RTL stages: identity, parents/contacts/school, medical/developmental information, exact ten server declarations, and attachments/signatures. Required markers, conditional explanations, medication rows and per-stage error placement are included.
- Profile autofill uses known contact/profile attributes only, does not split a full name, infer an ID from a masked ID or overwrite saved/explicitly cleared values.
- Debounced and stage-change autosave serializes requests and drains later edits using the returned revision. Network/validation failures retain the draft and permit correction/retry. A 409 stops saving/editing; explicitly confirmed server reload discards unsaved local edits. No automatic mutation retry or conflict overwrite.
- Completed signatures require an explicit finish action and record a local signing time. High-DPI canvas, pointer capture, touch input, cancellation, clear/redo and descriptive labels are supported. Partial strokes remain in the mounted canvas only. Content/file changes clear both signatures; navigation alone preserves completed signatures in memory.
- Final required/conditional/ID/contact validation, navigation to the first invalid stage, duplicate-click guard and direct local UX transition to pending confirmation. There is no review screen.
- Required, draft, pending, corrections with reason, approved and not-required states. The live API only returns IDs/documents for a previous approval, not its signed data; when there is no active form the UI does not invent an editable approved form.
- Admin branch/year selection, counts for each status, current-page name/ID search, status filter, pagination, annual opening confirmation, individual renewal reason/blocking choice, read-only submitted versions and declarations, profile differences, medical-preservation notice, request-changes reason and PDF-gated approval.
- Navigation/profile entry points reuse existing trainee/admin roles and are hidden unless `VITE_PARENT_REGISTRATION_ENABLED=true`. Existing login/router enforcement was not changed. Access blocking is not implemented or activated.

## API status and honest limits

The typed adapter follows the existing Phase 2 controllers/DTOs and uses the existing authenticated Axios/token/cookie behavior. Error messages retain only safe HTTP status/field information, not Axios request objects or sensitive response bodies. React Query caches are session-scoped by the existing session reset; sensitive form/list/detail caches have zero inactive retention and are never persisted.

**No interaction was exercised against a real isolated API in Phase 3.** All browser interactions used the labelled adapter. Tests of the real adapter use a stub HTTP transport to verify contracts/error handling, not a live server. The existing six Phase 2 PostgreSQL tests are prior evidence and were not rerun here.

Current backend limits:

1. No physician/signature upload endpoint, authenticated document-view URL, or connected PDF generation. Selection is limited locally to PDF/JPEG/PNG, nonempty and up to 10 MiB, as a preliminary UI guard; the future upload service must validate actual file contents and its own limits. Nothing is uploaded. Completed images and selected files do not enter draft payloads or persistent storage.
2. Real submit is deliberately unavailable. The live adapter's DTO exists for later integration, but this UI does not call it without real verified attachments. Mock `submit` is also unavailable: the separate demo transition only changes the local displayed status after client validation, creates no document IDs/references, and leaves PDF pending. No upload, PDF or actual submission success is claimed.
3. Approval requires `PENDING_REVIEW`, `documentStatus=READY`, the latest submitted version and a verified PDF belonging to that version. The backend remains authoritative. Demo PDFs are never marked READY and demo approval cannot succeed.
4. The forms list has no server-side search or trainee names. Names come from the existing branch-scoped `/user/get-all-trainees` endpoint; search is explicitly labelled as the current 25-row page. The existing trainee endpoint caps results at 500; unknown names retain their UUID. An all-pages search/expanded directory needs a backend enhancement.
5. The medical contract stores combined conditions/diagnoses in `medical.conditions`; mobility and feeding-assistance details use `development.details`. No unsupported JSON keys were introduced. Medical profile synchronization remains manual.
6. Admin history is the submitted-version history actually returned by `detail`; no audit-history endpoint or fake document preview was invented.

Live integration is **off by default**. After the separate isolated-startup work and approval, its configuration requires all of:

```text
VITE_PARENT_REGISTRATION_ENABLED=true
VITE_PARENT_REGISTRATION_API_URL=http://127.0.0.1:<approved-api-port>
VITE_SERVER_URL=http://127.0.0.1:<same-approved-api-port>
```

The new page refuses non-loopback URLs, credential-bearing URLs or a mismatch with the application's API. There is no default address and no Dev/Production fallback. Do not change existing environment files to try this now. The production feature remains gated; do not enable it for current users.

The dedicated demo does not load `.env` files, App, AuthProvider, application services, PWA registration or existing session providers. Its CSP permits only local-origin connections and the loopback HMR socket. Its own entry/fixtures are absent from the normal production build; `scripts/check-registration-build.mjs` verifies this.

## Repeatable checks

```powershell
npm run typecheck
npm run typecheck:registration
npm run test:registration

# This machine's cached Playwright browser failed to spawn. Use installed Chrome:
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm run test:registration:ui

npm run build
npm run test:registration:build
npx eslint src/features/parent-registration tests/registration-ui tests/registration.model.test.ts vite.registration.config.ts playwright.registration.config.ts
git diff --check
```

Node 24 was used. `@playwright/test` is pinned to 1.58.2. On another machine use that Playwright version's installed Chromium (unset the optional executable override) or provide a browser path. No browser installation was performed in this phase. Chrome was used only for frontend UI checks, not a Documents/Linux/container test.

Ignored `.registration-qa/` contains screenshots of the full letter, all five stages and desktop review. They use fictional data. Browser tests include 320/390px RTL layouts, navigation, autofill, autosave/conflicts/retry, conditional medical fields, exact declarations, one/two-parent signing, missing second-parent ID, high-DPI canvas/partial-stroke disposal, signature invalidation, unavailable upload, validation, duplicate clicks, status transitions, scoped admin selectors, read-only review and pending-PDF approval protection. These demonstrate client behavior, not server authorization enforcement.

The final verification results and complete file inventory are in `PARENT-REGISTRATION-PHASE3-RESULTS.md`.

## Database integration proposal — approval required, not executed

The retained PostgreSQL 17 sandbox is `127.0.0.1:55439`, data directory `C:\Users\User\Et-Laasot-2\EtLaasot-Server\.tmp\parent-registration-postgres-20261020-a`. The two Phase 2 databases and their evidence must remain unchanged. This phase has not re-attested or connected to that server.

Reasons not to start the application now:

- Phase 2 used five synthetic prerequisite tables and the six registration tables, not the full application schema.
- Its ephemeral JWT/encryption keys were intentionally not retained. Fresh keys cannot decrypt its signed evidence.
- `src/app.module.ts` invokes `scripts/runtime-environment.cjs`, which selects existing development/production environment files based on branch. Environment loading also treats the encryption key specially. Merely exporting a different database URL is not a sufficient safeguard.
- Historical migrations start with ALTERs of pre-existing tables. Running the normal migration command on an empty database is not a full-schema bootstrap.
- Real authentication imports branch/user dependencies; replacing JWT validation or branch checks with a mock is not an acceptable real integration test.

Proposed bounded work after approval:

1. Add a dedicated Server local startup/provisioning harness on its existing feature branch, without changing normal startup defaults. Bypass the ordinary environment loader completely, use an explicit allowlist, prevent fallback, disable SQL/request-payload logging and automatic schema sync, bind the API to `127.0.0.1:3103` only, and refuse to start if that port is occupied. Retain the real authentication/password/JWT and branch authorization code. Disable external email/OAuth/Storage/Push/Documents calls in this local host; keep registration access blocking disabled.
2. Reverify OS identity first: approved manifest, canonical data directory, owner/ACL, PostgreSQL 17 executable, listener address/port/PID, parent process/postmaster identity and cluster identifier. Then run the authenticated read-only nonce/database/role/server-settings attestation before any ORM/bootstrap queries. Apply the Phase 2 connection-completion safeguard to **every** pool connection, including the bootstrap connection; it must reject unknown host/port/database/role/nonce/system identifier/data directory before application queries. Any mismatch aborts immediately. No access to ports 5432/5433, `.local-postgres`, Supabase or Railway.
3. Only inside that verified cluster, create one new database named `etlaasot_parent_registration_ui_20261021` and one fresh limited login/owner named `etlaasot_parent_registration_ui`. Refuse either name if it already exists. The bootstrap connection may target only the manifest-approved sandbox maintenance database; application connections may target only the new UI database. Do not grant access to retained test databases or reuse application credentials.
4. Generate new local database credentials, JWT secret and national-ID hashing/encryption keys. Retain them with CurrentUser DPAPI encryption and owner/SYSTEM-only ACL under the new ignored directory `EtLaasot-Server\.tmp\parent-registration-ui-20261021`. Never print them, emit credential-bearing connection strings, commit them or reuse Phase 2 ephemeral keys.
5. Prepare and review an explicit local baseline from the current application model/raw-query dependencies before executing its SQL. The known pre-registration model tables are `user`, `roles`, `user_roles`, `branch`, `event`, `attendee`, `event_pairing`, `volunteer_activity`, `mentor_assignment`, `trainee_medications`, `trainee_documents`, `calendar_month_background`, `pwa_installations` and `push_subscriptions`. Include every column/FK/index required by the actual auth/profile/navigation queries. This baseline is **not implemented or validated yet**; stop for review if additional dependencies or migrations are discovered. Apply that reviewed baseline plus only migration `030_parent_registration.sql` and a dedicated UI nonce marker to the fresh database. Do not replay historical migrations, call `npm run migrate`, use runtime `sync/alter`, or modify the synthetic baseline/retained databases.
6. Seed only two fictional branches, an activity year, two fictional trainees, two branch administrators and one super administrator with the existing role IDs. Store password hashes through the existing password utility. Restrict all fixture/role writes to this new database. Confirm both positive login behavior and unauthorized/cross-branch denial before using the frontend. No import/export of real people or authentication data.
7. Start the isolated authenticated API only after its schema/attestations pass. Use a separate temporary Client environment/configuration that sets both API URLs to that loopback host and has no production service worker/session. Run the same UI flows against real draft/status/feedback/admin endpoints. Retain the unavailable-upload/PDF safeguards: do not manufacture verified assets to claim real submission/approval works. Test real 401/403, competing revisions, annual scoping, returned draft edits and medical-record preservation.
8. Stop only the processes started by this new harness when testing finishes. Keep the cluster and test databases for review unless deletion is separately requested. Future removal must attest the same cluster, confirm the exact UI database name/nonce, stop its API, remove only that database/role and its dedicated key directory, and preserve both Phase 2 databases. No cleanup is executed by this phase.

Approval would cover new local role/database/schema/fictional fixtures and isolated startup within that verified sandbox only. It would not authorize uploads, production routes, external resources or any existing Dev/Production database. The proposed harness/bootstrap must first be made reviewable and pass its non-mutating safety tests; the current frontend commands above do not provision anything.

## Discarding this feature safely

The Client started clean; only this phase's local uncommitted feature work was added. Stop its loopback preview and review the full inventory before deleting/restoring any files. New Client files may be removed and the six modified Client files restored to the feature branch base, followed by `npm ci` if removing the added test dependency. Do not reset/clean the parent workspace or the Server repository: Server contains independent uncommitted Phase 2 work. No database or cloud rollback is necessary for discarding this frontend.

## Subsequent DEV preparation — 2026-10-21

The later DEV audit adds an explicit opt-in for the verified Railway DEV API, while preserving the loopback target and keeping feature flags off. Non-loopback access requires `VITE_PARENT_REGISTRATION_ENVIRONMENT=dev` and both API URLs must match `https://etlaasot-server-dev-dev.up.railway.app`. Production and arbitrary hosts remain rejected. The local-only restriction described above is the original Phase 3 boundary; this later preparation supersedes that restriction only for the named DEV target. The new ID-first login, independent applicant flow, account creation on approval and access enforcement are Phase 4 and were not implemented. Current tests, migration findings and the approval checkpoint are in the [DEV audit report](C:/Users/User/Et-Laasot-2/EtLaasot-Server/PARENT-REGISTRATION-DEV-AUDIT.md). No deployment or database migration was performed.
