import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
const legal = JSON.parse(
  readFileSync("tests/fixtures/volunteer-legal.json", "utf8"),
);

async function mock(
  page: Page,
  options: {
    known?: "account" | "applicant" | "legacy";
    type?: "TRAINEE" | "VOLUNTEER";
    status?: string;
    step?: number;
    failLogin?: boolean;
    expired?: boolean;
  } = {},
) {
  let authorized = !!options.status,
    revision = 0,
    branchId: string | null = null;
  let data: Record<string, unknown> =
    options.type === "VOLUNTEER"
      ? {
          volunteer: { nationalId: "123456782" },
          agreements: { version: "volunteer-v1" },
        }
      : { trainee: { nationalId: "123456782" } };
  let step = options.step ?? 1;
  const calls: {
    path: string;
    body: Record<string, unknown>;
    authorization: string | undefined;
  }[] = [];
  const snapshot = () => ({
    application: {
      id: "00000000-0000-4000-8000-000000000002",
      registrationType: options.type ?? "TRAINEE",
      branchId,
      status: options.status ?? "DRAFT",
      revision,
      currentStep: step,
      documentStatus: "PENDING",
      feedbackReason: "נא להשלים את הפרטים",
    },
    data,
    legal,
    contentHash: "a".repeat(64),
    declarations: Array(10).fill("הצהרה לדוגמה"),
    declarationVersion: "volunteer-v1",
    integration: "UNAVAILABLE",
  });
  await page.route("**/*", async (route) => {
    const req = route.request(),
      url = new URL(req.url());
    if (url.hostname !== "127.0.0.1") {
      await route.abort();
      return;
    }
    if (
      !url.pathname.startsWith("/auth/") &&
      !url.pathname.startsWith("/parent-applications/")
    ) {
      await route.continue();
      return;
    }
    const body = (req.postDataJSON() ?? {}) as Record<string, unknown>;
    calls.push({
      path: url.pathname,
      body,
      authorization: req.headers().authorization,
    });
    const reply = (status: number, value: unknown) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(value),
      });
    if (url.pathname === "/auth/identify")
      return reply(201, {
        next:
          options.known === "account"
            ? "PASSWORD"
            : options.known === "applicant"
              ? "APPLICANT_PASSWORD"
              : options.known === "legacy"
                ? "LEGACY_RECOVERY"
                : "REGISTER",
      });
    if (
      url.pathname.endsWith("/password/signup") ||
      url.pathname.endsWith("/password/login")
    ) {
      if (options.failLogin) return reply(401, {});
      authorized = true;
      return reply(201, {
        sessionToken: "s".repeat(43),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      });
    }
    if (url.pathname.endsWith("/branches"))
      return reply(200, [
        { id: "a", name: "סניף א", city: "בדיקה" },
        { id: "b", name: "סניף ב", city: "בדיקה" },
      ]);
    if (url.pathname.endsWith("/me"))
      return reply(
        authorized && !options.expired ? 200 : 401,
        authorized ? snapshot() : {},
      );
    if (url.pathname.endsWith("/me/draft")) {
      if (options.expired) return reply(401, {});
      if (body.revision !== revision) return reply(409, {});
      data = body.data as Record<string, unknown>;
      step = Number(body.currentStep);
      if ("branchId" in body) branchId = body.branchId as string | null;
      revision++;
      return reply(200, snapshot());
    }
    if (url.pathname.endsWith("/session/revoke")) {
      authorized = false;
      return reply(201, { ok: true });
    }
    return reply(404, {});
  });
  return {
    calls,
    expire: () => {
      options.expired = true;
    },
  };
}

async function enterId(page: Page) {
  await page.getByLabel(/^תעודת\ זהות\s*\*?$/).fill("123456782");
  await page.getByRole("button", { name: "המשך", exact: true }).click();
}
async function signup(page: Page, type = "TRAINEE") {
  await enterId(page);
  if (type === "VOLUNTEER") {
    await page.getByLabel("סוג הרשמה").click();
    await page.getByRole("option", { name: "מתנדב", exact: true }).click();
  }
  await page.getByLabel(/^כתובת\ אימייל\s*\*?$/).fill("Family@Example.com");
  await page.getByLabel(/^סיסמה\s*\*?$/).fill("Chosen!2345");
  await page.getByLabel(/^אימות\ סיסמה\s*\*?$/).fill("Chosen!2345");
  await page.getByRole("button", { name: "המשך", exact: true }).click();
}
async function personal(page: Page) {
  await page.getByRole("button", { name: "קראתי, המשך למילוי הטופס" }).click();
}
test.beforeEach(async ({ page }) => {
  page.on("pageerror", (e) => {
    throw e;
  });
});

