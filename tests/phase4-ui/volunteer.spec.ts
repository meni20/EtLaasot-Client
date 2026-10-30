import { test, expect, type Page } from "@playwright/test";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  canonical,
  coveredData,
  reconcileSignatures,
  type VolunteerData,
  type VolunteerPurpose,
} from "../../src/features/volunteer-registration/contracts";
const version = "volunteer-v1",
  branch = "phase4-fictional-branch";
const legal = JSON.parse(
  fs.readFileSync(path.resolve("tests/fixtures/volunteer-legal.json"), "utf8"),
);
test.skip(
  process.env.PHASE1_UI_VOLUNTEER_PREPARATION !== "true",
  "Volunteer feature is disabled by default",
);
async function harness(page: Page, { minor = false, conflict = false } = {}) {
  let authorized = false,
    revision = 0,
    step = 1,
    submitted = false,
    pdfReady = false;
  let data: VolunteerData = {
    volunteer: { nationalId: "123456782" },
    agreements: { version },
  };
  const calls: { method: string; url: string; body: unknown }[] = [],
    errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const app = () => ({
    id: "00000000-0000-4000-8000-000000000008",
    registrationType: "VOLUNTEER",
    branchId: branch,
    status: submitted ? "PENDING_REVIEW" : "DRAFT",
    revision,
    currentStep: step,
    documentStatus: pdfReady ? "READY" : "PENDING",
    feedbackReason: null,
  });
  await page.route("**/*", async (route) => {
    const request = route.request(),
      url = new URL(request.url());
    if (url.hostname !== "127.0.0.1") {
      await route.abort();
      return;
    }
    if (
      !url.pathname.startsWith("/parent-applications") &&
      !url.pathname.startsWith("/auth/")
    ) {
      await route.continue();
      return;
    }
    let body: unknown;
    try {
      body = request.postDataJSON();
    } catch {
      /*multipart*/
    }
    calls.push({ method: request.method(), url: url.pathname, body });
    const reply = (value: unknown, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(value),
      });
    if (url.pathname === "/auth/identify") return reply({ next: "REGISTER" });
    if (url.pathname.endsWith("/branches"))
      return reply([
        { id: branch, name: "סניף בדיקה מקומי", city: "עיר בדיקה" },
      ]);
    if (url.pathname.endsWith("/start")) {
      authorized = true;
      return reply(
        {
          application: app(),
          sessionToken: "t".repeat(43),
          recoveryCode: "r".repeat(43),
          expiresAt: "2027-01-01T00:00:00Z",
        },
        201,
      );
    }
    if (!authorized) return reply({}, 401);
    if (url.pathname.endsWith("/me"))
      return reply({
        application: app(),
        data,
        contentHash: "a".repeat(64),
        declarations: legal.agreement,
        declarationVersion: version,
        legal,
        integration: "READY",
      });
    if (url.pathname.endsWith("/pdf"))
      return route.fulfill({
        status: 200,
        contentType: "application/pdf",
        body: Buffer.from("%PDF-fictional"),
      });
    if (url.pathname.endsWith("/pdf/retry")) {
      pdfReady = true;
      return reply({ status: "READY" });
    }
    if (url.pathname.endsWith("/draft")) {
      const input = body as {
        data: VolunteerData;
        revision: number;
        currentStep: number;
      };
      if (conflict || input.revision !== revision) return reply({}, 409);
      data = reconcileSignatures(data, input.data, version);
      revision++;
      step = input.currentStep;
      return reply({ application: app(), data, contentHash: "a".repeat(64) });
    }
    if (url.pathname.includes("/attachments/")) {
      const purpose = request
        .postDataBuffer()
        ?.toString()
        .match(/name="signer"\r\n\r\n([^\r]+)/)?.[1] as VolunteerPurpose;
      const contentHash = purpose
        ? createHash("sha256")
            .update(canonical(coveredData(data, purpose, version)))
            .digest("hex")
        : "b".repeat(64);
      return reply(
        {
          documentId: randomUUID(),
          contentHash,
          signedAt: new Date().toISOString(),
          agreementVersion: version,
        },
        201,
      );
    }
    if (url.pathname.endsWith("/submit")) {
      submitted = true;
      return reply(
        {
          application: app(),
          versionId: randomUUID(),
          versionNumber: 1,
          idempotent: false,
        },
        201,
      );
    }
    return reply({}, 404);
  });
  async function start() {
    await page.goto("/phase4-demo.html?screen=apply");
    await page.getByLabel("תעודת זהות חניך").fill("123456782");
    await select(page, "סוג הרשמה", "הרשמה למתנדב");
    await select(page, "סניף פעיל", "סניף בדיקה מקומי · עיר בדיקה");
    await page.getByRole("button", { name: "יצירת בקשה ללא חשבון" }).click();
    await page
      .getByRole("button", { name: "שמרתי את קוד השחזור במקום בטוח" })
      .click();
    await expect(
      page.getByRole("heading", { name: "הרשמה למתנדב/ת" }),
    ).toBeVisible();
  }
  async function personal() {
    for (const [label, value] of [
      ["שם פרטי", "בדיקה"],
      ["שם משפחה", "מקומית"],
      ["כתובת מגורים", "כתובת בדיקה"],
      ["מייל", "test@example.invalid"],
      ["מספר טלפון של המתנדב", "0520000000"],
      ["שם אמא", "אמא"],
      ["פלאפון אמא", "0500000000"],
      ["שם אב", "אבא"],
      ["פלאפון אב", "0500000001"],
    ])
      await page.getByLabel(label, { exact: false }).first().fill(value);
    await page
      .getByLabel("תאריך לידה", { exact: false })
      .fill(minor ? "2010-01-01" : "2000-01-01");
    await select(page, "מין", "נקבה");
    await select(page, "מידת חולצה", "M");
    if (minor) {
      await page.getByLabel("בית ספר", { exact: false }).fill("בית ספר בדיקה");
      await page.getByLabel("כיתה", { exact: false }).fill("י");
    }
  }
  async function questionnaire() {
    await stage(page, 2);
    await select(page, "מעוניין להתנדב במשחקייה/חונכות בית/אחר", "משחקייה");
    await select(page, "קטן/בוגר", "קטן");
    await select(page, "מדבר/לא מתקשר", "מדבר");
    await select(page, "עם טיטול/ללא טיטול", "ללא טיטול");
    await page.getByRole("radio", { name: "לא", exact: true }).nth(0).check();
    await page.getByRole("radio", { name: "לא", exact: true }).nth(1).check();
    await page
      .getByLabel("4. מה הביא אותך לרצות להתנדב בעמותת עת לעשות?", {
        exact: false,
      })
      .fill("רוצה לעזור");
  }
  return { start, personal, questionnaire, calls, errors, getData: () => data };
}
async function select(page: Page, label: string, option: string) {
  await page
    .getByRole("combobox", {
      name: new RegExp("^" + label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    })
    .click();
  await page.getByRole("option", { name: option, exact: true }).click();
  await expect(page.locator(".MuiPopover-root")).toHaveCount(0);
}
async function stage(page: Page, n: number) {
  await page
    .getByRole("button", { name: new RegExp("^" + n + "\\. ") })
    .click();
}
async function sign(page: Page, purpose: VolunteerPurpose) {
  const section = page.getByTestId(`signature-${purpose}`),
    canvas = section.locator("canvas");
  await canvas.scrollIntoViewIfNeeded();
  const rect = (await canvas.boundingBox())!;
  await page.mouse.move(rect.x + 15, rect.y + 50);
  await page.mouse.down();
  for (let i = 1; i < 12; i++)
    await page.mouse.move(rect.x + 15 + i * 12, rect.y + 50 + Math.sin(i) * 15);
  await page.mouse.up();
  await section.getByRole("button", { name: "סיום חתימה" }).click();
  await section.getByRole("button", { name: "שמירת חתימה" }).click();
  await expect(section.getByText("חתימה שמורה", { exact: true })).toBeVisible();
}
test("complete adult volunteer form, exact legal content, RTL, autosave, current-session restoration and one submission", async ({
  page,
}) => {
  const h = await harness(page);
  await h.start();
  await h.personal();
  await expect(
    page.getByRole("status").filter({ hasText: "נשמר" }),
  ).toBeVisible();
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.screenshot({
    path: ".registration-qa/volunteer-personal.png",
    fullPage: true,
  });
  await page.reload();
  await expect(page.getByLabel("שם פרטי", { exact: false })).toHaveValue(
    "בדיקה",
  );
  await expect(page.getByLabel("מספר טלפון של המתנדב")).toHaveValue(
    "0520000000",
  );
  await h.questionnaire();
  await stage(page, 3);
  await expect(
    page.getByText(legal.agreement.at(-1), { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("checkbox", { name: "קראתי ואני מאשר/ת את הסכם ההתנדבות" })
    .check();
  await sign(page, "VOLUNTEER_AGREEMENT");
  await stage(page, 4);
  await expect(page.getByText(/אישור הורים אינו נדרש/)).toBeVisible();
  await stage(page, 5);
  await expect(
    page.getByText(legal.confidentiality[5], { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("checkbox", {
      name: "קראתי ואני מאשר/ת את ההתחייבות לשמירת סודיות",
    })
    .check();
  await sign(page, "CONFIDENTIALITY");
  await page.screenshot({
    path: ".registration-qa/volunteer-adult.png",
    fullPage: true,
  });
  const horizontal = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(horizontal).toBe(false);
  await page.getByRole("button", { name: "שליחת בקשת התנדבות" }).dblclick();
  await expect(
    page.getByText("הטופס נשלח בהצלחה והועבר לטיפול."),
  ).toBeVisible();
  expect(h.calls.filter((c) => c.url.endsWith("/submit"))).toHaveLength(1);
  await expect(
    page.getByRole("button", { name: "הורדת PDF חתום" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "ניסיון נוסף להפקת PDF" }).click();
  await expect(page.getByText("המסמך החתום מוכן", { exact: true })).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "הורדת PDF חתום" }).click();
  expect((await download).suggestedFilename()).toBe(
    "volunteer-registration.pdf",
  );
  expect(h.calls.filter((c) => c.url.endsWith("/me/pdf"))).toHaveLength(1);
  expect(h.errors).toEqual([]);
  expect(h.calls.find((c) => c.url.endsWith("/start"))?.body).toMatchObject({
    registrationType: "VOLUNTEER",
  });
});
test("minor consent, independent signatures and final renewal after parent edits", async ({
  page,
}) => {
  const h = await harness(page, { minor: true });
  await h.start();
  await h.personal();
  await h.questionnaire();
  await stage(page, 3);
  await page
    .getByRole("checkbox", { name: "קראתי ואני מאשר/ת את הסכם ההתנדבות" })
    .check();
  await sign(page, "VOLUNTEER_AGREEMENT");
  await stage(page, 4);
  await page.getByLabel("שם ההורה", { exact: false }).fill("הורה בדיקה");
  await page.getByLabel("תעודת זהות ההורה", { exact: false }).fill("000000018");
  await page
    .getByLabel("תאריך אישור ההורה", { exact: false })
    .fill("2026-01-01");
  await page
    .getByRole("checkbox", {
      name: "אני ההורה מאשר/ת את ההשתתפות כמפורט בנוסח",
    })
    .check();
  await sign(page, "PARENTAL_CONSENT");
  await stage(page, 5);
  await page
    .getByRole("checkbox", {
      name: "קראתי ואני מאשר/ת את ההתחייבות לשמירת סודיות",
    })
    .check();
  await sign(page, "CONFIDENTIALITY");
  await stage(page, 4);
  await page.getByLabel("שם ההורה", { exact: false }).fill("שם מתוקן");
  await expect(
    page.getByTestId("signature-PARENTAL_CONSENT").getByText("חתימה שמורה"),
  ).toHaveCount(0);
  await stage(page, 3);
  await expect(page.getByText("חתימה שמורה", { exact: true })).toBeVisible();
  await stage(page, 5);
  await expect(
    page.getByTestId("signature-CONFIDENTIALITY").getByText("חתימה שמורה"),
  ).toHaveCount(0);
  expect(h.errors).toEqual([]);
});
test("male adult clearance uses private multipart upload and final validation routes missing fields", async ({
  page,
}) => {
  const h = await harness(page);
  await h.start();
  await stage(page, 5);
  await page.getByRole("button", { name: "שליחת בקשת התנדבות" }).click();
  await expect(page.getByLabel("שם פרטי", { exact: false })).toBeVisible();
  await h.personal();
  await select(page, "מין", "זכר");
  await stage(page, 5);
  await page
    .getByLabel("אישור משטרה", { exact: true })
    .setInputFiles(path.resolve("../EtLaasot-Documents/mock/signature.png"));
  await expect(page.getByText("קובץ נשמר באחסון פרטי")).toBeVisible();
  expect(
    h.calls.filter((c) => c.url.includes("/attachments/POLICE_CLEARANCE")),
  ).toHaveLength(1);
  expect(h.errors).toEqual([]);
});
test("revision conflict freezes editing and never overwrites the draft", async ({
  page,
}) => {
  const h = await harness(page, { conflict: true });
  await h.start();
  await page.getByLabel("שם פרטי", { exact: false }).fill("בדיקה");
  await expect(
    page.getByText("העריכה נעצרה כדי למנוע דריסת נתונים."),
  ).toBeVisible();
  await expect(page.getByLabel("שם פרטי", { exact: false })).toBeDisabled();
  expect(h.calls.filter((c) => c.method === "PATCH")).toHaveLength(1);
});
