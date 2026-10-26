import { test, expect, type Page, type Route } from "@playwright/test";

async function local(
  page: Page,
  api: (route: Route, path: string) => Promise<boolean>,
) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname !== "127.0.0.1") return route.abort();
    if (await api(route, url.pathname)) return;
    if (
      url.pathname.startsWith("/user/") ||
      url.pathname.startsWith("/mentor-assignment")
    )
      return route.fulfill({ json: [] });
    return route.continue();
  });
  return errors;
}
async function offer(page: Page) {
  await page.evaluate(() =>
    (window as unknown as { uxOfferUpdate: () => void }).uxOfferUpdate(),
  );
}
test("attendance preserves selections, acknowledges partial success, retries failed rows and locks saved rows", async ({
  page,
}) => {
  const calls: string[] = [];
  const saved = new Set(["saved"]);
  let fail = true;
  const errors = await local(page, async (route, path) => {
    if (path.startsWith("/event/get-attendees")) {
      await route.fulfill({
        json: ["one", "two", "saved"].map((id) => ({
          id,
          userId: id,
          user: { name: id },
          checkedIn: saved.has(id),
        })),
      });
      return true;
    }
    if (path.endsWith("/checkin")) {
      const id = path.split("/")[2];
      calls.push(id);
      if (id === "two" && fail) {
        fail = false;
        await route.fulfill({
          status: 503,
          json: { message: "SECRET server failure" },
        });
      } else {
        saved.add(id);
        await route.fulfill({ json: [1] });
      }
      return true;
    }
    return false;
  });
  await page.goto("/ux-demo.html");
  await expect(page.getByRole("checkbox", { name: /saved/ })).toBeDisabled();
  const one = page.getByRole("checkbox", { name: /^one/ });
  await one.focus();
  await page.keyboard.press("Space");
  await page.getByRole("checkbox", { name: /^two/ }).tap();
  await page.getByRole("button", { name: /שמירת נוכחות/ }).click();
  await expect(page.getByText(/סימונים ללא אישור שמירה: 1/)).toBeVisible();
  await expect(one).toBeChecked();
  await expect(one).toBeDisabled();
  await expect(page.getByRole("checkbox", { name: /^two/ })).toBeChecked();
  await page.getByRole("button", { name: /שמירת נוכחות/ }).click();
  await expect(page.getByText("הנוכחות נשמרה בהצלחה.")).toBeVisible();
  expect(calls).toEqual(["one", "two", "two"]);
  await page.screenshot({ path: ".registration-qa/ux-attendance.png", fullPage: true });
  await expect(page.getByText("SECRET server failure")).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("a lost check-in response is reconciled by a fresh read without a second write", async ({
  page,
}) => {
  let checkedIn = false,
    writes = 0;
  await local(page, async (route, path) => {
    if (path.startsWith("/event/get-attendees")) {
      await route.fulfill({ json: [{ id: "one", userId: "one", checkedIn }] });
      return true;
    }
    if (path.endsWith("/checkin")) {
      writes++;
      checkedIn = true;
      await route.abort("failed");
      return true;
    }
    return false;
  });
  await page.goto("/ux-demo.html");
  await page.getByRole("checkbox", { name: /^one/ }).check();
  await page.getByRole("button", { name: /שמירת נוכחות/ }).click();
  await expect(page.getByText("הנוכחות נשמרה ואושרה.")).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /^one/ })).toBeDisabled();
  await expect(
    page.getByRole("button", { name: /שמירת נוכחות/ }),
  ).toBeDisabled();
  expect(writes).toBe(1);
});

