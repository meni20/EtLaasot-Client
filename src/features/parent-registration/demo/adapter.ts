import {
  type DraftResponse,
  type FormDetail,
  type FormSummary,
  type RegistrationApi,
  type RegistrationStatus,
  RegistrationError,
} from "../api";
import type { RegistrationData } from "../contracts";
import { demoDeclarations, demoDeclarationVersion } from "./legal.fixture";

export const demoBranches = [
  { id: "demo-north", name: "סניף הדגמה צפון" },
  { id: "demo-south", name: "סניף הדגמה דרום" },
];
export const demoProfile = {
  name: "נועם דוגמה",
  phoneNumber: "0500000000",
  address: "רחוב הדגמה 12",
  email: "fictional@example.test",
  dateOfBirth: "2010-05-20",
  gender: "male" as const,
  shirtSize: "M",
};
const yearId = "11111111-1111-4111-8111-111111111111";
export const demoTrainees = [
  { id: "22222222-2222-4222-8222-222222222222", name: "נועם דוגמה" },
  { id: "33333333-3333-4333-8333-333333333333", name: "שירה בדויה" },
];
const formId = "44444444-4444-4444-8444-444444444444";
const versionId = "55555555-5555-4555-8555-555555555555";
export const demoCompleteData: RegistrationData = {
  trainee: {
    name: "נועם",
    familyName: "דוגמה",
    nationalId: "123456782",
    phone: "0500000000",
    dateOfBirth: "2010-05-20",
    address: "רחוב הדגמה 12",
    gender: "male",
    healthFund: "קופה לדוגמה",
    school: "בית ספר הדגמה",
    shirtSize: "M",
    pantsSize: "14",
  },
  parent1: {
    name: "הורה בדוי ראשון",
    phone: "0500000001",
    nationalId: "000000018",
  },
  parent2: { name: "הורה בדוי שני", nationalId: "000000026" },
  contacts: {
    familyStatus: "נשואים",
    emergencyName: "איש קשר בדוי",
    emergencyRelationship: "קרוב משפחה",
    emergencyPhone: "0500000002",
  },
  medical: {
    hasConditions: false,
    participationRestricted: false,
    takesMedication: false,
    hasFoodAllergies: false,
    eatsIndependently: true,
    hasToiletingDifficulties: false,
    usesDiapers: false,
    physicianName: "רופא הדגמה",
    physicianHealthFund: "קופה לדוגמה",
    physicianPhone: "0500000003",
  },
  development: {
    level: "מתאים לגיל הכרונולוגי",
    details: "נתונים בדויים לבדיקת ממשק בלבד",
  },
  declarationVersion: demoDeclarationVersion,
  declarationAcceptances: Array(10).fill(true),
};
export const demoScenarios = {
  required: "נדרש רישום",
  complete: "טיוטה מלאה לחתימה",
  pending: "ממתין לאישור",
  changes: "נדרשים תיקונים",
  approved: "מאושר",
  none: "לא נדרש רישום",
  conflict: "התנגשות בשמירה",
  network: "כשל שמירה זמני",
  unauthorized: "חיבור פג (401)",
} as const;
export type DemoScenario = keyof typeof demoScenarios;
const delay = () =>
  new Promise<void>((resolve) => window.setTimeout(resolve, 180));
