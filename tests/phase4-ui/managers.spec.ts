import { test, expect } from "@playwright/test";

test("super admin lists branch managers and confirms role removal", async ({ page }) => {
  let managers = [
    {
      id: "00000000-0000-4000-8000-000000000021",
      name: "מנהלת בדיקה",
      branchId: "branch-a",
      branchName: "סניף א",
    },
    {
      id: "00000000-0000-4000-8000-000000000022",
      name: "מנהל בדיקה",
      branchId: "branch-b",
      branchName: "סניף ב",
    },
  ];
  let removals = 0;
  await page.route("**/user/branch-managers", async (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(managers) }),
  );
  await page.route("**/user/*/remove-branch-admin", async (route) => {
    removals++;
    managers = managers.slice(1);
    await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
  });
  await page.goto("/phase4-demo.html?screen=managers");
  await expect(page.getByRole("heading", { name: "מנהלי סניפים" })).toBeVisible();
  await expect(page.getByText("מנהלת בדיקה")).toBeVisible();
  await expect(page.getByText("סניף ב")).toBeVisible();
  await page.getByRole("button", { name: "הסרת הרשאת מנהל" }).first().click();
  await expect(page.getByRole("dialog")).toContainText("החשבון והמידע יישמרו");
  await page.getByRole("button", { name: "אישור הסרה" }).click();
  await expect(page.getByText("מנהלת בדיקה")).toHaveCount(0);
  expect(removals).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
