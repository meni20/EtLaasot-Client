import { Alert, Paper, Stack, Typography } from "@mui/material";
import type { ApplicationDetail } from "./api";
import {
  jerusalemDate,
  needsParent,
  needsClearance,
  type VolunteerData,
} from "../volunteer-registration/contracts";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack gap={1}>
        <Typography variant="h6">{title}</Typography>
        {children}
      </Stack>
    </Paper>
  );
}
const show = (value: unknown) =>
  value === undefined || value === null || value === ""
    ? "לא צוין"
    : typeof value === "boolean"
      ? value
        ? "כן"
        : "לא"
      : String(value);
export function VolunteerApplicationDetails({
  detail,
}: {
  detail: ApplicationDetail<"VOLUNTEER">;
}) {
  const version = detail.versions[0];
  if (!version)
    return (
      <Alert severity="info">
        אין גרסה חתומה שהוגשה. טיוטת המבקש אינה מוצגת כאן.
      </Alert>
    );
  const data = version.data,
    v = data.volunteer ?? {},
    q = data.questionnaire ?? {},
    day = version.submittedAt
      ? jerusalemDate(new Date(version.submittedAt))
      : jerusalemDate();
  const signature = (
    purpose: keyof NonNullable<VolunteerData["signatures"]>,
  ) => {
    const s = data.signatures?.[purpose];
    return (
      <Typography>
        {s
          ? `חתימה שמורה · ${s.signedAt} · ${s.agreementVersion}`
          : "אין חתימה שמורה"}
      </Typography>
    );
  };
  return (
    <Stack gap={2}>
      <Typography>
        גרסה {version.versionNumber} · קריאה בלבד · הוגש:{" "}
        {show(version.submittedAt)}
      </Typography>
      <Section title="פרטים אישיים של המתנדב">
        <Stack component="dl" gap={1} sx={{ m: 0 }}>
          {Object.entries({
            "שם פרטי": v.firstName,
            "שם משפחה": v.lastName,
            "תעודת זהות": v.nationalId,
            "מספר טלפון של המתנדב": v.phone,
            מייל: v.email,
            "תאריך לידה": v.dateOfBirth,
            מין:
              v.gender === "male"
                ? "זכר"
                : v.gender === "female"
                  ? "נקבה"
                  : undefined,
            "כתובת מגורים": v.address,
            "בית ספר": v.school,
            כיתה: v.grade,
            "מידת חולצה": v.shirtSize,
            "מידת חולצה אחרת": v.customShirtSize,
            "שם אמא": v.motherName,
            "פלאפון אמא": v.motherPhone,
            "שם אב": v.fatherName,
            "פלאפון אב": v.fatherPhone,
          }).map(([label, value]) => (
            <Stack key={label} direction="row" gap={2}>
              <Typography
                component="dt"
                sx={{ minWidth: 180, fontWeight: 600 }}
              >
                {label}
              </Typography>
              <Typography
                component="dd"
                sx={{ m: 0, overflowWrap: "anywhere" }}
              >
                <bdi>{show(value)}</bdi>
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Section>
      <Section title="הסניף שנבחר">
        <Typography>
          {detail.branch?.name ?? detail.application.branchId}
        </Typography>
      </Section>
      <Section title="העדפות וניסיון">
        {Object.entries({
          "תחום התנדבות": q.preference,
          "תחום אחר": q.other,
          "גיל החניך": q.age,
          תקשורת: q.communication,
          טיפול: q.diaper,
          "ניסיון בהדרכה": q.instructionExperience,
          "פירוט ניסיון בהדרכה": q.instructionDetails,
          "ניסיון בצרכים מיוחדים": q.specialNeedsExperience,
          "פירוט ניסיון בצרכים מיוחדים": q.specialNeedsDetails,
          "סיבת ההתנדבות": q.motivation,
        }).map(([label, value]) => (
          <Typography
            key={label}
            sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
          >
            <strong>{label}: </strong>
            {show(value)}
          </Typography>
        ))}
      </Section>
      <Section title="הסכם ההתנדבות והצהרות חתומות">
        {(version.declarationSections?.agreement ?? version.declarations).map(
          (text, i) => (
            <Typography key={i} sx={{ whiteSpace: "pre-wrap" }}>
              {text}
            </Typography>
          ),
        )}
        {signature("VOLUNTEER_AGREEMENT")}
      </Section>
      {needsParent(data, day) && (
        <Section title="אישור הורים">
          <Typography>{version.declarationSections?.parental}</Typography>
          <Typography>
            {show(data.parentConsent?.name)} · תעודת זהות:{" "}
            {show(data.parentConsent?.nationalId)} · תאריך אישור:{" "}
            {show(data.parentConsent?.date)}
          </Typography>
          {signature("PARENTAL_CONSENT")}
        </Section>
      )}
      <Section title="התחייבות לשמירת סודיות">
        {version.declarationSections?.confidentiality.map((text, i) => (
          <Typography key={i}>{text}</Typography>
        ))}
        {signature("CONFIDENTIALITY")}
        <Typography>
          נוסח ההתחייבות כלול בהצהרות החתומות וב-PDF הרשמי.
        </Typography>
      </Section>
      <Section title="אישור משטרה">
        <Typography>
          {needsClearance(data, day)
            ? "נדרש אישור משטרה עבור הגרסה שהוגשה"
            : "אישור משטרה אינו נדרש עבור הגרסה שהוגשה"}
        </Typography>
        <Typography>
          {data.policeClearanceDocumentId
            ? "צורף קובץ פרטי; ניתן להורידו להלן"
            : "לא צורף קובץ"}
        </Typography>
      </Section>
    </Stack>
  );
}
