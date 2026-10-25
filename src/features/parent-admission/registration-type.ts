import type { RegistrationData } from "../parent-registration/contracts";

export type RegistrationType = "TRAINEE" | "VOLUNTEER";
export type VolunteerRegistrationData =
  import("../volunteer-registration/contracts").VolunteerData;
export type ApplicationFormData<T extends RegistrationType = "TRAINEE"> =
  T extends "TRAINEE" ? RegistrationData : VolunteerRegistrationData;

export function normalizeRegistrationType(
  value: unknown = "TRAINEE",
): RegistrationType {
  if (value !== "TRAINEE" && value !== "VOLUNTEER")
    throw new Error("Invalid registration type");
  return value;
}
export function applicationQueryScope(
  type: RegistrationType,
  applicationId: string = "entry",
) {
  return ["application", type, applicationId] as const;
}
export function canStartRegistration(
  type: RegistrationType,
  volunteerEnabled = false,
): boolean {
  // The preparation flag never activates an incomplete volunteer lifecycle.
  return type === "TRAINEE" || volunteerEnabled;
}
