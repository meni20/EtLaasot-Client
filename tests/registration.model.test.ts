import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  prefill,
  setField,
  validateForm,
  validId,
} from "../src/features/parent-registration/model.ts";
import {
  createRegistrationApi,
  canApprove,
  RegistrationError,
  type FormDetail,
} from "../src/features/parent-registration/api.ts";
import { demoDeclarations } from "../src/features/parent-registration/demo/legal.fixture.ts";
import type { AxiosInstance } from "axios";
import { registrationApiUrl } from "../src/features/parent-registration/environment.ts";

test("registration requires an explicit matching local or opted-in Railway DEV API", () => {
  const dev = "https://etlaasot-server-dev-dev.up.railway.app";
  assert.equal(registrationApiUrl(dev, dev, "dev"), dev);
  assert.equal(registrationApiUrl(dev, dev, undefined), null);
  assert.equal(
    registrationApiUrl(
      "http://127.0.0.1:3103/",
      "http://127.0.0.1:3103",
      undefined,
    ),
    "http://127.0.0.1:3103",
  );
  assert.equal(registrationApiUrl(undefined, dev, "dev"), null);
});
test("registration rejects Production, mismatches, insecure URLs and credential-bearing URLs", () => {
  const dev = "https://etlaasot-server-dev-dev.up.railway.app";
  for (const unsafe of [
    "https://etlaasot-server-main-main.up.railway.app",
    "http://etlaasot-server-dev-dev.up.railway.app",
    dev + ".example.invalid",
    dev + "/unexpected",
    dev + "?target=dev",
    dev + "#fragment",
    "https://user:secret@etlaasot-server-dev-dev.up.railway.app",
  ])
    assert.equal(registrationApiUrl(unsafe, unsafe, "dev"), null);
  assert.equal(registrationApiUrl(dev, "http://127.0.0.1:3103", "dev"), null);
});