test("volunteer attendance is explicitly read only, matching server authorization", async ({
  page,
}) => {
  await local(page, async (route, path) => {
    if (!path.startsWith("/event/")) return false;
    await route.fulfill({
      json: [{ id: "one", userId: "one", checkedIn: false }],
    });
    return true;
  });
  await page.goto("/ux-demo.html?role=volunteer");
  await expect(
    page.getByText(/סימון נוכחות זמין למנהלי הסניף בלבד/),
  ).toBeVisible();
  await expect(page.getByRole("checkbox")).toBeDisabled();
  await expect(page.getByRole("button", { name: /שמירת נוכחות/ })).toHaveCount(
    0,
  );
});
for (const screen of ["desktop", "mobile"]) {
  test(`${screen} events distinguish loading, errors, empty and loaded results and preserve branch scope`, async ({
    page,
  }) => {
    await page.setViewportSize({
      width: screen === "desktop" ? 1440 : 320,
      height: 900,
    });
    let mode: "failure" | "empty" | "loaded" = "failure";
    let release: () => void = () => {};
    const waiting = new Promise<void>((resolve) => {
      release = resolve;
    });
    const errors = await local(page, async (route, path) => {
      if (path !== "/event/get-all-events") return false;
      expect(new URL(route.request().url()).searchParams.get("branchId")).toBe(
        "ux-branch",
      );
      await waiting;
      if (mode === "failure")
        await route.fulfill({
          status: 503,
          json: { message: "English server error" },
        });
      else
        await route.fulfill({
          json:
            mode === "empty"
              ? []
              : [
                  {
                    id: "ux-event",
                    name: "אירוע בדיקה",
                    audience: "ALL",
                    branchId: "ux-branch",
                    startDate: "2099-01-01T10:00:00Z",
                    endDate: "2099-01-01T12:00:00Z",
                    attendees: [],
                  },
                ],
        });
      return true;
    });
    await page.goto(`/ux-demo.html?screen=${screen}`);
    await expect(page.getByLabel("טוען אירועים")).toBeVisible();
    await expect(page.getByText(/אין.*אירועים/)).toHaveCount(0);
    release();
    await expect(
      page.getByText("לא ניתן לטעון את האירועים. נסו שוב."),
    ).toBeVisible();
    mode = "empty";
    const retry = page.getByRole("button", { name: "ניסיון נוסף" });
    await retry.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByText(
        screen === "desktop" ? "אין כרגע אירועים קרובים." : "אין אירועים להצגה",
      ),
    ).toBeVisible();
    mode = "loaded";
    await page.reload();
    await expect(page.getByText("אירוע בדיקה", { exact: true })).toBeVisible();
    await page.screenshot({
      path: `.registration-qa/ux-${screen}-events.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
}
test("PWA waits for pending/failed autosave and becomes available after successful retry", async ({
  page,
}) => {
  let fail = true;
  const errors = await local(page, async (route, path) => {
    if (path !== "/ux-draft") return false;
    await route.fulfill({ status: fail ? 503 : 200, json: {} });
    return true;
  });
  await page.goto("/ux-demo.html?screen=draft");
  await page.getByLabel("פרט לדוגמה").fill("טיוטה לשמירה");
  await offer(page);
  await expect(
    page.getByRole("button", { name: "עדכון עכשיו" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("status").filter({ hasText: "error" }),
  ).toBeVisible();
  await expect(page.getByLabel("פרט לדוגמה")).toHaveValue("טיוטה לשמירה");
  fail = false;
  await page.getByRole("button", { name: "שמירה מחדש" }).click();
  await expect(page.getByRole("button", { name: "עדכון עכשיו" })).toBeEnabled();
  expect(errors).toEqual([]);
  const reload = page.waitForEvent("framenavigated", {
    predicate: (frame) => frame === page.mainFrame(),
  });
  await page.getByRole("button", { name: "עדכון עכשיו" }).click();
  await reload;
});

test("an absent branch shows guidance rather than an endless event spinner or empty list", async ({
  page,
}) => {
  await local(page, async (_route, path) => {
    expect(path).not.toBe("/event/get-all-events");
    return false;
  });
  for (const screen of ["desktop", "mobile"]) {
    await page.goto(`/ux-demo.html?screen=${screen}&noBranch`);
    await expect(page.getByText("יש לבחור סניף להצגת האירועים.")).toBeVisible();
    await expect(page.getByLabel("טוען אירועים")).toHaveCount(0);
    await expect(page.getByText(/אין.*אירועים/)).toHaveCount(0);
  }
});
test("PWA protects partial and completed signatures; clearing releases the update", async ({
  page,
}) => {
  await local(page, async () => false);
  await page.goto("/ux-demo.html?screen=draft");
  const canvas = page.getByRole("img", { name: "משטח חתימה בדיקה" });
  const box = await canvas.boundingBox();
  if (!box) throw Error("Missing signature");
  await page.mouse.move(box.x + 20, box.y + 40);
  await page.mouse.down();
  await page.mouse.move(box.x + 100, box.y + 70, { steps: 6 });
  await offer(page);
  await expect(
    page.getByRole("button", { name: "עדכון עכשיו" }),
  ).toBeDisabled();
  await page.mouse.up();
  await page.getByRole("button", { name: "סיום חתימה", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "עדכון עכשיו" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "ניקוי וחתימה מחדש" }).click();
  await expect(page.getByRole("button", { name: "עדכון עכשיו" })).toBeEnabled();
});
test("external worker activation defers automatic reload until draft persistence", async ({
  page,
}) => {
  let release: () => void = () => {};
  const waiting = new Promise<void>((resolve) => {
    release = resolve;
  });
  await local(page, async (route, path) => {
    if (path !== "/ux-draft") return false;
    await waiting;
    await route.fulfill({ json: {} });
    return true;
  });
  await page.goto("/ux-demo.html?screen=draft");
  await page.getByLabel("פרט לדוגמה").fill("לא לאבד");
  await page.evaluate(() =>
    (
      window as unknown as { uxExternalActivation: () => void }
    ).uxExternalActivation(),
  );
  await expect(page.getByLabel("פרט לדוגמה")).toHaveValue("לא לאבד");
  await expect(
    page.getByRole("button", { name: "עדכון עכשיו" }),
  ).toBeDisabled();
  const navigation = page.waitForEvent("framenavigated", {
    predicate: (frame) => frame === page.mainFrame(),
  });
  release();
  await navigation;
  await expect(page.getByLabel("פרט לדוגמה")).toHaveValue("");
});
test("profile editing and failed profile save defer updates until editing is closed", async ({
  page,
}) => {
  await local(page, async (route, path) => {
    if (path !== "/user/me") return false;
    await route.fulfill(
      route.request().method() === "GET"
        ? {
            json: {
              id: "ux-user",
              name: "בדיקה",
              phoneNumber: "0500000000",
              email: "test@example.invalid",
            },
          }
        : { status: 503, json: { message: "English failure" } },
    );
    return true;
  });
  await page.goto("/ux-demo.html?screen=profile");
  await page
    .getByRole("button", { name: "עריכת פרטים אישיים", exact: true })
    .click();
  await page.getByLabel("כתובת", { exact: true }).fill("כתובת בדיקה");
  await offer(page);
  // The modal hides the background prompt from the accessibility tree.
  await expect(
    page.locator("button").filter({ hasText: "עדכון עכשיו" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "שמירה", exact: true }).click();
  await expect(page.getByLabel("כתובת", { exact: true })).toHaveValue(
    "כתובת בדיקה",
  );
  await expect(page.getByText("לא הצלחנו לעדכן את הפרטים")).toBeVisible();
  await page.getByRole("button", { name: "ביטול", exact: true }).click();
  await expect(page.getByRole("button", { name: "עדכון עכשיו" })).toBeEnabled();
});
