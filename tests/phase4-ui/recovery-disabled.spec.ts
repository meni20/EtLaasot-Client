import { test, expect } from "@playwright/test";
test("disabled password flow preserves legacy entry and blocks the reset UI", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/*", async (route) => {
    const u = new URL(route.request().url());
    if (u.hostname !== "127.0.0.1") return route.abort();
    if (u.pathname.startsWith("/password-recovery")) {
      requests++;
      return route.fulfill({ status: 404 });
    }
    if (u.pathname === "/auth/identify")
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ next: "PASSWORD" }),
      });
    return route.continue();
  });
  await page.goto("/password-demo.html");
  await page.getByLabel(/^תעודת זהות/).fill("123456782");
  await page.getByRole("button", { name: "המשך", exact: true }).click();
  await expect(page.getByLabel(/^סיסמה/)).toBeVisible();
  await expect(page.getByRole("button", { name: "שכחתי סיסמה" })).toHaveCount(
    0,
  );
  await page.goto("/password-demo.html?screen=reset#token=" + "x".repeat(43));
  await expect(page.getByText("שחזור סיסמה עדיין אינו זמין.")).toBeVisible();
  expect(requests).toBe(0);
});
