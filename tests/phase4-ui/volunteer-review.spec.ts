import { test, expect, type Page } from "@playwright/test";
import { randomUUID, createHash } from "node:crypto";
import fs from "node:fs";
import {
  canonical,
  coveredData,
  type VolunteerData,
  type VolunteerPurpose,
} from "../../src/features/volunteer-registration/contracts";
test.skip(
  process.env.PHASE1_UI_VOLUNTEER_PREPARATION !== "true",
  "Volunteer review is independently disabled by default",
);
const legal = JSON.parse(
  fs.readFileSync("tests/fixtures/volunteer-legal.json", "utf8"),
);
const appId = "00000000-0000-4000-8000-000000000001",
  versionId = "00000000-0000-4000-8000-000000000002",
  branch = "phase4-fictional-branch";
const temporaryPassword = "FictionalOnly!4827x";
async function harness(
  page: Page,
  {
    minor = false,
    missingPdf = false,
    missingClearance = false,
    stale = false,
  } = {},
) {
  let status = "PENDING_REVIEW";
  const history: {
    id: string;
    action: string;
    versionId: string;
    reason: string | null;
    createdAt: string;
  }[] = [];
  const data: VolunteerData = {
    volunteer: {
      firstName: "מתנדב",
      lastName: "בדיקה",
      nationalId: "123456782",
      dateOfBirth: minor ? "2010-01-01" : "2000-01-01",
      gender: "male",
      address: "כתובת בדויה",
      phone: "0520000000",
      email: "fictional@example.invalid",
      shirtSize: "M",
      school: "בית ספר בדיקה",
      grade: "י",
      motherName: "אם",
      motherPhone: "0500000001",
      fatherName: "אב",
      fatherPhone: "0500000002",
    },
    questionnaire: {
      preference: "משחקייה",
      age: "קטן",
      communication: "מדבר",
      diaper: "ללא טיטול",
      instructionExperience: false,
      specialNeedsExperience: false,
      motivation: "רצון לתרום לקהילה",
    },
    agreements: {
      version: "volunteer-v1",
      volunteer: true,
      confidentiality: true,
    },
  };
  if (minor)
    data.parentConsent = {
      name: "הורה בדיקה",
      nationalId: "000000018",
      date: "2026-10-24",
      acknowledged: true,
    };
  const documents: {
    id: string;
    kind: string;
    versionId: string | null;
    registrationType: string;
    signaturePurpose?: string;
    contentHash: string;
    templateVersion?: string;
    sourceChecksum?: string;
    verifiedAt: string;
    mimeType: string;
    fileSize: number;
    checksum: string;
  }[] = [];
  if (!minor) {
    data.policeClearanceDocumentId = randomUUID();
    if (!missingClearance)
      documents.push({
        id: data.policeClearanceDocumentId,
        kind: "POLICE_CLEARANCE",
        versionId: null,
        registrationType: "VOLUNTEER",
        contentHash: "c".repeat(64),
        verifiedAt: "2026-10-24T10:00:00Z",
        mimeType: "application/pdf",
        fileSize: 100,
        checksum: "b".repeat(64),
      });
  }
  for (const purpose of [
    "VOLUNTEER_AGREEMENT",
    ...(minor ? ["PARENTAL_CONSENT"] : []),
    "CONFIDENTIALITY",
  ] as VolunteerPurpose[]) {
    const documentId = randomUUID(),
      contentHash = createHash("sha256")
        .update(canonical(coveredData(data, purpose, "volunteer-v1")))
        .digest("hex");
    data.signatures = {
      ...data.signatures,
      [purpose]: {
        documentId,
        contentHash,
        signedAt: "2026-10-24T10:00:00.000Z",
        agreementVersion: "volunteer-v1",
      },
    };
    documents.push({
      id: documentId,
      kind: "SIGNATURE",
      versionId: null,
      registrationType: "VOLUNTEER",
      signaturePurpose: purpose,
      contentHash,
      verifiedAt: "2026-10-24T10:00:00Z",
      mimeType: "image/png",
      fileSize: 100,
      checksum: "b".repeat(64),
    });
  }
  const pdfId = randomUUID();
  if (!missingPdf)
    documents.push({
      id: pdfId,
      kind: "REGISTRATION_PDF",
      versionId,
      registrationType: "VOLUNTEER",
      contentHash: "a".repeat(64),
      templateVersion: "volunteer-registration/v1",
      sourceChecksum:
        "c33ecf62031f10052477478889e2ff3f4446b72e9842ba0abed7974226f8b607",
      verifiedAt: "2026-10-25T10:00:00Z",
      mimeType: "application/pdf",
      fileSize: 100,
      checksum: "b".repeat(64),
    });
  const calls: {
      path: string;
      query: URLSearchParams;
      method: string;
      body: Record<string, unknown> | null;
    }[] = [],
    errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const summary = () => ({
    id: appId,
    registrationType: "VOLUNTEER",
    branchId: branch,
    status,
    revision: 1,
    currentStep: 5,
    documentStatus: missingPdf ? "FAILED" : "READY",
    feedbackReason: null,
    applicantName: "מתנדב בדיקה",
    pdfDocumentId: missingPdf ? null : pdfId,
  });
  await page.route("**/*", async (route) => {
    const req = route.request(),
      url = new URL(req.url());
    if (url.hostname !== "127.0.0.1") return route.abort();
    if (!url.pathname.startsWith("/parent-applications"))
      return route.continue();
    const body = req.postData() ? req.postDataJSON() : null;
    calls.push({
      path: url.pathname,
      query: url.searchParams,
      method: req.method(),
      body,
    });
    const reply = (data: unknown, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        headers: { "Cache-Control": "private, no-store" },
        body: JSON.stringify(data),
      });
    const base = "/parent-applications/admin";
    if (url.pathname === base) return reply({ rows: [summary()], count: 26 });
    if (url.pathname === `${base}/${appId}`)
      return reply({
        application: summary(),
        branch: { id: branch, name: "סניף בדיקה מקומי", isActive: true },
        versions: [
          {
            id: versionId,
            versionNumber: 1,
            registrationType: "VOLUNTEER",
            data,
            contentHash: "a".repeat(64),
            submittedAt: "2026-10-25T10:00:00Z",
            templateVersion: "volunteer-registration/v1",
            declarations: [
              ...legal.agreement,
              legal.parental,
              ...legal.confidentiality,
            ],
            declarationVersion: "volunteer-v1",
            declarationSections: legal,
          },
        ],
        documents,
        integration: "READY",
        history,
      });
    if (url.pathname.includes("/documents/"))
      return route.fulfill({
        contentType: "application/pdf",
        body: Buffer.from("%PDF-fictional"),
      });
    if (url.pathname.endsWith("/approve")) {
      if (stale || body.expectedVersionId !== versionId) return reply({}, 409);
      status = "APPROVED";
      history.push({
        id: randomUUID(),
        action: status,
        versionId,
        reason: null,
        createdAt: "2026-10-25T11:00:00Z",
      });
      return reply({
        temporaryPassword,
        temporaryPasswordExpiresAt: "2026-11-01T10:00:00Z",
      });
    }
    if (
      url.pathname.endsWith("/request-changes") ||
      url.pathname.endsWith("/reject")
    ) {
      if (body.expectedVersionId !== versionId) return reply({}, 409);
      status = url.pathname.endsWith("/reject")
        ? "REJECTED"
        : "CHANGES_REQUESTED";
      history.push({
        id: randomUUID(),
        action: status,
        versionId,
        reason: String(body.reason),
        createdAt: "2026-10-25T11:00:00Z",
      });
      return reply(summary());
    }
    return reply({}, 404);
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/phase4-demo.html?screen=admin");
  await expect(
    page.getByRole("button", { name: /^מתנדב בדיקה/ }),
  ).toBeVisible();
  const open = async () =>
    page.getByRole("button", { name: /^מתנדב בדיקה/ }).click();
  return { calls, errors, open };
}
test("manager uses server filters and pagination; immutable volunteer details and private PDF download", async ({
  page,
}) => {
  const h = await harness(page);
  await page.getByLabel("סוג הרשמה").click();
  await page.getByRole("option", { name: "מתנדבים", exact: true }).click();
  await expect
    .poll(() =>
      h.calls
        .filter((c) => c.path.endsWith("/admin"))
        .at(-1)
        ?.query.get("registrationType"),
    )
    .toBe("VOLUNTEER");
  await page.getByLabel("חיפוש לפי שם").fill("מתנדב");
  await expect
    .poll(() =>
      h.calls
        .filter((c) => c.path.endsWith("/admin"))
        .at(-1)
        ?.query.get("search"),
    )
    .toBe("מתנדב");
  await page.getByRole("button", { name: "הבא", exact: true }).click();
  await expect
    .poll(() =>
      h.calls
        .filter((c) => c.path.endsWith("/admin"))
        .at(-1)
        ?.query.get("page"),
    )
    .toBe("2");
  await h.open();
  await expect(page.getByText("0520000000", { exact: true })).toBeVisible();
  await expect(
    page.getByText("רצון לתרום לקהילה", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "אישור הורים", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("textbox", { name: "מספר טלפון של המתנדב" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "הורדת אישור משטרה פרטי" }),
  ).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "הורדת PDF הרישום פרטי" }).click();
  await download;
  expect(h.calls.some((c) => c.path.includes("/documents/"))).toBe(true);
  await page.screenshot({
    path: ".registration-qa/volunteer-manager-desktop.png",
    fullPage: true,
  });
  expect(h.errors).toEqual([]);
});
test("approval requires confirmation, hands off the password once and removes it when closed", async ({
  page,
}) => {
  const h = await harness(page);
  await h.open();
  await page
    .getByRole("checkbox", {
      name: "אימתתי ידנית את זהות המתנדב, המסמכים ושיוכו לסניף",
    })
    .check();
  await page.getByRole("button", { name: "אישור ויצירת חשבון מתנדב" }).click();
  expect(h.calls.filter((c) => c.path.endsWith("/approve"))).toHaveLength(0);
  await page.getByRole("button", { name: "אישור סופי" }).click();
  const password = page.getByLabel("סיסמה זמנית למסירה");
  await expect(password).toHaveValue(temporaryPassword);
  await expect(password).toHaveAttribute("type", "password");
  expect(h.calls.find((c) => c.path.endsWith("/approve"))?.body).toMatchObject({
    expectedVersionId: versionId,
    identityVerified: true,
  });
  expect(
    await page.evaluate(
      (secret) =>
        JSON.stringify([localStorage, sessionStorage]).includes(secret),
      temporaryPassword,
    ),
  ).toBe(false);
  await page.getByRole("button", { name: "סיום והסרת הסיסמה מהמסך" }).click();
  await expect(password).toHaveCount(0);
  await h.open();
  await expect(password).toHaveCount(0);
  expect(h.errors).toEqual([]);
});
test("minor consent is read only; rejection and corrections carry the exact reviewed version and reason", async ({
  page,
}) => {
  let h = await harness(page, { minor: true });
  await h.open();
  await expect(
    page.getByRole("heading", { name: "אישור הורים", exact: true }),
  ).toBeVisible();
  await page.getByLabel("סיבת החזרה לתיקון או דחייה").fill("נא לתקן פרטים");
  await page.getByRole("button", { name: "החזרה לתיקון", exact: true }).click();
  await expect
    .poll(() => h.calls.find((c) => c.path.endsWith("/request-changes"))?.body)
    .toMatchObject({ reason: "נא לתקן פרטים", expectedVersionId: versionId });
  await page.unroute("**/*");
  h = await harness(page);
  await h.open();
  await page.getByLabel("סיבת החזרה לתיקון או דחייה").fill("סיבה מקומית");
  await page.getByRole("button", { name: "דחיית בקשה" }).click();
  expect(h.calls.filter((c) => c.path.endsWith("/reject"))).toHaveLength(0);
  await page.getByRole("button", { name: "ביטול", exact: true }).click();
  expect(h.calls.filter((c) => c.path.endsWith("/reject"))).toHaveLength(0);
  await page.getByRole("button", { name: "דחיית בקשה" }).click();
  await page.getByRole("button", { name: "אישור סופי" }).click();
  await expect
    .poll(() => h.calls.find((c) => c.path.endsWith("/reject"))?.body)
    .toMatchObject({ expectedVersionId: versionId, reason: "סיבה מקומית" });
  expect(h.calls.filter((c) => c.path.endsWith("/approve"))).toHaveLength(0);
});
test("missing clearance and PDF block approval; stale approval exposes no password", async ({
  page,
}) => {
  await harness(page, { missingClearance: true, missingPdf: true });
  await page.getByRole("button", { name: /^מתנדב בדיקה/ }).click();
  await expect(
    page.getByText("חסר אישור משטרה מאומת", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("חסר PDF רשמי של הגרסה הנוכחית", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "אישור ויצירת חשבון מתנדב" }),
  ).toBeDisabled();
  await page.unroute("**/*");
  const h = await harness(page, { stale: true });
  await h.open();
  await page
    .getByRole("checkbox", {
      name: "אימתתי ידנית את זהות המתנדב, המסמכים ושיוכו לסניף",
    })
    .check();
  await page.getByRole("button", { name: "אישור ויצירת חשבון מתנדב" }).click();
  await page.getByRole("button", { name: "אישור סופי" }).click();
  await expect(
    page.getByText(
      "הגרסה או מסמכי הבקשה השתנו. יש לבדוק מחדש את הבקשה לפני החלטה.",
    ),
  ).toBeVisible();
  await expect(page.getByLabel("סיסמה זמנית למסירה")).toHaveCount(0);
});