test("new trainee: credentials, no recovery code, branch autosave and reload", async ({
  page,
}) => {
  const state = await mock(page);
  await page.goto("/password-demo.html");
  await signup(page);
  await expect(
    page.getByRole("heading", { name: "הרשמת חניך", exact: true }),
  ).toBeVisible();
  await personal(page);
  await expect(page.getByLabel(/^סניף\s*\*?$/)).toBeVisible();
  await page.getByLabel(/^סניף\s*\*?$/).click();
  await page.getByRole("option", { name: "סניף א", exact: true }).click();
  await expect
    .poll(
      () =>
        state.calls.filter((c) => c.path.endsWith("/me/draft")).at(-1)?.body
          .branchId,
    )
    .toBe("a");
  expect(
    state.calls.find((c) => c.path.endsWith("/password/signup"))?.body,
  ).toMatchObject({ email: "family@example.com", registrationType: "TRAINEE" });
  expect(state.calls.every((c) => !c.authorization)).toBe(true);
  await expect(page.getByText("שמרתי את קוד השחזור במקום בטוח")).toHaveCount(0);
  await page.goto("/password-demo.html?screen=apply");
  await personal(page);
  await expect(page.getByLabel(/^סניף\s*\*?$/)).toContainText("סניף א");
  expect(await page.evaluate(() => Object.values(localStorage))).not.toContain(
    "s".repeat(43),
  );
  await page.screenshot({
    path: ".registration-qa/password/trainee-personal-mobile.png",
    fullPage: true,
  });
});
test("new volunteer enters personal stage directly with branch selection", async ({
  page,
}) => {
  const state = await mock(page, { type: "VOLUNTEER" });
  await page.goto("/password-demo.html");
  await signup(page, "VOLUNTEER");
  await expect(page.getByLabel(/^שם\ פרטי\s*\*?$/)).toBeVisible();
  await expect(page.getByLabel(/^סניף\s*\*?$/)).toBeVisible();
  expect(
    state.calls.find((c) => c.path.endsWith("/password/signup"))?.body
      .registrationType,
  ).toBe("VOLUNTEER");
  await page.screenshot({
    path: ".registration-qa/password/volunteer-personal-mobile.png",
    fullPage: true,
  });
});
test("signup validates confirmation without sending credentials and toggles visibility", async ({
  page,
}) => {
  const state = await mock(page);
  await page.goto("/password-demo.html");
  await enterId(page);
  await page.getByLabel(/^כתובת\ אימייל\s*\*?$/).fill("family@example.com");
  await page.getByLabel(/^סיסמה\s*\*?$/).fill("Chosen!2345");
  await page.getByLabel(/^אימות\ סיסמה\s*\*?$/).fill("different");
  await page.getByRole("button", { name: "הצגת סיסמה", exact: true }).click();
  await expect(page.getByLabel(/^סיסמה\s*\*?$/)).toHaveAttribute(
    "type",
    "text",
  );
  await page.getByRole("button", { name: "המשך", exact: true }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "אימות הסיסמה אינו תואם" }),
  ).toBeVisible();
  expect(state.calls.some((c) => c.path.endsWith("/password/signup"))).toBe(
    false,
  );
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({
    path: ".registration-qa/password/signup-desktop.png",
    fullPage: true,
  });
});
for (const status of [
  "DRAFT",
  "CHANGES_REQUESTED",
  "PENDING_REVIEW",
  "REJECTED",
  "APPROVED",
])
  test(`returning applicant status ${status}`, async ({ page }) => {
    const state = await mock(page, { known: "applicant", status });
    await page.goto("/password-demo.html");
    await enterId(page);
    await page.getByLabel(/^סיסמה\s*\*?$/).fill("Chosen!2345");
    await page.getByRole("button", { name: "המשך", exact: true }).click();
    if (status === "DRAFT")
      await expect(
        page.getByRole("heading", { name: "הרשמת חניך", exact: true }),
      ).toBeVisible();
    if (status === "CHANGES_REQUESTED")
      await expect(
        page.getByText("הבקשה הוחזרה לתיקון:", { exact: false }),
      ).toBeVisible();
    if (status === "PENDING_REVIEW") {
      await expect(page.getByRole("status")).toContainText("ממתינה לאישור");
      await expect(page.getByLabel(/^סניף\s*\*?$/)).toHaveCount(0);
    }
    if (status === "REJECTED")
      await expect(page.getByRole("status")).toContainText("נדחתה");
    if (status === "APPROVED")
      await expect(
        page.getByRole("link", { name: "לכניסה למערכת" }),
      ).toBeVisible();
    expect(state.calls.some((c) => c.path.endsWith("/password/login"))).toBe(
      true,
    );
  });
