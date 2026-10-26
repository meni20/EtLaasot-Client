import { useReloadGuard } from "../../hooks/useReloadGuard";
import { useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { Field, YesNo } from "../parent-registration/Fields";
import {
  SignaturePad,
  type CompletedSignature,
} from "../parent-registration/SignaturePad";
import { useDraft } from "../parent-registration/useDraft";
import { RegistrationError } from "../parent-registration/api";
import {
  type ApplicantClient,
  type ApplicationSnapshot,
} from "../parent-admission/api";
import {
  normalizeRegistrationType,
  type RegistrationType,
} from "../parent-admission/registration-type";
import {
  canonical,
  coveredData,
  jerusalemDate,
  needsParent,
  needsClearance,
  volunteerIssues,
  VOLUNTEER_PURPOSES,
  type VolunteerData,
  type VolunteerPurpose,
  type VolunteerIssue,
} from "./contracts";
import { volunteerSetField } from "./model";

const stages = [
  "פרטים אישיים",
  "שאלון העדפות",
  "הסכם התנדבות",
  "אישור הורים",
  "סודיות ושליחה",
];
const signatureLabels: Record<VolunteerPurpose, string> = {
  VOLUNTEER_AGREEMENT: "חתימת המתנדב/ת על הסכם ההתנדבות",
  PARENTAL_CONSENT: "חתימת ההורה",
  CONFIDENTIALITY: "חתימת המתנדב/ת על התחייבות הסודיות",
};
export function VolunteerRegistration({
  client,
  initial,
  onSubmitted,
  onReload,
}: {
  client: ApplicantClient<RegistrationType>;
  initial: ApplicationSnapshot<"VOLUNTEER">;
  onSubmitted: () => void;
  onReload?: () => void;
}) {
  const transport = useMemo(
    () => ({
      save: async (input: {
        data: VolunteerData;
        revision: number;
        currentStep: number;
      }) => {
        const result = await client.save(input);
        if (
          normalizeRegistrationType(result.application.registrationType) !==
          "VOLUNTEER"
        )
          throw new RegistrationError(409);
        return {
          data: result.data as VolunteerData,
          form: { revision: result.application.revision },
        };
      },
    }),
    [client],
  );
  const draft = useDraft<VolunteerData>(
    transport,
    { data: initial.data, form: initial.application },
    {},
    false,
    { setField: volunteerSetField },
  );
  const [issues, setIssues] = useState<VolunteerIssue[]>([]),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const [inks, setInks] = useState<
    Partial<Record<VolunteerPurpose, CompletedSignature>>
  >({});
  useReloadGuard(busy || Object.values(inks).some(Boolean), "יש להשלים את שמירת החתימות והמסמכים לפני העדכון.");
  const working = useRef(false),
    idempotency = useRef<{ revision: number; key: string } | undefined>(
      undefined,
    );
  const data = draft.data,
    version = initial.declarationVersion,
    legal = initial.legal;
  const disabled =
    busy ||
    draft.saveState === "conflict" ||
    initial.application.status === "PENDING_REVIEW";
  const change = (path: string, value: unknown) => {
    const before = draft.current().data,
      next = volunteerSetField(before, path, value);
    setInks((current) => {
      const copy = { ...current };
      for (const purpose of VOLUNTEER_PURPOSES)
        if (
          canonical(coveredData(before, purpose, version)) !==
          canonical(coveredData(next, purpose, version))
        )
          delete copy[purpose];
      return copy;
    });
    draft.change(path, value);
    setIssues([]);
    setMessage("");
  };
  const run = async (work: () => Promise<void>) => {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    setMessage("");
    try {
      await work();
    } catch (error) {
      setMessage(error instanceof Error && /[\u0590-\u05ff]/.test(error.message) ? error.message : "הפעולה לא הושלמה. נסו שוב.");
    } finally {
      working.current = false;
      setBusy(false);
    }
  };
  const sign = (purpose: VolunteerPurpose) =>
    run(async () => {
      if (!inks[purpose] || !client.upload)
        throw new Error("לא ניתן להשלים את החתימה כרגע. בדקו שחתמתם ונסו שוב.");
      if (!(await draft.flush())) return;
      const current = draft.current();
      const blob = new Blob(
        [
          Uint8Array.from(atob(inks[purpose]!.image.split(",")[1]), (c) =>
            c.charCodeAt(0),
          ),
        ],
        { type: "image/png" },
      );
      const result = await client.upload({
        kind: "SIGNATURE",
        file: blob,
        revision: current.revision,
        signer: purpose,
      });
      const next = volunteerSetField(current.data, `signatures.${purpose}`, {
        documentId: result.documentId,
        contentHash: result.contentHash,
        signedAt: result.signedAt,
        agreementVersion: result.agreementVersion,
      });
      const saved = await transport.save({
        data: next,
        revision: current.revision,
        currentStep: draft.step,
      });
      draft.accept(saved);
      setInks((current) => ({ ...current, [purpose]: undefined }));
    });
  const uploadClearance = (file: File) =>
    run(async () => {
      if (
        file.size > 10 * 1024 * 1024 ||
        !["application/pdf", "image/png", "image/jpeg"].includes(file.type)
      )
        throw new Error("יש לבחור PDF, PNG או JPEG עד 10 MB");
      if (!client.upload || !(await draft.flush())) return;
      const result = await client.upload({
        kind: "POLICE_CLEARANCE",
        file,
        revision: draft.current().revision,
      });
      change("policeClearanceDocumentId", result.documentId);
      await draft.flush();
    });
  const submit = () =>
    run(async () => {
      if (!(await draft.flush())) return;
      const current = draft.current();
      const found = volunteerIssues(current.data, version);
      setIssues(found);
      if (found.length) {
        draft.navigate(found[0].stage);
        return;
      }
      if (
        !idempotency.current ||
        idempotency.current.revision !== current.revision
      )
        idempotency.current = {
          revision: current.revision,
          key: crypto.randomUUID(),
        };
      await client.submit({
        revision: current.revision,
        idempotencyKey: idempotency.current.key,
      });
      onSubmitted();
    });
  if (!legal)
    return (
      <Alert severity="error">
        נוסח ההסכמים המקורי לא התקבל. לא ניתן להמשיך.
      </Alert>
    );
  const props = { data, change, issues, disabled };
  const field = (
    path: string,
    label: string,
    options?: readonly string[],
    type = "text",
    required = true,
  ) => (
    <Field
      key={path}
      {...props}
      path={path}
      label={label}
      options={options}
      type={type}
      required={required}
    />
  );
  const ack = (path: string, label: string, checked: boolean) => (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          disabled={disabled}
          onChange={(_, value) => change(path, value)}
        />
      }
      label={label}
    />
  );
  const paragraphs = (lines: readonly string[]) =>
    lines.map((line, index) => (
      <Typography key={index} sx={{ whiteSpace: "pre-wrap", lineHeight: 1.9 }}>
        {line}
      </Typography>
    ));
  const signature = (purpose: VolunteerPurpose) => (
    <Stack gap={2} data-testid={`signature-${purpose}`}>
      {data.signatures?.[purpose] ? (
        <>
          <Chip label="חתימה שמורה" />
          <Typography>
            {new Date(data.signatures[purpose]!.signedAt).toLocaleString(
              "he-IL",
            )}
          </Typography>
          <Button
            disabled={disabled}
            onClick={() => change(`signatures.${purpose}`, undefined)}
          >
            חתימה חדשה
          </Button>
        </>
      ) : (
        <>
          <Box sx={{ pointerEvents: disabled ? "none" : undefined }}>
            <SignaturePad
              label={signatureLabels[purpose]}
              value={inks[purpose]}
              onChange={(value) => {
                if (!disabled)
                  setInks((current) => ({ ...current, [purpose]: value }));
              }}
            />
          </Box>
          <Button
            disabled={
              disabled || !inks[purpose] || initial.integration !== "READY"
            }
            onClick={() => void sign(purpose)}
          >
            שמירת חתימה
          </Button>
        </>
      )}
      {issues.some((i) => i.path === `signatures.${purpose}`) && (
        <Alert severity="error">יש להשלים חתימה</Alert>
      )}
    </Stack>
  );
  return (
    <Stack dir="rtl" gap={4} sx={{ minWidth: 0, width: "100%" }}>
      <Typography component="h2" variant="h5">
        הרשמה למתנדב/ת
      </Typography>
      <Stack
        direction="row"
        useFlexGap
        flexWrap="wrap"
        gap={1}
        aria-label="שלבי הרשמה"
      >
        {stages.map((name, index) => (
          <Button
            key={name}
            disabled={busy}
            aria-current={draft.step === index + 1 ? "step" : undefined}
            variant={draft.step === index + 1 ? "contained" : "outlined"}
            onClick={() => draft.navigate(index + 1)}
          >
            {index + 1}. {name}
          </Button>
        ))}
      </Stack>
      <Typography role="status">
        {
          {
            saved: "כל השינויים נשמרו",
            dirty: "ממתין לשמירה…",
            saving: "שומר…",
            error: "השמירה נכשלה",
            conflict: "קיימת גרסה חדשה יותר",
          }[draft.saveState]
        }
      </Typography>
      {draft.saveState === "error" && (
        <Button onClick={draft.retry}>ניסיון שמירה נוסף</Button>
      )}
      {draft.saveState === "conflict" && (
        <Alert
          severity="warning"
          action={
            <Button
              onClick={() => {
                if (
                  window.confirm("טעינה מחדש תחליף שינויים שלא נשמרו. להמשיך?")
                )
                  onReload?.();
              }}
            >
              טעינה מחדש
            </Button>
          }
        >
          העריכה נעצרה כדי למנוע דריסת נתונים.
        </Alert>
      )}
      {message && <Alert severity="error">{message}</Alert>}
      {initial.integration !== "READY" && (
        <Alert severity="warning">
          אפשר לשמור טיוטה. חתימה ושליחה אינן זמינות כרגע.
        </Alert>
      )}
      <Typography component="h3" variant="h6">
        {stages[draft.step - 1]}
      </Typography>
      {draft.step === 1 && (
        <Stack gap={3}>
          {field("volunteer.firstName", "שם פרטי")}
          {field("volunteer.lastName", "שם משפחה")}
          <Field
            {...props}
            path="volunteer.nationalId"
            label="תעודת זהות"
            disabled
          />
          {field("volunteer.dateOfBirth", "תאריך לידה", undefined, "date")}
          {field("volunteer.gender", "מין", ["male", "female"])}
          {field("volunteer.address", "כתובת מגורים")}
          {field(
            "volunteer.school",
            "בית ספר",
            undefined,
            "text",
            needsParent(data),
          )}
          {field(
            "volunteer.grade",
            "כיתה",
            undefined,
            "text",
            needsParent(data),
          )}
          {field("volunteer.email", "מייל", undefined, "email")}
          {field("volunteer.phone", "מספר טלפון של המתנדב", undefined, "tel")}
          {field("volunteer.shirtSize", "מידת חולצה", [
            "XS",
            "S",
            "M",
            "L",
            "XL",
            "XXL",
            "OTHER",
          ])}
          {data.volunteer?.shirtSize === "OTHER" &&
            field("volunteer.customShirtSize", "מידת חולצה אחרת")}
          {field("volunteer.motherName", "שם אמא")}
          {field("volunteer.motherPhone", "פלאפון אמא")}
          {field("volunteer.fatherName", "שם אב")}
          {field("volunteer.fatherPhone", "פלאפון אב")}
        </Stack>
      )}
      {draft.step === 2 && (
        <Stack gap={3}>
          {field(
            "questionnaire.preference",
            "מעוניין להתנדב במשחקייה/חונכות בית/אחר",
            ["משחקייה", "חונכות בית", "אחר"],
          )}
          {data.questionnaire?.preference === "אחר" &&
            field("questionnaire.other", "אחר — פירוט")}
          <Typography>
            איזה גיל ורמה תפקודית של חניך נראים לך כמתאימים לך יותר:
          </Typography>
          {field("questionnaire.age", "קטן/בוגר", ["קטן", "בוגר"])}
          {field("questionnaire.communication", "מדבר/לא מתקשר", [
            "מדבר",
            "לא מתקשר",
          ])}
          {field("questionnaire.diaper", "עם טיטול/ללא טיטול", [
            "עם טיטול",
            "ללא טיטול",
          ])}
          <YesNo
            {...props}
            path="questionnaire.instructionExperience"
            label="1. האם יש לך ניסיון בהדרכה כלשהי? אם כן, אנא פרט/י"
          />
          {data.questionnaire?.instructionExperience && (
            <Field
              {...props}
              path="questionnaire.instructionDetails"
              label="פירוט ניסיון בהדרכה"
              multiline
              required
            />
          )}
          <YesNo
            {...props}
            path="questionnaire.specialNeedsExperience"
            label="2. האם יש לך ניסיון קודם עם ילדים בעלי צרכים מיוחדים? אם כן, אנא פרט/י"
          />
          {data.questionnaire?.specialNeedsExperience && (
            <Field
              {...props}
              path="questionnaire.specialNeedsDetails"
              label="פירוט ניסיון עם ילדים בעלי צרכים מיוחדים"
              multiline
              required
            />
          )}
          <Field
            {...props}
            path="questionnaire.motivation"
            label="4. מה הביא אותך לרצות להתנדב בעמותת עת לעשות?"
            multiline
            required
          />
        </Stack>
      )}
      {draft.step === 3 && (
        <Stack gap={3}>
          {paragraphs(legal.agreement)}
          {ack(
            "agreements.volunteer",
            "קראתי ואני מאשר/ת את הסכם ההתנדבות",
            data.agreements?.volunteer === true,
          )}
          {signature("VOLUNTEER_AGREEMENT")}
        </Stack>
      )}
      {draft.step === 4 &&
        (!data.volunteer?.dateOfBirth ? (
          <Alert severity="info">
            יש להשלים תאריך לידה לפני בדיקת הצורך באישור הורים.
          </Alert>
        ) : needsParent(data) ? (
          <Stack gap={3}>
            <Typography>{legal.parental}</Typography>
            <Typography>
              שם הבן/הבת: {data.volunteer?.firstName} {data.volunteer?.lastName}
            </Typography>
            {field("parentConsent.name", "שם ההורה")}
            {field("parentConsent.nationalId", "תעודת זהות ההורה")}
            {field(
              "parentConsent.date",
              "תאריך אישור ההורה",
              undefined,
              "date",
            )}
            {ack(
              "parentConsent.acknowledged",
              "אני ההורה מאשר/ת את ההשתתפות כמפורט בנוסח",
              data.parentConsent?.acknowledged === true,
            )}
            {signature("PARENTAL_CONSENT")}
          </Stack>
        ) : (
          <Alert severity="info">
            אישור הורים אינו נדרש למועמד/ת בגיל 18 ומעלה.
          </Alert>
        ))}
      {draft.step === 5 && (
        <Stack gap={3}>
          {paragraphs(legal.confidentiality)}
          <Typography>
            החותם/ת: {data.volunteer?.firstName} {data.volunteer?.lastName} ·
            ת.ז. {data.volunteer?.nationalId} · תאריך:{" "}
            {data.signatures?.CONFIDENTIALITY
              ? jerusalemDate(
                  new Date(data.signatures.CONFIDENTIALITY.signedAt),
                )
              : jerusalemDate()}
          </Typography>
          {ack(
            "agreements.confidentiality",
            "קראתי ואני מאשר/ת את ההתחייבות לשמירת סודיות",
            data.agreements?.confidentiality === true,
          )}
          <Typography>{legal.clearance}</Typography>
          {needsClearance(data) ? (
            <>
              <Button
                component="label"
                disabled={disabled || initial.integration !== "READY"}
              >
                צירוף אישור משטרה
                <input
                  hidden
                  type="file"
                  accept="application/pdf,image/png,image/jpeg"
                  aria-label="אישור משטרה"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) void uploadClearance(file);
                  }}
                />
              </Button>
              {data.policeClearanceDocumentId && (
                <Chip label="קובץ נשמר באחסון פרטי" />
              )}
              <Typography>
                PDF, PNG או JPEG עד 10 MB. בדיקת תוכן הקובץ אינה אימות אמיתות
                האישור.
              </Typography>
            </>
          ) : (
            <Typography>
              אישור משטרה אינו נדרש לפי הפרטים שהוזנו והנוסח המקורי.
            </Typography>
          )}
          {signature("CONFIDENTIALITY")}
          {issues
            .filter((i) => i.stage === 5)
            .map((i) => (
              <Alert key={i.path} severity="error">
                {i.message}
              </Alert>
            ))}
          <Button
            variant="contained"
            disabled={disabled || initial.integration !== "READY"}
            onClick={() => void submit()}
          >
            שליחת בקשת התנדבות
          </Button>
        </Stack>
      )}
      <Stack direction="row" gap={2}>
        <Button
          disabled={busy || draft.step === 1}
          onClick={() => draft.navigate(draft.step - 1)}
        >
          הקודם
        </Button>
        <Button
          disabled={busy || draft.step === 5}
          onClick={() => draft.navigate(draft.step + 1)}
        >
          הבא
        </Button>
      </Stack>
    </Stack>
  );
}
