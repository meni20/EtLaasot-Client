import type { ApplicationDetail } from "./api";
import {
  jerusalemDate,
  needsParent,
  needsClearance,
  volunteerIssues,
  type VolunteerData,
} from "../volunteer-registration/contracts";
export function volunteerApprovalBlockers(
  detail: ApplicationDetail<"VOLUNTEER">,
): string[] {
  const version = detail.versions[0];
  if (!version) return ["אין גרסה שהוגשה"];
  const day = version.submittedAt
    ? jerusalemDate(new Date(version.submittedAt))
    : jerusalemDate();
  const data = version.data,
    blockers: string[] = [];
  if (volunteerIssues(data, "volunteer-v1", day).length)
    blockers.push(
      "יש פרטים, אישורים או חתימות חסרים או לא תקינים בגרסה שהוגשה",
    );
  if (detail.branch?.isActive === false || detail.branch === null)
    blockers.push("הסניף אינו פעיל");
  const purposes = [
    "VOLUNTEER_AGREEMENT",
    ...(needsParent(data, day) ? ["PARENTAL_CONSENT"] : []),
    "CONFIDENTIALITY",
  ];
  for (const purpose of purposes) {
    const ref =
      data.signatures?.[
        purpose as keyof NonNullable<VolunteerData["signatures"]>
      ];
    if (
      !ref ||
      !detail.documents.some(
        (d) =>
          d.id === ref.documentId &&
          d.kind === "SIGNATURE" &&
          d.signaturePurpose === purpose &&
          d.registrationType === "VOLUNTEER" &&
          d.verifiedAt &&
          d.contentHash === ref.contentHash,
      )
    )
      blockers.push(
        `חסרה חתימה מאומתת: ${purpose === "VOLUNTEER_AGREEMENT" ? "הסכם התנדבות" : purpose === "PARENTAL_CONSENT" ? "אישור הורים" : "סודיות"}`,
      );
  }
  if (
    needsClearance(data, day) &&
    !detail.documents.some(
      (d) =>
        d.id === data.policeClearanceDocumentId &&
        d.kind === "POLICE_CLEARANCE" &&
        d.registrationType === "VOLUNTEER" &&
        d.verifiedAt,
    )
  )
    blockers.push("חסר אישור משטרה מאומת");
  if (
    !detail.documents.some(
      (d) =>
        d.kind === "REGISTRATION_PDF" &&
        d.versionId === version.id &&
        d.contentHash === version.contentHash &&
        d.registrationType === "VOLUNTEER" &&
        d.templateVersion === "volunteer-registration/v1" &&
        d.sourceChecksum ===
          "c33ecf62031f10052477478889e2ff3f4446b72e9842ba0abed7974226f8b607",
    )
  )
    blockers.push("חסר PDF רשמי של הגרסה הנוכחית");
  return blockers;
}