test("incorrect applicant password stays outside the workspace", async ({
  page,
}) => {
  await mock(page, { known: "applicant", failLogin: true });
  await page.goto("/password-demo.html");
  await enterId(page);
  await page.getByLabel(/^סיסמה\s*\*?$/).fill("Wrong!2345");
  await page.getByRole("button", { name: "המשך", exact: true }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "לא ניתן להמשיך" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "הרשמת חניך", exact: true }),
  ).toHaveCount(0);
});
test("expired applicant session shows sign-in without personal data", async ({
  page,
}) => {
  await mock(page, { status: "DRAFT", expired: true });
  await page.goto("/password-demo.html?screen=apply");
  await expect(
    page.getByRole("heading", { name: "כניסה והרשמה" }),
  ).toBeVisible();
  await expect(page.getByLabel(/^שם\ פרטי\s*\*?$/)).toHaveCount(0);
});
test("existing account preserves regular password-change navigation", async ({
  page,
}) => {
  const state = await mock(page, { known: "account" });
  await page.goto("/password-demo.html");
  await enterId(page);
  await page.getByLabel(/^סיסמה\s*\*?$/).fill("Existing!2345");
  await page.getByRole("button", { name: "המשך", exact: true }).click();
  await expect(page.getByRole("heading", { name: /סיסמה/ })).toBeVisible();
  expect(state.calls.some((c) => c.path.includes("/password/login"))).toBe(
    false,
  );
});
test("legacy recovery is available explicitly and cannot start a new code-based registration", async ({
  page,
}) => {
  await mock(page, { known: "legacy" });
  await page.goto("/password-demo.html");
  await enterId(page);
  await page
    .getByRole("link", { name: "המשך עם קוד הרשמה קודם", exact: true })
    .click();
  await expect(page.getByLabel("קוד שחזור פרטי")).toBeVisible();
  await expect(page.getByText("בקשה חדשה", { exact: true })).toHaveCount(0);
});
test("320px RTL entry has no overflow and no branch at entry", async ({
  page,
}) => {
  await mock(page);
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto("/password-demo.html");
  await enterId(page);
  await expect(page.getByLabel(/^סניף\s*\*?$/)).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: ".registration-qa/password/signup-mobile.png",
    fullPage: true,
  });
});

test("returning draft resumes its last saved step", async ({ page }) => {
  await mock(page, { known: "applicant", status: "DRAFT", step: 3 });
  await page.goto("/password-demo.html");
  await enterId(page);
  await page.getByLabel(/^סיסמה\s*\*?$/).fill("Chosen!2345");
  await page.getByRole("button", { name: "המשך", exact: true }).click();
  await personal(page);
  await expect(page.getByText("שלב 3 מתוך 5", { exact: true })).toBeVisible();
});

test("branch is required before trainee submission", async ({ page }) => {
  const state = await mock(page, { status: "DRAFT" });
  await page.goto("/password-demo.html?screen=apply");
  await personal(page);
  await page
    .getByRole("button", { name: "5. מסמכים וחתימות", exact: true })
    .click();
  await page.getByRole("button", { name: "שליחת הטופס", exact: true }).click();
  await expect(
    page.getByText("יש לבחור סניף לפני השליחה.", { exact: true }),
  ).toBeVisible();
  expect(state.calls.some((c) => c.path.endsWith("/me/submit"))).toBe(false);
});

test("expiry during autosave clears the applicant workspace", async ({
  page,
}) => {
  const state = await mock(page);
  await page.goto("/password-demo.html");
  await signup(page);
  await personal(page);
  state.expire();
  await page.getByLabel(/^שם\sפרטי\s*\*?$/).fill("שם בדיקה");
  await expect(
    page.getByRole("heading", { name: "כניסה והרשמה", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel(/^שם\sפרטי\s*\*?$/)).toHaveCount(0);
  await expect(
    page.getByRole("alert").filter({ hasText: "הגישה פגה" }),
  ).toBeVisible();
});

test("login ID edit icon stays left and unlocks the ID on mobile RTL", async ({ page }) => {
  await mock(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/password-demo.html");
  await expect(page.getByText("יש לי בקשה ישנה עם קוד שחזור", { exact: true })).toHaveCount(0);
  await enterId(page);
  const field = page.getByLabel(/^תעודת זהות/);
  await expect(field).toHaveAttribute("readonly", "");
  const edit = page.getByRole("button", { name: "שינוי תעודת זהות", exact: true });
  await expect(edit.locator("svg")).toBeVisible();
  const iconBox = await edit.boundingBox();
  const fieldBox = await field.boundingBox();
  expect(iconBox!.x).toBeLessThan(fieldBox!.x + fieldBox!.width / 2);
  await edit.click();
  await expect(field).not.toHaveAttribute("readonly", "");
  await field.fill("000000018");
  await expect(field).toHaveValue("000000018");
});
