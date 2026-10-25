import { test, expect, type Page } from "@playwright/test";
import {
  demoDeclarations as DECLARATIONS,
  demoDeclarationVersion as DECLARATION_VERSION,
} from "../../src/features/parent-registration/demo/legal.fixture";

const id = "00000000-0000-4000-8000-000000000001",
  branch = "phase4-fictional-branch";
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.exposeFunction("phase4BrowserErrors", () => errors);
});
test.afterEach(async ({ page }) => {
  if (!page.isClosed())
    expect(
      await page.evaluate(
        async () =>
          await (
            window as unknown as {
              phase4BrowserErrors: () => Promise<string[]>;
            }
          ).phase4BrowserErrors(),
      ),
    ).toEqual([]);
});
async function mock(
  page: Page,
  options: {
    known?: boolean;
    corrections?: boolean;
    restricted?: boolean;
    pdfAvailable?: boolean;
    submitted?: boolean;
  } = {},
) {
  let authorized = options.submitted ?? false;
  let blocked = options.restricted ?? false;
  let state = {
    application: {
      id,
      branchId: branch,
      status: options.submitted
        ? "PENDING_REVIEW"
        : options.corrections
          ? "CHANGES_REQUESTED"
          : "DRAFT",
      revision: 0,
      currentStep: 1,
      documentStatus: "PENDING",
      feedbackReason: options.corrections ? "נא להשלים פרטים לדוגמה" : null,
    },
    data: { trainee: { nationalId: "123456782" } } as Record<string, unknown>,
    contentHash: "a".repeat(64),
    declarations: [...DECLARATIONS],
    declarationVersion: DECLARATION_VERSION,
    integration: "UNAVAILABLE",
  };
  const calls: { url: string; method: string; body: unknown }[] = [];
  await page.route("**/*", async (route) => {
    const req = route.request(),
      url = new URL(req.url());
    if (url.hostname !== "127.0.0.1") {
      await route.abort();
      return;
    }
    const path = url.pathname;
    if (
      !path.startsWith("/parent-applications") &&
      !path.startsWith("/auth/") &&
      !path.startsWith("/parent-registration/") &&
      path !== "/user/me"
    ) {
      await route.continue();
      return;
    }
    let body: unknown = null;
    try {
      body = req.postDataJSON();
    } catch {
      /* GET */
    }
    calls.push({ url: req.url(), method: req.method(), body });
    const reply = (data: unknown, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        headers: { "Cache-Control": "private, no-store" },
        body: JSON.stringify(data),
      });
    if (path === "/auth/identify")
      return reply({ next: options.known ? "PASSWORD" : "REGISTER" });
    if (path === "/parent-applications/branches")
      return reply([
        { id: branch, name: "סניף בדיקה מקומי", city: "עיר בדיקה" },
      ]);
    if (
      path === "/parent-applications/start" ||
      path === "/parent-applications/recover"
    ) {
      authorized = true;
      return reply({
        application: state.application,
        sessionToken: "s".repeat(43),
        recoveryCode: "r".repeat(43),
        expiresAt: "2099-01-01",
      });
    }
    if (path === "/parent-applications/me")
      return reply(state, authorized ? 200 : 401);
    if (path === "/parent-applications/me/draft") {
      const draft = body as {
        data: Record<string, unknown>;
        currentStep: number;
      };
      state = {
        ...state,
        data: draft.data,
        application: {
          ...state.application,
          revision: state.application.revision + 1,
          currentStep: draft.currentStep,
        },
      };
      return reply(state);
    }
    if (path === "/parent-applications/session/revoke") {
      authorized = false;
      return reply({ ok: true });
    }
    if (path === "/parent-applications/admin")
      return reply({
        rows: [
          {
            ...state.application,
            applicantName: "חניך בדיקה",
            pdfDocumentId: options.pdfAvailable
              ? "00000000-0000-4000-8000-000000000003"
              : null,
          },
        ],
        count: 1,
      });
    if (path === `/parent-applications/admin/${id}`)
      return reply({
        application: { ...state.application, status: "PENDING_REVIEW" },
        versions: [
          {
            id: "00000000-0000-4000-8000-000000000002",
            versionNumber: 1,
            data: state.data,
            declarations: state.declarations,
            declarationVersion: state.declarationVersion,
          },
        ],
        documents: [],
        integration: "UNAVAILABLE",
      });
    if (path.startsWith("/parent-applications/admin/"))
      return reply({ ok: true });
    if (path === "/parent-registration/me/status")
      return reply({
        form: null,
        annualRequired: blocked,
        registrationRequired: blocked,
        wouldBlockAccess: blocked,
        accessBlocked: blocked,
        annualActivityYearId: null,
        documentIntegration: "DEFERRED",
      });
    if (path === "/parent-registration/me")
      return reply({
        form: null,
        data: {},
        contentHash: "a".repeat(64),
        declarations: state.declarations,
        declarationVersion: state.declarationVersion,
        previousApproved: null,
      });
    if (path === "/parent-registration/me/feedback")
      return reply({
        formId: null,
        status: null,
        reason: null,
        requestReason: null,
      });
    if (path === "/user/me")
      return reply({
        id: "fictional-user",
        name: "חניך בדיקה",
        nationalIdMasked: "*****6782",
      });
    return reply({ code: "UNAVAILABLE" }, 503);
  });
  return {
    calls,
    approve: () => {
      blocked = false;
    },
  };
}
test("ID-first existing login uses the existing password-change screen", async ({
  page,
}) => {
  await mock(page, { known: true });
  await page.goto("/phase4-demo.html");
  await expect(page.getByLabel("סיסמה", { exact: true })).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "המשך בקשה עם קוד שחזור" }),
  ).toHaveCount(0);
  await page.getByLabel("תעודת זהות", { exact: true }).fill("123456782");
  await page.getByRole("button", { name: "המשך", exact: true }).click();
  await expect(page.getByText("שינוי תעודת זהות", { exact: true })).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: "שינוי תעודת זהות" }).click();
  await expect(page.getByLabel("תעודת זהות", { exact: true })).toBeEnabled();
  await expect(page.getByLabel("סיסמה", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "המשך", exact: true }).click();
  await page.screenshot({
    path: ".registration-qa/two-step-login-edit-icon.png",
    fullPage: true,
  });
  await page.getByLabel("סיסמה", { exact: true }).fill("Fictional-password-1");
  await page.getByRole("button", { name: "התחבר", exact: true }).click();
  await expect(page.getByLabel("סיסמה נוכחית")).toBeVisible();
});
test("unknown ID starts an independent branch-selected application, with mandatory recovery saving", async ({
  page,
}) => {
  const { calls } = await mock(page);
  await page.goto("/phase4-demo.html");
  await page.getByLabel("תעודת זהות", { exact: true }).fill("123456782");
  await page.getByRole("button", { name: "המשך", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "כניסה עם סיסמה קיימת" }),
  ).toHaveCount(0);
  await expect(
    page.getByText("לסיוע בסיסמה יש לפנות למנהל הסניף.", { exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "להתחלת רישום חניך" }).click();
  await expect(page.getByText("בקשה חדשה", { exact: true })).toBeVisible();
  await expect(
    page.getByText("הבקשה אינה חשבון משתמש.", { exact: false }),
  ).toHaveCount(0);
  await page.getByLabel("סניף פעיל").click();
  await page.getByRole("option").first().click();
  await page.getByRole("button", { name: "יצירת בקשה ללא חשבון" }).click();
  await expect(
    page.getByText("קוד השחזור מוצג פעם אחת.", { exact: false }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "שמירת קוד שחזור פרטי" }),
  ).toHaveCount(0);
  await expect(
    page.getByText("סיום הגישה מבטל גם את קוד השחזור.", { exact: false }),
  ).toHaveCount(0);
  await expect(page.getByLabel("קוד שחזור", { exact: true })).toHaveValue(
    "r".repeat(43),
  );
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => undefined },
    });
  });
  await page.getByRole("button", { name: "העתקת קוד השחזור" }).click();
  await expect(
    page.getByText("קוד השחזור הועתק", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "שמרתי את קוד השחזור במקום בטוח" })
    .click();
  await expect(
    page.getByRole("button", { name: "קראתי, המשך למילוי הטופס" }),
  ).toBeVisible();
  expect(calls.some((c) => c.url.includes("/create-trainee"))).toBe(false);
  expect(
    calls.every(
      (c) => !c.url.includes("123456782") && !c.url.includes("r".repeat(43)),
    ),
  ).toBe(true);
  expect(
    await page.evaluate(() => JSON.stringify({ ...localStorage })),
  ).not.toContain("123456782");
});
test("submitted new trainee sees only the minimal completion message", async ({
  page,
}) => {
  await mock(page, { submitted: true });
  await page.goto("/phase4-demo.html?screen=apply");

  await expect(
    page.getByText("הטופס נשלח בהצלחה והועבר לטיפול.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="CheckCircleOutlineIcon"]'),
  ).toBeVisible();
  await expect(page.getByRole("button")).toHaveCount(0);
  await expect(page.getByText("PDF", { exact: false })).toHaveCount(0);
  await expect(
    page.getByText("עת לעשות · בקשת רישום חניך", { exact: true }),
  ).toHaveCount(0);
});
test("correction recovery rotates credentials and opens all five existing RTL stages", async ({
  page,
}) => {
  await mock(page, { corrections: true });
  await page.goto("/phase4-demo.html?screen=apply");
  await page.getByLabel("קוד שחזור פרטי", { exact: true }).fill("r".repeat(43));
  await page.getByRole("button", { name: "שחזור גישה מאובטח" }).click();
  await page
    .getByRole("button", { name: "שמרתי את קוד השחזור במקום בטוח" })
    .click();
  await expect(page.getByText("נא להשלים פרטים לדוגמה")).toBeVisible();
  await page.getByRole("button", { name: "קראתי, המשך למילוי הטופס" }).click();
  await expect(
    page.getByRole("navigation", { name: "שלבי הרישום" }).getByRole("button"),
  ).toHaveCount(5);
  await page
    .getByRole("navigation", { name: "שלבי הרישום" })
    .getByRole("button")
    .nth(4)
    .click();
  await expect(
    page.getByText("הורה 1 — חתימה חובה", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText("הורה 2 — חתימה נוספת (רשות)", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText("הקבצים והחתימות יישמרו באחסון פרטי בעת השליחה.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.setViewportSize({ width: 320, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: ".registration-qa/phase4-signing-320.png",
    fullPage: true,
  });
});
test("administrator review is separate and cannot approve without medical/PDF evidence", async ({
  page,
}) => {
  const { calls } = await mock(page, { pdfAvailable: true });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/phase4-demo.html?screen=admin");
  await expect(page.getByText(id.slice(0, 8), { exact: false })).toHaveCount(0);
  const popupPromise = page.waitForEvent("popup");
  await page
    .getByRole("button", { name: "פתיחת PDF הרישום של חניך בדיקה" })
    .click();
  const pdfPage = await popupPromise;
  await pdfPage.waitForURL(/\/registration-pdf\?/);
  expect(pdfPage.url()).toContain("/registration-pdf?source=APPLICATION");
  expect(pdfPage.url()).toContain(`formId=${id}`);
  expect(pdfPage.url()).toContain(
    "documentId=00000000-0000-4000-8000-000000000003",
  );
  await pdfPage.close();
  await expect(
    page.getByRole("button", { name: "אישור ויצירת חשבון חניך" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "חניך בדיקה · טיוטה" }).click();
  await expect(
    page.getByRole("button", { name: "אישור ויצירת חשבון חניך" }),
  ).toBeDisabled();
  await page.screenshot({
    path: ".registration-qa/phase4-admin.png",
    fullPage: true,
  });
  await page.getByLabel("סיבת החזרה לתיקון או דחייה").fill("סיבה בדויה לתיקון");
  await page.getByRole("button", { name: "החזרה לתיקון" }).click();
  expect(
    calls.some(
      (c) => c.url.endsWith("/request-changes") && c.method === "POST",
    ),
  ).toBe(true);
});
test("old bookmarks become registration-only and approval restores normal navigation", async ({
  page,
}) => {
  const state = await mock(page, { restricted: true });
  await page.goto("/phase4-demo.html?screen=restricted");
  await expect(
    page.getByText("נדרש אישור רישום.", { exact: false }),
  ).toBeVisible();
  await expect(page.getByText("גישה רגילה לדוגמה")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "רישום הורים לפעילויות", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("הגישה לאפליקציה מוגבלת עד לקבלת האישור.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText("חסימת השימוש באפליקציה עדיין אינה מופעלת.", {
      exact: false,
    }),
  ).toHaveCount(0);
  await page.screenshot({
    path: ".registration-qa/phase4-restricted.png",
    fullPage: true,
  });
  state.approve();
  await page.getByRole("button", { name: "בדיקת אישור מחדש" }).click();
  await expect(page.getByText("גישה רגילה לדוגמה")).toBeVisible();
});

test("registration preparation is hidden by default; enabled selector preserves ID/branch without volunteer creation", async ({
  page,
}) => {
  const { calls } = await mock(page);
  await page.goto("/phase4-demo.html");
  await page.getByLabel("תעודת זהות", { exact: true }).fill("123456782");
  await page.getByRole("button", { name: "המשך", exact: true }).click();
  await page.getByRole("button", { name: "להתחלת רישום חניך" }).click();
  await page.getByLabel("סניף פעיל").click();
  await page.getByRole("option").first().click();
  const selector = page.getByRole("combobox", { name: /^סוג הרשמה/ });
  if (process.env.PHASE1_UI_VOLUNTEER_PREPARATION !== "true") {
    await expect(selector).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "יצירת בקשה ללא חשבון" }),
    ).toBeEnabled();
    return;
  }
  await expect(selector).toHaveText("הרשמה לחניך");
  const rect = await selector.boundingBox();
  expect(rect!.x).toBeLessThan(100);
  const heading = await page.getByRole("heading", { level: 1 }).boundingBox();
  expect(heading!.y).toBeGreaterThan(rect!.y + rect!.height);
  await selector.click();
  await page.getByRole("option", { name: "הרשמה למתנדב" }).click();
  await expect(page.getByRole("listbox")).toBeHidden();
  await expect(page.locator(".MuiPopover-root")).toHaveCount(0);
  await expect(page.getByLabel("תעודת זהות מתנדב")).toHaveValue("123456782");
  await expect(page.getByLabel("סניף פעיל")).toContainText("סניף בדיקה מקומי");
  await expect(
    page.getByRole("button", { name: "יצירת בקשה ללא חשבון" }),
  ).toBeEnabled();
  await page.screenshot({
    path: ".registration-qa/phase1-selector.png",
    fullPage: true,
  });
  expect(calls.filter((c) => c.url.endsWith("/start"))).toHaveLength(0);
  await selector.click();
  await page.getByRole("option", { name: "הרשמה לחניך" }).click();
  await expect(page.getByLabel("תעודת זהות חניך")).toHaveValue("123456782");
  await page.getByRole("button", { name: "יצירת בקשה ללא חשבון" }).click();
  expect(calls.find((c) => c.url.endsWith("/start"))?.body).toEqual({
    identifier: "123456782",
    branchId: branch,
    registrationType: "TRAINEE",
  });
});
