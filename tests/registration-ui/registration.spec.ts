import { test, expect, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { demoDeclarations } from "../../src/features/parent-registration/demo/legal.fixture";

async function select(page: Page, name: string, value: string) {
  await page.getByRole("combobox", { name: new RegExp("^" + name) }).click();
  await page.getByRole("option", { name: value, exact: true }).click();
}
async function scenario(page: Page, value: string) {
  await select(page, "תרחיש מקומי", value);
}
async function begin(page: Page) {
  await page.getByRole("button", { name: /קראתי, המשך|המשך לצפייה/ }).click();
}
async function stage(page: Page, value: number) {
  await page
    .getByRole("navigation", { name: "שלבי הרישום" })
    .getByRole("button")
    .nth(value - 1)
    .click();
}
async function sign(page: Page, parent: number, finish = true, touch = false) {
  const canvas = page.getByRole("img", {
    name: `משטח חתימה הורה ${parent}`,
    exact: true,
  });
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Canvas missing");
  if (touch) {
    const session = await page.context().newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: box.x + 30, y: box.y + 70 }],
    });
    for (let index = 1; index <= 16; index++)
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [
          { x: box.x + 30 + index * 9, y: box.y + 70 + Math.sin(index) * 20 },
        ],
      });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await session.detach();
  } else {
    await page.mouse.move(box.x + 30, box.y + 70);
    await page.mouse.down();
    await page.mouse.move(box.x + 75, box.y + 35, { steps: 8 });
    await page.mouse.move(box.x + 130, box.y + 95, { steps: 8 });
    await page.mouse.move(box.x + 180, box.y + 50, { steps: 8 });
    await page.mouse.up();
  }
  if (finish)
    await canvas
      .locator("..")
      .getByRole("button", { name: "סיום חתימה", exact: true })
      .click();
}
async function physician(page: Page) {
  await page.getByLabel("בחירת סיכום רפואי", { exact: true }).setInputFiles({
    name: "fictional-summary.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4\nFictional UX fixture only\n%%EOF"),
  });
}
test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    return url.hostname === "127.0.0.1" ? route.continue() : route.abort();
  });
  await page.goto("/parent-registration-demo.html");
});

