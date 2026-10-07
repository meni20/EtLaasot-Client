# Android PWA installation

## Current architecture

Et-Laasot Client is a pure browser-installed Progressive Web App built with
Vite, React, `vite-plugin-pwa`, and Workbox. The repository does not contain an
Android project, APK/AAB, Trusted Web Activity (TWA), Bubblewrap, PWABuilder,
Capacitor, Cordova, or native WebView wrapper.

On an Android device with Google Chrome and Google Mobile Services, Chrome may
turn the installed PWA into a browser-managed WebAPK. Chrome/Google—not this
repository—builds and signs that Android package. Other browsers may create a
shortcut or use their own WebAPK provider.

## Play Protect warning and ownership boundary

The warning "This app was built for an older version of Android" is emitted for
an Android package whose `targetSdkVersion` is too old for the device. A web app
manifest has no `targetSdkVersion`, `compileSdkVersion`, or `minSdkVersion`.

Because this repository has no Android package, it cannot set or repair those
values. For an installation started by this application's install button, the
package is created by the current browser/provider. The device must be checked
to distinguish among:

- a Chrome-generated WebAPK;
- a Samsung Internet-generated WebAPK;
- an older sideloaded APK or TWA from outside this repository; or
- a stale package already installed on the device.

Do not bypass Play Protect and do not enable installation from unknown sources
as a workaround. If the warning is shown, cancel the installation and collect
the browser/version, Android version, package name, installer, and target SDK as
described below.

Audit observation (2026-10-07): Google's Play Protect guidance says this
specific compatibility warning appears when an APK targets an API level more
than two versions behind the device. The current Chromium WebAPK shell template
declares `targetSdkVersion="33"`; on Android 16/API 36 that is three API levels
behind. This establishes a credible browser-WebAPK cause, but the affected
device's generated package still has to be inspected because the installed
Chrome release, minting service, Samsung provider, or a stale package may carry
different metadata.

