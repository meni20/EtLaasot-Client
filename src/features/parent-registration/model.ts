import type { RegistrationData } from "./contracts";

export type ProfilePrefill = {
  name?: string;
  phoneNumber?: string | null;
  address?: string | null;
  email?: string | null;
  dateOfBirth?: string | null;
  gender?: "male" | "female" | null;
  shirtSize?: string | null;
  customShirtSize?: string | null;
};
export function prefill(
  data: RegistrationData,
  profile: ProfilePrefill,
): RegistrationData {
  const trainee = { ...data.trainee };
  // The profile has one full name. Never guess how to split it or reveal a masked ID.
  const values = {
    phone: profile.phoneNumber,
    address: profile.address,
    email: profile.email,
    dateOfBirth: profile.dateOfBirth?.slice(0, 10),
    gender: profile.gender,
    shirtSize: profile.shirtSize,
    customShirtSize: profile.customShirtSize,
  };
  for (const [key, value] of Object.entries(values)) {
    if (value && !(key in trainee)) Object.assign(trainee, { [key]: value });
  }
  return { ...data, trainee };
}
export function setField(
  data: RegistrationData,
  path: string,
  value: unknown,
): RegistrationData {
  const copy = structuredClone(data) as Record<string, unknown>;
  const parts = path.split(".");
  let node = copy;
  for (const part of parts.slice(0, -1)) {
    node[part] ??= {};
    node = node[part] as Record<string, unknown>;
  }
  node[parts.at(-1)!] = value;
  // Signatures attest the entire content, not just the currently visible stage.
  delete copy.signatures;
  return copy as RegistrationData;
}
export function valueAt(data: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (v, key) =>
        v && typeof v === "object"
          ? (v as Record<string, unknown>)[key]
          : undefined,
      data,
    );
}
export function validId(value: string): boolean {
  if (!/^\d{5,9}$/.test(value)) return false;
  return (
    value
      .padStart(9, "0")
      .split("")
      .reduce((sum, n, i) => {
        const v = Number(n) * ((i % 2) + 1);
        return sum + (v > 9 ? v - 9 : v);
      }, 0) %
      10 ===
    0
  );
}
export interface FieldIssue {
  path: string;
  stage: number;
  message: string;
}
export function stageFor(path: string): number {
  return path.startsWith("signatures") ||
    /parent[12]\.nationalId|physicianSummary/.test(path)
    ? 5
    : path.startsWith("declaration")
      ? 4
      : /^(medical|development)/.test(path)
        ? 3
        : path.startsWith("trainee.school") || /^(parent|contacts)/.test(path)
          ? 2
          : 1;
}
export function validateForm(
  data: RegistrationData,
  version: string,
  local: { physician: boolean; parent1: boolean; parent2: boolean },
): FieldIssue[] {
  const issues: FieldIssue[] = [];
  const add = (path: string, message = "יש להשלים שדה זה") =>
    issues.push({ path, stage: stageFor(path), message });
  const required = [
    "trainee.name",
    "trainee.familyName",
    "trainee.nationalId",
    "trainee.phone",
    "trainee.dateOfBirth",
    "trainee.address",
    "trainee.gender",
    "trainee.healthFund",
    "trainee.school",
    "trainee.shirtSize",
    "trainee.pantsSize",
    "parent1.name",
    "parent1.phone",
    "contacts.familyStatus",
    "contacts.emergencyName",
    "contacts.emergencyRelationship",
    "contacts.emergencyPhone",
    "medical.physicianName",
    "medical.physicianPhone",
    "medical.physicianHealthFund",
    "development.level",
  ];
  for (const path of required)
    if (!String(valueAt(data, path) ?? "").trim()) add(path);
  for (const person of ["trainee", "parent1", "parent2"] as const) {
    const value = data[person];
    if (value?.phone && !/^[+\d() -]{5,30}$/.test(value.phone))
      add(`${person}.phone`, "יש להזין מספר טלפון תקין");
    if (value?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email))
      add(`${person}.email`, "יש להזין כתובת דואר אלקטרוני תקינה");
    const date = value?.dateOfBirth;
    if (
      date &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !Number.isFinite(Date.parse(date)) ||
        new Date(date).toISOString().slice(0, 10) !== date ||
        date > new Date().toISOString().slice(0, 10) ||
        Date.now() - Date.parse(date) > 121 * 366 * 86400000)
    )
      add(`${person}.dateOfBirth`, "יש להזין תאריך לידה תקין");
  }
  for (const path of [
    "contacts.emergencyPhone",
    "contacts.schoolPhone",
    "contacts.schoolCounselorPhone",
    "medical.physicianPhone",
  ]) {
    const value = valueAt(data, path);
    if (value && !/^[+\d() -]{5,30}$/.test(String(value)))
      add(path, "יש להזין מספר טלפון תקין");
  }
  if (!data.medical?.hasConditions && data.medical?.conditions?.length)
    add("medical.hasConditions", "יש להתאים את הבחירה למצבים שפורטו");
  if (!data.medical?.takesMedication && data.medical?.medications?.length)
    add("medical.takesMedication", "יש להתאים את הבחירה לתרופות שפורטו");
  if (!data.medical?.hasFoodAllergies && data.medical?.allergies?.trim())
    add("medical.hasFoodAllergies", "יש להתאים את הבחירה לאלרגיות שפורטו");
  for (const key of [
    "hasConditions",
    "participationRestricted",
    "takesMedication",
    "hasFoodAllergies",
    "eatsIndependently",
    "hasToiletingDifficulties",
    "usesDiapers",
  ])
    if (typeof valueAt(data, `medical.${key}`) !== "boolean")
      add(`medical.${key}`, "יש לבחור כן או לא");
  if (data.trainee?.nationalId && !validId(data.trainee.nationalId))
    add("trainee.nationalId", "תעודת הזהות אינה תקינה");
  for (const [condition, path] of [
    [data.medical?.participationRestricted, "medical.restrictionDetails"],
    [data.medical?.hasFoodAllergies, "medical.allergies"],
    [data.medical?.hasToiletingDifficulties, "medical.toiletingDetails"],
    [data.trainee?.shirtSize === "OTHER", "trainee.customShirtSize"],
  ] as const)
    if (condition && !String(valueAt(data, path) ?? "").trim()) add(path);
  if (
    data.medical?.hasConditions &&
    (!data.medical.conditions?.length ||
      data.medical.conditions.some((s) => !s.trim()))
  )
    add("medical.conditions");
  if (
    data.medical?.takesMedication &&
    (!data.medical.medications?.length ||
      data.medical.medications.some((m) => !m.name.trim()))
  )
    add("medical.medications");
  if (
    data.declarationVersion !== version ||
    data.declarationAcceptances?.length !== 10 ||
    data.declarationAcceptances.some((v) => !v)
  )
    add("declarationAcceptances", "יש לאשר את כל עשר ההצהרות");
  if (!local.physician && !data.medical?.physicianSummaryDocumentId)
    add("medical.physicianSummaryDocumentId", "יש לבחור סיכום רפואי");
  for (const parent of ["parent1", "parent2"] as const) {
    const signing = local[parent] || !!data.signatures?.[parent];
    if (parent === "parent1" || signing || data[parent]?.nationalId) {
      if (!validId(data[parent]?.nationalId ?? ""))
        add(`${parent}.nationalId`, "יש להזין תעודת זהות תקינה");
      if (!signing) add(`signatures.${parent}`, "יש להשלים חתימה");
      if (!data[parent]?.name?.trim()) add(`${parent}.name`);
    }
  }
  return issues;
}