test("RTL at 390px and 320px, full original letter, profile autofill, five freely accessible stages", async ({
  page,
}) => {
  await expect(
    page.getByText('מכתב להורים לרישום לפעילויות עמותת "עת לעשות"', {
      exact: true,
    }),
  ).toBeVisible();
  await begin(page);
  await expect(page.locator('input[name="trainee.name"]')).toHaveValue("");
  await expect(page.locator('input[name="trainee.phone"]')).toHaveValue(
    "0500000000",
  );
  for (const step of [5, 3, 2, 4, 1]) {
    await stage(page, step);
    await expect(
      page.getByText(`שלב ${step} מתוך 5`, { exact: true }),
    ).toBeVisible();
  }
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.locator("html").evaluate((e) => getComputedStyle(e).direction),
    ).toBe("rtl");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.getByRole("button", { name: "המכתב להורים", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("077-553-8800");
});
test("debounced autosave and stage navigation preserve latest edits without localStorage", async ({
  page,
}) => {
  await begin(page);
  await page.locator('input[name="trainee.name"]').fill("שם בדוי");
  await expect(page.getByRole("status")).toContainText("כל השינויים נשמרו");
  await stage(page, 2);
  await stage(page, 1);
  await expect(page.locator('input[name="trainee.name"]')).toHaveValue(
    "שם בדוי",
  );
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});
test("409 freezes editing, never overwrites and requires explicit reload confirmation", async ({
  page,
}) => {
  await scenario(page, "התנגשות בשמירה");
  await begin(page);
  await page.locator('input[name="trainee.name"]').fill("שינוי מקומי");
  await expect(page.getByText("התנגשות גרסאות", { exact: true })).toBeVisible();
  await expect(page.locator('input[name="trainee.name"]')).toBeDisabled();
  await page.getByRole("button", { name: "טעינת גרסת השרת" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "השינויים המקומיים שלא נשמרו",
  );
  await page.getByRole("button", { name: "אישור וטעינה" }).click();
  await begin(page);
  await expect(page.locator('input[name="trainee.name"]')).toHaveValue("");
});
test("network save failure offers an explicit retry that retains local edits", async ({
  page,
}) => {
  await scenario(page, "כשל שמירה זמני");
  await begin(page);
  await page.locator('input[name="trainee.name"]').fill("שם לניסיון חוזר");
  await expect(page.getByText("השמירה נכשלה", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "ניסיון נוסף" }).click();
  await expect(page.getByRole("status")).toContainText("כל השינויים נשמרו");
  await expect(page.locator('input[name="trainee.name"]')).toHaveValue(
    "שם לניסיון חוזר",
  );
});
test("conditional medical fields, diagnoses and medication rows edit draft only", async ({
  page,
}) => {
  await begin(page);
  await stage(page, 3);
  await page
    .getByRole("radiogroup", {
      name: "האם יש מגבלה בריאותית, מחלה פעילה או אבחנות?",
    })
    .getByLabel("כן", { exact: true })
    .check();
  const conditions = page.getByRole("textbox", {
    name: /מצבים רפואיים ואבחנות/,
  });
  await conditions.fill("אבחנה בדויה\nמצב בדוי");
  await expect(conditions).toHaveValue("אבחנה בדויה\nמצב בדוי");
  await page
    .getByRole("radiogroup", { name: "האם נוטלים תרופות?" })
    .getByLabel("כן", { exact: true })
    .check();
  await page.getByRole("button", { name: "הוספת תרופה" }).click();
  await page
    .getByRole("textbox", { name: "שם התרופה", exact: false })
    .fill("תרופת הדגמה");
  await page
    .getByRole("radiogroup", { name: "האם קיימת רגישות למזון?" })
    .getByLabel("כן", { exact: true })
    .check();
  await expect(
    page.getByRole("textbox", { name: /פירוט אלרגיות/ }),
  ).toBeVisible();
  await page
    .getByRole("radiogroup", { name: "האם נוטלים תרופות?" })
    .getByLabel("לא", { exact: true })
    .check();
  await expect(
    page.getByRole("textbox", { name: "שם התרופה", exact: false }),
  ).toHaveCount(0);
});
test("all ten exact declarations remain visible and require individual acceptance", async ({
  page,
}) => {
  await begin(page);
  await stage(page, 4);
  for (const text of demoDeclarations)
    await expect(page.getByText(text, { exact: true })).toHaveCount(1);
  const boxes = page.getByRole("checkbox");
  await expect(boxes).toHaveCount(10);
  await boxes.nth(0).check();
  await expect(boxes.nth(1)).not.toBeChecked();
});
test("required validation jumps to stage one and preserves free navigation; upload explicitly unavailable", async ({
  page,
}) => {
  await begin(page);
  await stage(page, 5);
  await expect(
    page.getByText(/העלאה לשרת והפקת PDF עדיין אינן זמינות/),
  ).toBeVisible();
  await page.getByRole("button", { name: "הדמיית שליחה (ללא העלאה)" }).click();
  await expect(page.getByText("שלב 1 מתוך 5", { exact: true })).toBeVisible();
  await expect(page.locator('input[name="trainee.name"]')).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await stage(page, 5);
  await physician(page);
  await expect(
    page.getByText(/נבחר בזיכרון בלבד: fictional-summary.pdf/),
  ).toBeVisible();
});
test("high DPI canvas drops partial strokes and clears both completed signatures on any content edit", async ({
  page,
}) => {
  await scenario(page, "טיוטה מלאה לחתימה");
  await begin(page);
  const canvas = page.getByRole("img", {
    name: "משטח חתימה הורה 1",
    exact: true,
  });
  expect(
    await canvas.evaluate(
      (e) => (e as HTMLCanvasElement).width / e.getBoundingClientRect().width,
    ),
  ).toBeCloseTo(2, 1);
  await sign(page, 1, false);
  await stage(page, 1);
  await stage(page, 5);
  await expect(
    page.getByRole("button", { name: "סיום חתימה", exact: true }).first(),
  ).toBeDisabled();
  await sign(page, 1, true, true);
  await sign(page, 2);
  await expect(page.getByRole("img", { name: /חתימה שהושלמה/ })).toHaveCount(2);
  await stage(page, 1);
  await page.locator('input[name="trainee.address"]').fill("כתובת הדגמה אחרת");
  await stage(page, 5);
  await expect(page.getByRole("img", { name: /חתימה שהושלמה/ })).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});
test("two-parent local UX submission prevents duplicate clicks and shows pending without claiming PDF success", async ({
  page,
}) => {
  await scenario(page, "טיוטה מלאה לחתימה");
  await begin(page);
  await physician(page);
  await sign(page, 1);
  await sign(page, 2);
  await page
    .getByRole("button", { name: "הדמיית שליחה (ללא העלאה)" })
    .dblclick();
  await expect(
    page.getByText("הטופס נשלח וממתין לאישור מנהל/ת", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(/זהו מצב הדגמה בלבד. לא נשלח טופס אמיתי/),
  ).toBeVisible();
  await expect(page.getByText(/ממתין להפקה — השירות טרם חובר/)).toBeVisible();
});
test("single-parent signing works with optional second ID empty; mismatched second signing is rejected", async ({
  page,
}) => {
  await scenario(page, "טיוטה מלאה לחתימה");
  await begin(page);
  await page.locator('input[name="parent2.nationalId"]').fill("");
  await physician(page);
  await sign(page, 1);
  await sign(page, 2);
  await page.getByRole("button", { name: "הדמיית שליחה (ללא העלאה)" }).click();
  await expect(
    page.locator('input[name="parent2.nationalId"]'),
  ).toHaveAttribute("aria-invalid", "true");
  await page
    .getByRole("img", { name: "חתימה שהושלמה — הורה 2", exact: true })
    .locator("..")
    .getByRole("button", { name: "ניקוי וחתימה מחדש" })
    .click();
  await page.getByRole("button", { name: "הדמיית שליחה (ללא העלאה)" }).click();
  await expect(
    page.getByText("הטופס נשלח וממתין לאישור מנהל/ת", { exact: true }),
  ).toBeVisible();
});
test("changes reason, approved/not-required and expired authorization states", async ({
  page,
}) => {
  await scenario(page, "נדרשים תיקונים");
  await expect(page.getByText(/נא לפרט את העזרה הנדרשת בניידות/)).toBeVisible();
  await scenario(page, "מאושר");
  await expect(
    page.getByText("הרישום אושר. פרטים חתומים אינם ניתנים לעריכה."),
  ).toBeVisible();
  await begin(page);
  await expect(page.locator('input[name="trainee.name"]')).toBeDisabled();
  await scenario(page, "לא נדרש רישום");
  await expect(page.getByText("כרגע לא נדרש מילוי טופס רישום.")).toBeVisible();
  await scenario(page, "חיבור פג (401)");
  await expect(page.getByText("החיבור פג. יש להתחבר מחדש.")).toBeVisible();
});
test("branch admin scope, status counts, immutable versions, no approval without PDF, required reasons and renewal", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await scenario(page, "ממתין לאישור");
  await select(page, "תפקיד בהדגמה בלבד", "מנהל/ת סניף");
  await page.getByRole("combobox", { name: "סניף מורשה" }).click();
  await expect(page.getByRole("option")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "פתיחת טופס", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "אישור הטופס", exact: true }),
  ).toBeDisabled();
  const detail = page.getByRole("region", { name: "פרטי טופס חתום" });
  await expect(detail.getByRole("textbox")).toHaveCount(0);
  await expect(
    detail.getByRole("table", { name: "השוואת פרטי רישום" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "בקשת תיקונים", exact: true }).click();
  await page.getByRole("button", { name: "אישור פעולה" }).click();
  await expect(
    page.getByText("חובה להזין סיבה", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "סיבה", exact: false })
    .fill("נא לעדכן פרטים בדויים");
  await page.getByRole("button", { name: "אישור פעולה" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("button", { name: "בקשת חידוש אישי", exact: true })
    .click();
  await select(page, "חניך/ה מהסניף", "נועם דוגמה");
  await page
    .getByRole("textbox", { name: "סיבה", exact: false })
    .fill("חידוש הדגמה");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "אישור פעולה" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("super admin may select authorized branches; annual opening is explicit", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await select(page, "תפקיד בהדגמה בלבד", "מנהל/ת על");
  await select(page, "סניף מורשה", "סניף הדגמה דרום");
  await page.getByRole("button", { name: "פתיחת רישום שנתי" }).click();
  await expect(page.getByRole("dialog")).toContainText("סניף הדגמה דרום");
  await page.getByRole("button", { name: "אישור פעולה" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("visual captures and preview makes no external requests or runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  const external: string[] = [];
  const apiRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (
      /^\/(auth|user|branch|parent-registration|activity-years)(\/|$)/.test(
        new URL(request.url()).pathname,
      )
    )
      apiRequests.push(request.url());
    if (new URL(request.url()).hostname !== "127.0.0.1")
      external.push(request.url());
  });
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: 'מכתב להורים לרישום לפעילויות עמותת "עת לעשות"',
      exact: true,
    }),
  ).toBeVisible();
  await mkdir(".registration-qa", { recursive: true });
  await page.screenshot({
    path: ".registration-qa/mobile-letter.png",
    fullPage: true,
  });
  await begin(page);
  for (let step = 1; step <= 5; step++) {
    await stage(page, step);
    await expect(page.getByRole("status")).toContainText("כל השינויים נשמרו");
    await page.mouse.move(0, 0);
    await page.screenshot({
      path: `.registration-qa/mobile-stage-${step}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await scenario(page, "ממתין לאישור");
  await select(page, "תפקיד בהדגמה בלבד", "מנהל/ת סניף");
  await page
    .getByRole("button", { name: "פתיחת טופס", exact: true })
    .first()
    .click();
  await expect(
    page.getByText("היסטוריית הגשות", { exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: ".registration-qa/admin-review.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  expect(apiRequests).toEqual([]);
  expect(
    await page.evaluate(
      async () => (await navigator.serviceWorker.getRegistrations()).length,
    ),
  ).toBe(0);
});
