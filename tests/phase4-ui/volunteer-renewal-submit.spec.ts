import { createHash, randomUUID } from "node:crypto";
import { test, expect, type Page } from "@playwright/test";
import {
  canonical,
  coveredData,
  reconcileSignatures,
  type VolunteerData,
  type VolunteerPurpose,
} from "../../src/features/volunteer-registration/contracts";

const version = "volunteer-v1";

async function select(page: Page, label: string, option: string) {
  await page
    .getByRole("combobox", {
      name: new RegExp("^" + label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    })
    .click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

async function stage(page: Page, number: number) {
  await page
    .getByRole("button", { name: new RegExp("^" + number + "\\. ") })
    .click();
}

async function sign(page: Page, purpose: VolunteerPurpose) {
  const section = page.getByTestId(`signature-${purpose}`);
  const canvas = section.locator("canvas");
  await canvas.scrollIntoViewIfNeeded();
  const rect = (await canvas.boundingBox())!;
  await page.mouse.move(rect.x + 15, rect.y + 45);
  await page.mouse.down();
  for (let index = 1; index < 12; index++)
    await page.mouse.move(rect.x + 15 + index * 11, rect.y + 45 + Math.sin(index) * 12);
  await page.mouse.up();
  await section.getByRole("button", { name: "סיום חתימה" }).click();
  await section.getByRole("button", { name: "שמירת חתימה" }).click();
  await expect(section.getByText("חתימה שמורה", { exact: true })).toBeVisible();
}

test("existing volunteer saves, signs and submits one synthetic annual renewal", async ({
  page,
}) => {
  let revision = 0;
  let step = 1;
  let submitted = false;
  let data: VolunteerData = {
    volunteer: { nationalId: "123456782" },
    agreements: { version },
  };
  const calls: string[] = [];
  const application = () => ({
    id: "00000000-0000-4000-8000-000000000008",
    branchId: "phase4-fictional-branch",
    registrationType: "VOLUNTEER",
    status: submitted ? "PENDING_REVIEW" : "DRAFT",
    revision,
    currentStep: step,
    documentStatus: "PENDING",
    feedbackReason: null,
  });
  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname !== "127.0.0.1") return route.abort();
    if (!url.pathname.startsWith("/parent-registration")) return route.continue();
    calls.push(url.pathname);
    calls.push(`${request.method()} ${url.pathname}`);
    const reply = (value: unknown, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(value),
      });
    if (url.pathname.endsWith("/status"))
      return reply({ required: !submitted, accessBlocked: !submitted });
    if (url.pathname === "/parent-registration/me/volunteer" && request.method() === "GET")
      return reply({
        application: application(),
        data,
        declarationVersion: version,
        integration: "READY",
        legal: {
          agreement: ["הסכם בדיקה"],
          parental: "אישור הורים לבדיקה",
          confidentiality: ["התחייבות סודיות לבדיקה"],
          clearance: "אישור משטרה לבדיקה",
        },
      });
    if (url.pathname === "/parent-registration/me/volunteer" && request.method() === "PATCH") {
      const input = request.postDataJSON() as {
        data: VolunteerData;
        revision: number;
        currentStep: number;
      };
      expect(input.revision).toBe(revision);
      data = reconcileSignatures(data, input.data, version);
      revision++;
      step = input.currentStep;
      return reply({ application: application(), data });
    }
    if (url.pathname.includes("/attachments/SIGNATURE")) {
      const purpose = request
        .postDataBuffer()
        ?.toString()
        .match(/name="signer"\r\n\r\n([^\r]+)/)?.[1] as VolunteerPurpose;
      expect(purpose).toBeTruthy();
      return reply(
        {
          documentId: randomUUID(),
          contentHash: createHash("sha256")
            .update(canonical(coveredData(data, purpose, version)))
            .digest("hex"),
          signedAt: new Date().toISOString(),
          agreementVersion: version,
        },
        201,
      );
    }
    if (url.pathname.endsWith("/submit")) {
      submitted = true;
      return reply({ application: application(), versionId: randomUUID() }, 201);
    }
    return reply({}, 404);
  });

  await page.goto("/phase4-demo.html?screen=volunteer-renewal");
  for (const [label, value] of [
    ["שם פרטי", "מתנדבת"],
    ["שם משפחה", "בדיקה"],
    ["כתובת מגורים", "כתובת בדיקה"],
    ["מייל", "renewal@example.invalid"],
    ["מספר טלפון של המתנדב", "0520000000"],
    ["שם אמא", "אמא"],
    ["פלאפון אמא", "0500000000"],
    ["שם אב", "אבא"],
    ["פלאפון אב", "0500000001"],
  ])
    await page.getByLabel(label, { exact: false }).first().fill(value);
  await page.getByLabel("תאריך לידה", { exact: false }).fill("2000-01-01");
  await select(page, "מין", "נקבה");
  await select(page, "מידת חולצה", "M");

  await stage(page, 2);
  await select(page, "מעוניין להתנדב במשחקייה/חונכות בית/אחר", "משחקייה");
  await select(page, "קטן/בוגר", "לא משנה לי");
  await select(page, "מדבר/לא מתקשר", "לא משנה לי");
  await select(page, "עם טיטול/ללא טיטול", "לא משנה לי");
  await page.getByRole("radio", { name: "לא", exact: true }).nth(0).check();
  await page.getByRole("radio", { name: "לא", exact: true }).nth(1).check();
  await page
    .getByLabel("4. מה הביא אותך לרצות להתנדב בעמותת עת לעשות?", {
      exact: false,
    })
    .fill("רוצה לעזור");

  await stage(page, 3);
  await page
    .getByRole("checkbox", { name: "קראתי ואני מאשר/ת את הסכם ההתנדבות" })
    .check();
  await sign(page, "VOLUNTEER_AGREEMENT");
  await stage(page, 5);
  await page
    .getByRole("checkbox", { name: "קראתי ואני מאשר/ת את ההתחייבות לשמירת סודיות" })
    .check();
  await sign(page, "CONFIDENTIALITY");
  await page.getByRole("button", { name: "שליחת בקשת התנדבות" }).click();
  await expect(page.getByText("הבקשה ממתינה לאישור מנהל.")).toBeVisible();
  expect(
    calls.filter((call) => call.startsWith("POST ") && call.includes("attachments/SIGNATURE")),
  ).toHaveLength(2);
  expect(calls.filter((call) => call.startsWith("POST ") && call.endsWith("/submit"))).toHaveLength(1);
});
