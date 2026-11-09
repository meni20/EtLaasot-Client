import { test, expect, type Page } from "@playwright/test";
const token = "x".repeat(43);
async function api(
  page: Page,
  options: {
    kind?: "PASSWORD" | "APPLICANT_PASSWORD";
    invalid?: boolean;
    rate?: boolean;
  } = {},
) {
  const calls: {
    path: string;
    body: Record<string, unknown>;
    authorization?: string;
  }[] = [];
  await page.route("**/*", async (route) => {
    const r = route.request(),
      u = new URL(r.url());
    if (u.hostname !== "127.0.0.1") return route.abort();
    if (
      !u.pathname.startsWith("/password-recovery") &&
      !u.pathname.startsWith("/auth/identify")
    )
      return route.continue();
    const body = r.postData() ? r.postDataJSON() : {};
    calls.push({
      path: u.pathname,
      body,
      authorization: r.headers().authorization,
    });
    const reply = (data: object, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(data),
      });
    if (u.pathname === "/auth/identify")
      return reply({ next: options.kind ?? "APPLICANT_PASSWORD" });
    if (options.rate) return reply({}, 429);
    if (options.invalid) return reply({ code: "RESET_LINK_INVALID" }, 400);
    return reply({ ok: true });
  });
  return calls;
}
for (const kind of ["PASSWORD", "APPLICANT_PASSWORD"] as const)
  test(`forgot password for ${kind} uses ID and generic first-ownership instructions`, async ({
    page,
  }) => {
    const calls = await api(page, { kind });
    await page.goto("/password-demo.html");
    await page.getByLabel(/^תעודת זהות/).fill("123456782");
    await page.getByRole("button", { name: "המשך", exact: true }).click();
    await page
      .getByRole("button", { name: "שכחתי סיסמה", exact: true })
      .click();
    await page.getByRole("button", { name: "שליחת קישור לאיפוס" }).click();
    await expect(
      page.getByText(/לפני האיפוס הראשון יש לפנות למנהל הסניף/),
    ).toBeVisible();
    expect(calls.at(-1)?.body).toEqual({ identifier: "123456782" });
    expect(calls.at(-1)?.authorization).toBeUndefined();
  });
test("reset link stays out of URL/storage and allows confirmed new password on mobile RTL", async ({
  page,
}) => {
  const calls = await api(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/password-demo.html?screen=reset#token=${token}`);
  await expect(
    page.getByRole("heading", { name: "איפוס סיסמה" }),
  ).toBeVisible();
  await expect(page).not.toHaveURL(/token=/);
  await page.getByLabel(/^סיסמה חדשה/).fill("Reset!Password23");
  await page.getByLabel(/^אימות סיסמה/).fill("Reset!Password23");
  await page.getByRole("button", { name: "הצגת סיסמה", exact: true }).click();
  await expect(page.getByLabel(/^סיסמה חדשה/)).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "שמירת סיסמה חדשה" }).click();
  await expect(page.getByText(/הסיסמה נשמרה/)).toBeVisible();
  expect(calls.at(-1)?.body).toEqual({
    token,
    password: "Reset!Password23",
    confirmation: "Reset!Password23",
  });
  expect(calls.at(-1)?.authorization).toBeUndefined();
  expect(
    await page.evaluate(() => JSON.stringify([localStorage, sessionStorage])),
  ).not.toContain(token);
  await page.screenshot({
    path: ".registration-qa/password/reset-success-mobile.png",
    fullPage: true,
  });
});
test("reset confirmation mismatch does not send a request", async ({
  page,
}) => {
  const calls = await api(page);
  await page.goto(`/password-demo.html?screen=reset#token=${token}`);
  await page.getByLabel(/^סיסמה חדשה/).fill("Reset!Password23");
  await page.getByLabel(/^אימות סיסמה/).fill("Different!Password23");
  await page.getByRole("button", { name: "שמירת סיסמה חדשה" }).click();
  await expect(page.getByText("אימות הסיסמה אינו תואם")).toBeVisible();
  expect(calls).toHaveLength(0);
});
test("expired/reused links display a safe error and clear password inputs", async ({
  page,
}) => {
  await api(page, { invalid: true });
  await page.goto(`/password-demo.html?screen=reset#token=${token}`);
  await page.getByLabel(/^סיסמה חדשה/).fill("Reset!Password23");
  await page.getByLabel(/^אימות סיסמה/).fill("Reset!Password23");
  await page.getByRole("button", { name: "שמירת סיסמה חדשה" }).click();
  await expect(
    page.getByText(/הקישור אינו תקף, פג תוקפו או שכבר נוצל/),
  ).toBeVisible();
  await expect(page.getByLabel(/^סיסמה חדשה/)).toHaveValue("");
});

test("manager records independent ownership without receiving a password or token", async ({
  page,
}) => {
  const calls = await api(page);
  await page.goto("/password-demo.html?screen=recovery-admin");
  await page.getByRole("button", { name: "אימות בעלות לשחזור סיסמה" }).click();
  const approve = page.getByRole("button", {
    name: "אישור בעלות",
    exact: true,
  });
  await expect(approve).toBeDisabled();
  await page
    .getByLabel("אימייל רשום שאומת מול הפונה")
    .fill("family@example.test");
  await page.getByRole("checkbox", { name: /אימתתי באופן עצמאי/ }).check();
  await approve.click();
  await expect(page.getByText(/האימות נשמר ל־30 דקות/)).toBeVisible();
  expect(calls.at(-1)?.body).toEqual({
    subjectId: "00000000-0000-4000-8000-000000000001",
    subjectType: "USER",
    email: "family@example.test",
    identityVerified: true,
    emailConfirmed: true,
  });
  expect(JSON.stringify(calls.at(-1)?.body)).not.toMatch(/passwordHash|token/);
});

test("manager ownership form can locate a branchless draft by ID without changing its branch", async ({
  page,
}) => {
  const calls = await api(page);
  await page.goto("/password-demo.html?screen=recovery-admin-global");
  await page.getByRole("button", { name: "אימות בעלות לשחזור סיסמה" }).click();
  await page.getByLabel("תעודת זהות הפונה").fill("123456782");
  await page
    .getByLabel("אימייל רשום שאומת מול הפונה")
    .fill("family@example.test");
  await page.getByRole("checkbox", { name: /אימתתי באופן עצמאי/ }).check();
  await page.getByRole("button", { name: "אישור בעלות", exact: true }).click();
  await expect(page.getByText(/האימות נשמר ל־30 דקות/)).toBeVisible();
  expect(calls.at(-1)?.body.subjectType).toBe("IDENTITY");
  expect(calls.at(-1)?.body.subjectId).toBe("123456782");
  expect(calls.at(-1)?.body).not.toHaveProperty("branchId");
});