test("profile autofill never splits a full name, invents an ID, or replaces saved/cleared fields", () => {
  const data = prefill(
    { trainee: { phone: "" } },
    { name: "שם מלא מורכב", phoneNumber: "0500000000", address: "כתובת בדויה" },
  );
  assert.equal(data.trainee?.phone, "");
  assert.equal(data.trainee?.address, "כתובת בדויה");
  assert.equal(data.trainee?.name, undefined);
  assert.equal(data.trainee?.nationalId, undefined);
});
test("every content edit invalidates both signatures without mutating the original", () => {
  const signature = {
    documentId: "fixture",
    signedAt: "fixture",
    contentHash: "fixture",
  };
  const original = {
    trainee: { name: "שם" },
    signatures: { parent1: signature, parent2: signature },
  };
  const edited = setField(original, "trainee.phone", "0500000000");
  assert.equal(edited.signatures, undefined);
  assert.ok(original.signatures.parent2);
});
test("final validation routes missing fields to all five stages and enforces parent-specific signing", () => {
  const issues = validateForm({}, "version", {
    physician: false,
    parent1: false,
    parent2: true,
  });
  assert.deepEqual(
    [...new Set(issues.map((i) => i.stage))].sort(),
    [1, 2, 3, 4, 5],
  );
  assert.ok(issues.some((i) => i.path === "parent2.nationalId"));
  assert.ok(issues.some((i) => i.path === "parent2.name"));
  assert.ok(
    issues.some((i) => i.path === "medical.physicianSummaryDocumentId"),
  );
  assert.ok(validId("123456782"));
  assert.equal(validId("123456789"), false);
});
test("conditional medical explanations and OTHER shirt size are required", () => {
  const issues = validateForm(
    {
      trainee: { shirtSize: "OTHER" },
      medical: {
        hasConditions: true,
        takesMedication: true,
        hasFoodAllergies: true,
        participationRestricted: true,
        hasToiletingDifficulties: true,
      },
    },
    "v",
    { physician: true, parent1: true, parent2: false },
  );
  for (const field of [
    "trainee.customShirtSize",
    "medical.conditions",
    "medical.medications",
    "medical.allergies",
    "medical.restrictionDetails",
    "medical.toiletingDetails",
  ])
    assert.ok(
      issues.some((i) => i.path === field),
      field,
    );
});
test("approval requires latest version, pending status, READY and a verified matching PDF", () => {
  const detail = {
    form: { status: "PENDING_REVIEW", documentStatus: "READY" },
    versions: [
      { id: "old", versionNumber: 1 },
      { id: "latest", versionNumber: 2 },
    ],
    documents: [
      { kind: "REGISTRATION_PDF", versionId: "old", verifiedAt: "2026-10-21" },
    ],
  } as FormDetail;
  assert.equal(canApprove(detail), false);
  detail.documents[0].versionId = "latest";
  assert.equal(canApprove(detail), true);
  detail.documents[0].verifiedAt = null;
  assert.equal(canApprove(detail), false);
  detail.documents[0].verifiedAt = "2026-10-21";
  detail.form.documentStatus = "PENDING";
  assert.equal(canApprove(detail), false);
  detail.form.documentStatus = "READY";
  detail.form.status = "APPROVED";
  assert.equal(canApprove(detail), false);
});
test("exact ten declarations match the existing reviewed server source byte-for-byte", () => {
  assert.equal(
    createHash("sha256").update(JSON.stringify(demoDeclarations)).digest("hex"),
    "4f0a92bfde794a72dc630fe9c49f613f70f2b5ec01c41ae31a3230f09b3e9ca6",
  );
  // Also compare against the sibling feature branch when this multi-project workspace is available.
  const serverSource = new URL(
    "../../EtLaasot-Server/src/modules/parent-registration/declarations.ts",
    import.meta.url,
  );
  if (!existsSync(serverSource)) return;
  const source = readFileSync(
    new URL(
      "../../EtLaasot-Server/src/modules/parent-registration/declarations.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const block = source.slice(
    source.indexOf("Object.freeze([") + 14,
    source.indexOf("]);"),
  );
  // This is a static array of string literals, parsed as data; never execute server code.
  const strings = [
    ...block.matchAll(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g),
  ].map((m) => {
    const literal = m[0];
    return literal[0] === '"'
      ? JSON.parse(literal)
      : literal.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"');
  });
  assert.equal(strings.length, 10);
  assert.deepEqual(demoDeclarations, strings);
});
test("invalid contact formats, future dates and contradictory medical selections cannot pass local validation", () => {
  const issues = validateForm(
    {
      trainee: {
        phone: "abc",
        email: "bad-address",
        dateOfBirth: "2099-01-01",
      },
      medical: {
        hasConditions: false,
        conditions: ["בדוי"],
        takesMedication: false,
        medications: [{ name: "בדויה" }],
        hasFoodAllergies: false,
        allergies: "בדוי",
      },
    },
    "v",
    { physician: false, parent1: false, parent2: false },
  );
  for (const path of [
    "trainee.phone",
    "trainee.email",
    "trainee.dateOfBirth",
    "medical.hasConditions",
    "medical.takesMedication",
    "medical.hasFoodAllergies",
  ])
    assert.ok(
      issues.some((issue) => issue.path === path),
      path,
    );
});
test("API adapter preserves paths and DTOs, with no uploads or implicit API fallback", async () => {
  const calls: { url: string; data: unknown; params: unknown }[] = [];
  const http = {
    request: async (request: {
      url: string;
      data: unknown;
      params: unknown;
    }) => {
      calls.push(request);
      return { data: {} };
    },
  } as unknown as AxiosInstance;
  const api = createRegistrationApi(http);
  await api.save({ revision: 3, currentStep: 2, data: {} });
  await api.submit({
    formId: "form",
    revision: 4,
    idempotencyKey: "stable-key",
  });
  await api.list({
    branchId: "branch",
    activityYearId: "year",
    page: 1,
    pageSize: 25,
  });
  await api.years();
  assert.deepEqual(
    calls.map((c) => c.url),
    [
      "/parent-registration/me/draft",
      "/parent-registration/me/submit",
      "/parent-registration/admin/forms",
      "/activity-years",
    ],
  );
  assert.deepEqual(calls[0].data, { revision: 3, currentStep: 2, data: {} });
});
test("API errors expose only safe status/field, never response bodies or credentials", async () => {
  for (const status of [0, 400, 401, 403, 409, 422, 503]) {
    const http = {
      request: async () => {
        throw {
          response: {
            status,
            data: {
              field: "medical.conditions",
              message: "SECRET_MEDICAL_VALUE",
            },
          },
          config: { headers: { Authorization: "SECRET_TOKEN" } },
        };
      },
    } as unknown as AxiosInstance;
    await assert.rejects(
      createRegistrationApi(http).me(),
      (error) =>
        error instanceof RegistrationError &&
        error.status === status &&
        !JSON.stringify(error).includes("SECRET"),
    );
  }
});