- [Google Play Protect warning guidance](https://developers.google.com/android/play-protect/warning-dev-guidance)
- [Chromium WebAPK shell manifest](https://chromium.googlesource.com/chromium/src/+/main/chrome/android/webapk/shell_apk/AndroidManifest.xml)

## Manifest configuration

`vite.config.ts` generates `/manifest.json` and injects the matching
`<link rel="manifest">` into the production HTML. The `.json` filename is used
because the production static host served `.webmanifest` as
`binary/octet-stream`. The local production preview confirms that the new file
is served as `application/json`; its deployed Render header must be rechecked
after a future approved deployment.

The manifest uses:

- stable `id`, `start_url`, and `scope` values of `/`;
- `display: "standalone"`;
- Hebrew language and RTL direction;
- matching theme and background colours;
- 192x192 and 512x512 general-purpose PNG icons; and
- a separate 512x512 maskable PNG whose artwork stays inside the maskable safe
  zone.

There is no `related_applications` entry and no
`prefer_related_applications: true`, so the browser is not redirected to an
obsolete native application.

## Service-worker architecture

`vite-plugin-pwa` generates `/sw.js` with Workbox. `PwaUpdatePrompt` registers
it for every user-visible route, including login, forced password change,
mobile users, and admins. Its root location gives it `/` scope.

The service worker:

- precaches the versioned application shell and static build assets;
- serves `/index.html` as the navigation fallback for client-side routes;
- excludes same-origin `/api` and `/auth` navigation paths;
- imports the existing push-notification handlers;
- removes obsolete Workbox precaches; and
- keeps the existing prompt-based update flow, activating an update only after
  the user chooses to update.

There are no runtime API caching rules. Authenticated API responses and
mutation requests are not added to Cache Storage. Offline mode therefore keeps
the existing application-shell behavior; fresh server data still requires a
network connection.

## Install UI

`PwaInstallProvider` captures `beforeinstallprompt`, stores it, and calls
`prompt()` only from an explicit install-button action. It handles
`userChoice`, listens for `appinstalled`, and checks
`(display-mode: standalone)`. Installation is optional and never blocks normal
application use. A new `beforeinstallprompt` event also clears stale in-memory
installed state, so uninstalling and later revisiting in Chrome can expose the
install action again without changing the persistent device installation ID.

The shared login/profile install button and the admin Settings row use this
same provider. iOS continues to show Add to Home Screen instructions because
`beforeinstallprompt` is not available there.

## Developer validation

1. Run `npm ci` when dependencies are not already installed.
2. Run `npm run lint`.
3. Run `npm run build` with the intended `VITE_SERVER_URL` supplied by the
   target environment.
4. Run `npm run preview -- --host 127.0.0.1`.
5. In current Chrome DevTools, open **Application > Manifest** and verify the
   identity, standalone display mode, icon previews, maskable safe area, and
   absence of installability errors.
6. Open **Application > Service Workers** and verify `/sw.js` is activated with
   root scope. Use **Update** to check the waiting/update flow.
7. Open **Application > Storage > Cache Storage** and verify only application
   shell/static assets are cached; authenticated API responses must not appear.
8. Check the Console and Network panels for manifest, service-worker, icon,
   mixed-content, scope, or Content Security Policy errors.
9. Test a direct client route (for example `/login`) and refresh it to verify
   the hosting SPA fallback.
10. Test offline mode after one successful online load. Expect the shell and
    precached UI to load; server-backed data and mutations should fail safely
    until connectivity returns.

Do not rely solely on the deprecated Lighthouse PWA badge. Chrome's Application
panel and a physical Android installation are authoritative for this flow.

## Clean Android install test

1. Update Google Chrome, Google Play services, the Play Store, Android System
   WebView, and Android itself.
2. In Android Settings > Apps, uninstall every existing Et-Laasot entry. Record
   its package name and installer before uninstalling if investigating a
   warning.
3. Remove old Et-Laasot home-screen shortcuts.
4. In Chrome, clear site data for the production Et-Laasot origin. This signs
   the user out and removes local site data, Cache Storage, and old service
   workers; do it only on a test device or after saving any unsynced work.
5. Open Chrome directly—not an in-app browser or a link embedded in another
   app—and navigate to the production HTTPS URL.
6. Let the page load fully. Interact with it and allow Chrome's installability
   checks to complete.
7. Use Chrome's three-dot menu and choose **Install app** (or the current
   Chrome install wording), or use the in-app install button.
8. If Play Protect displays an old-target warning, cancel. Do not choose an
   override. Follow the diagnostic procedure below.
9. After a successful install, close Chrome and launch Et-Laasot from the app
   launcher.
10. Verify there is no browser toolbar, login/session works, navigation and
    refresh work, and supported deep links remain inside the app.
11. Test offline shell behavior, reconnect, and verify server data recovers.
12. Uninstall and repeat once to rule out stale package metadata.

## Resetting the PWA completely

Uninstall the app from Android Settings > Apps rather than deleting only the
launcher icon. Then clear Chrome site data for the production origin. Clearing
site data removes the local installation identifier and other local state, so
it should be done deliberately and never while unsynced work is present.

## Diagnosing future Play Protect warnings

Before changing web code, record:

1. Android version/API level and device model.
2. Browser name and exact version used to start installation.
3. Whether the browser showed **Install app** or only **Add to Home screen**.
4. The installed/blocked package name and installer shown by Android.
5. Whether the same clean URL installs through current Google Chrome.
6. Whether the problem reproduces for other known-good PWAs in that browser.

When Android platform tools are available on a dedicated test device, use
read-only package inspection to identify the artifact (replace the placeholder
with the package found on the device):

```text
adb shell pm list packages | findstr /i webapk
adb shell dumpsys package <package-name> | findstr /i "targetSdk versionName installer"
```

These commands diagnose package metadata; they do not bypass installation
security. A package name such as `org.chromium.webapk.*` indicates a
browser-managed WebAPK. If the package belongs to an APK/TWA not present in this
repository, locate its separate source/build pipeline before changing it.

## Chrome and Samsung Internet

Chrome and Samsung Internet can use different WebAPK minting infrastructure,
package metadata, and update schedules. A successful Chrome install does not
prove that a Samsung Internet-generated package is current, and the reverse is
also true. The supported verification path for this project is current Google
Chrome on a certified Android device. If a warning appears only in Samsung
Internet, report it to that browser provider with the package/browser details;
do not weaken the PWA or Android security settings.

## Digital Asset Links and Android SDK versions

Digital Asset Links are not required for a normal browser-installed PWA. This
project intentionally does not publish `/.well-known/assetlinks.json`.
`targetSdk`, `compileSdk`, Gradle, Android signing, and Play App Signing are not
applicable because there is no owned Android wrapper in this repository. If a
TWA is introduced later, it must be treated as a separate Android release
artifact, target the then-current required API, and have its production signing
certificate verified before publishing asset links.