export function createDemoAdapter(
  scenario: DemoScenario,
  allowedBranches: string[],
) {
  let form: FormSummary = {
    id: formId,
    branchId: demoBranches[0].id,
    activityYearId: yearId,
    requestType: "YEARLY",
    status:
      scenario === "pending"
        ? "PENDING_REVIEW"
        : scenario === "changes"
          ? "CHANGES_REQUESTED"
          : scenario === "approved"
            ? "APPROVED"
            : "DRAFT",
    revision: 0,
    currentStep: scenario === "complete" ? 5 : 1,
    blocksAccess: true,
    documentStatus: "PENDING",
    submittedAt: null,
    approvedAt: null,
  };
  let data: RegistrationData =
    scenario === "required" || scenario === "conflict" || scenario === "network"
      ? {}
      : structuredClone(demoCompleteData);
  let hasForm = scenario !== "required" && scenario !== "none";
  let reason = "נא לפרט את העזרה הנדרשת בניידות ולעדכן את הסיכום הרפואי.";
  let failOnce = scenario === "network";
  let conflict = scenario === "conflict";
  let submitted = ["pending", "changes", "approved"].includes(scenario);
  let simulations = 0;
  const guard = () => {
    if (scenario === "unauthorized") throw new RegistrationError(401);
  };
  const scope = (branchId: string) => {
    guard();
    if (!allowedBranches.includes(branchId)) throw new RegistrationError(403);
  };
  const idsByBranch = [
    [formId, "66666666-6666-4666-8666-666666666666"],
    [
      "77777777-7777-4777-8777-777777777777",
      "88888888-8888-4888-8888-888888888888",
    ],
  ];
  const otherForms = new Map<string, FormSummary>();
  const feedbackByForm = new Map<string, string>();
  demoBranches.forEach((branch, index) =>
    idsByBranch[index].forEach((id, row) => {
      if (id !== formId)
        otherForms.set(id, {
          ...form,
          id,
          branchId: branch.id,
          status: row === 1 ? "PENDING_REVIEW" : form.status,
        });
    }),
  );
  const resolve = (id: string): FormSummary => {
    const found = id === formId ? form : otherForms.get(id);
    if (!found) throw new RegistrationError(404);
    scope(found.branchId);
    return found;
  };
  const me = (): DraftResponse => ({
    form: hasForm ? structuredClone(form) : null,
    data: structuredClone(data),
    contentHash: "0".repeat(64),
    declarations: [...demoDeclarations],
    declarationVersion: demoDeclarationVersion,
    previousApproved:
      scenario === "approved" ? { formId, versionId, documents: [] } : null,
  });
  const status = (): RegistrationStatus => ({
    form: hasForm ? { ...form } : null,
    annualRequired: scenario !== "none" && form.status !== "APPROVED",
    annualActivityYearId: yearId,
    registrationRequired: scenario !== "none" && form.status !== "APPROVED",
    wouldBlockAccess:
      scenario !== "none" && form.status !== "APPROVED" && form.blocksAccess,
    accessBlocked: false,
    documentIntegration: "DEFERRED",
  });
  const detail = (): FormDetail => ({
    form: { ...form },
    requestReason: null,
    feedbackReason: form.status === "CHANGES_REQUESTED" ? reason : null,
    versions: submitted
      ? [
          {
            id: versionId,
            versionNumber: 1,
            submittedAt: "2026-10-21T08:00:00Z",
            data: structuredClone(data),
            declarationVersion: demoDeclarationVersion,
            declarations: [...demoDeclarations],
          },
        ]
      : [],
    differences: [
      {
        field: "trainee.phone",
        currentValue: "0500000099",
        proposedValue: data.trainee?.phone ?? "",
      },
    ],
    medicalSynchronization: "MANUAL_RECONCILIATION_REQUIRED",
    existingAllergies: "לא צוינו (נתונים בדויים)",
    existingMedications: [],
    documents: [],
  });
  const api: RegistrationApi = {
    mode: "demo",
    me: async () => {
      guard();
      await delay();
      return me();
    },
    status: async () => {
      guard();
      return status();
    },
    feedback: async () => {
      guard();
      return {
        formId: hasForm ? form.id : null,
        status: hasForm ? form.status : null,
        reason: form.status === "CHANGES_REQUESTED" ? reason : null,
        requestReason: null,
      };
    },
    save: async (input) => {
      guard();
      await delay();
      if (failOnce) {
        failOnce = false;
        throw new RegistrationError(0);
      }
      if (conflict) {
        conflict = false;
        form.revision++;
        throw new RegistrationError(409);
      }
      if (input.revision !== form.revision) throw new RegistrationError(409);
      if (!["DRAFT", "CHANGES_REQUESTED"].includes(form.status))
        throw new RegistrationError(409);
      data = structuredClone(input.data);
      hasForm = true;
      form = {
        ...form,
        revision: form.revision + 1,
        currentStep: input.currentStep,
      };
      return {
        form: { ...form },
        data: structuredClone(data),
        contentHash: "0".repeat(64),
      };
    },
    // Intentionally unavailable, even in mock mode: do not fabricate document references.
    submit: async () => {
      throw new Error("הדגמת מצב בלבד — שירות העלאה ושליחה אינו מחובר");
    },
    years: async () => [
      {
        id: yearId,
        name: "תשפ״ז · 2026–2027",
        startsOn: "2026-09-01",
        endsOn: "2027-08-31",
        isActive: true,
      },
    ],
    list: async (params) => {
      scope(params.branchId);
      const branchIndex = demoBranches.findIndex(
        (branch) => branch.id === params.branchId,
      );
      const rows = idsByBranch[branchIndex]
        .map(resolve)
        .map((row, index) => ({
          ...row,
          traineeUuid: demoTrainees[index].id,
          createdAt: "2026-10-21T08:00:00Z",
        }))
        .filter(
          (row) =>
            row.activityYearId === params.activityYearId &&
            (!params.status || row.status === params.status),
        );
      return {
        rows: rows.slice(
          (params.page - 1) * params.pageSize,
          params.page * params.pageSize,
        ),
        count: rows.length,
      };
    },
    detail: async (id) => {
      const found = resolve(id);
      return id === formId
        ? detail()
        : {
            ...detail(),
            form: { ...found },
            feedbackReason: feedbackByForm.get(id) ?? null,
            versions: [
              {
                id: versionId,
                versionNumber: 1,
                submittedAt: "2026-10-21T08:00:00Z",
                data: structuredClone(demoCompleteData),
                declarationVersion: demoDeclarationVersion,
                declarations: [...demoDeclarations],
              },
            ],
          };
    },
    openPeriod: async (branchId) => {
      scope(branchId);
      return { status: "OPEN" };
    },
    requestChanges: async (id, input) => {
      const found = resolve(id);
      if (!input.trim()) throw new RegistrationError(400);
      if (found.status !== "PENDING_REVIEW") throw new RegistrationError(409);
      if (id === formId) {
        reason = input;
        form = { ...form, status: "CHANGES_REQUESTED" };
      } else {
        otherForms.set(id, { ...found, status: "CHANGES_REQUESTED" });
        feedbackByForm.set(id, input);
      }
      return { ...found, id, status: "CHANGES_REQUESTED" };
    },
    approve: async () => {
      throw new Error("אין PDF מאומת; לא ניתן לאשר");
    },
    renew: async (id, input) => {
      scope(input.branchId);
      if (!demoTrainees.some((t) => t.id === id) || !input.reason.trim())
        throw new RegistrationError(400);
      const branchIndex = demoBranches.findIndex(
        (branch) => branch.id === input.branchId,
      );
      const traineeIndex = demoTrainees.findIndex((t) => t.id === id);
      const target = resolve(idsByBranch[branchIndex][traineeIndex]);
      const renewed: FormSummary = {
        ...target,
        requestType: "INDIVIDUAL",
        blocksAccess: input.blocksAccess,
        status: "DRAFT",
      };
      if (target.id === formId) form = renewed;
      else otherForms.set(target.id, renewed);
      return { ...renewed };
    },
  };
  return {
    api,
    simulateSubmission: async () => {
      if (form.status === "PENDING_REVIEW") return;
      simulations++;
      await delay();
      submitted = true;
      form = {
        ...form,
        status: "PENDING_REVIEW",
        submittedAt: new Date().toISOString(),
      };
    },
    getSimulationCount: () => simulations,
  };
}
