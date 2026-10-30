import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { Field, YesNo, type FieldProps } from "./Fields";
import { SignaturePad, type CompletedSignature } from "./SignaturePad";
import { parentLetter } from "./legal";
import { useState } from "react";

const grid = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0,1fr)", sm: "repeat(2,minmax(0,1fr))" },
  gap: 4,
};
export function ParentLetter() {
  return (
    <Stack gap={4} sx={{ lineHeight: 1.8 }}>
      <Typography variant="h5" component="h2">
        {parentLetter.letterTitle}
      </Typography>
      {parentLetter.letter.map((text) => (
        <Typography key={text} sx={{ lineHeight: 1.85 }}>
          {text}
        </Typography>
      ))}
      <Typography fontWeight={700}>הבהרה חשובה:</Typography>
      <Box component="ol" sx={{ m: 0, paddingInlineStart: 6 }}>
        {parentLetter.clarifications.map((text) => (
          <li key={text}>
            <Typography sx={{ lineHeight: 1.85, mb: 2 }}>{text}</Typography>
          </li>
        ))}
      </Box>
      <Typography>{parentLetter.letterContact}</Typography>
      <Typography>{parentLetter.attachmentLabel}</Typography>
      <Alert severity="info">{parentLetter.medicalRequirement}</Alert>
    </Stack>
  );
}
export function IdentityStage(props: FieldProps & { profileName?: string }) {
  return (
    <Stack gap={4}>
      {props.profileName && (
        <Alert severity="info">
          השם בפרופיל: {props.profileName}. יש למלא שם פרטי ושם משפחה בנפרד; השם
          לא פוצל אוטומטית.
        </Alert>
      )}
      <Box sx={grid}>
        <Field {...props} path="trainee.name" label="שם פרטי" required />
        <Field {...props} path="trainee.familyName" label="שם משפחה" required />
        <Field
          {...props}
          path="trainee.nationalId"
          label="תעודת זהות של החניך/ה"
          required
        />
        <Field {...props} path="trainee.nickname" label="כינוי" />
        <Field
          {...props}
          path="trainee.dateOfBirth"
          label="תאריך לידה"
          type="date"
          required
        />
        <Field
          {...props}
          path="trainee.gender"
          label="מין"
          options={["male", "female"]}
          required
        />
        <Field
          {...props}
          path="trainee.phone"
          label="טלפון החניך/ה"
          type="tel"
          required
        />
        <Field
          {...props}
          path="trainee.email"
          label="דואר אלקטרוני"
          type="email"
        />
        <Field {...props} path="trainee.address" label="כתובת" required />
        <Field
          {...props}
          path="trainee.healthFund"
          label="קופת חולים"
          required
        />
        <Field
          {...props}
          path="trainee.shirtSize"
          label="מידת חולצה"
          options={["XS", "S", "M", "L", "XL", "XXL", "OTHER"]}
          required
        />
        {props.data.trainee?.shirtSize === "OTHER" && (
          <Field
            {...props}
            path="trainee.customShirtSize"
            label="פירוט מידת חולצה"
            required
          />
        )}
        <Field
          {...props}
          path="trainee.pantsSize"
          label="מידת מכנסיים"
          required
        />
        <Field
          {...props}
          path="trainee.siblings"
          label="מספר אחים במשפחה"
          type="number"
          change={(path, value) => {
            if (value === "") {
              props.change(path, undefined);
              return;
            }
            const number = Number(value);
            if (Number.isInteger(number) && number >= 0 && number <= 50)
              props.change(path, number);
          }}
        />
      </Box>
    </Stack>
  );
}
export function ContactsStage(props: FieldProps) {
  return (
    <Stack gap={5}>
      {(["parent1", "parent2"] as const).map((parent, index) => (
        <Stack key={parent} gap={4}>
          <Typography component="h3" variant="h6">
            הורה {index + 1} —{" "}
            {index === 0
              ? "פרטי האב / ההורה הראשי"
              : "פרטי האם / ההורה הנוסף (רשות)"}
          </Typography>
          <Box sx={grid}>
            <Field
              {...props}
              path={`${parent}.name`}
              label={`שם הורה ${index + 1}`}
              required={index === 0}
            />
            <Field
              {...props}
              path={`${parent}.phone`}
              label={`טלפון הורה ${index + 1}`}
              type="tel"
              required={index === 0}
            />
            <Field {...props} path={`${parent}.occupation`} label="עיסוק" />
            <Field
              {...props}
              path={`${parent}.dateOfBirth`}
              label="תאריך לידת ההורה"
              type="date"
            />
            <Field
              {...props}
              path={`${parent}.email`}
              label="דואר אלקטרוני של ההורה"
              type="email"
            />
          </Box>
          <Divider />
        </Stack>
      ))}
      <Typography component="h3" variant="h6">
        קשר בשעת חירום ומסגרת חינוכית
      </Typography>
      <Box sx={grid}>
        <Field
          {...props}
          path="contacts.familyStatus"
          label="מצב משפחתי של ההורים"
          required
        />
        <Field
          {...props}
          path="contacts.emergencyName"
          label="איש קשר לשעת חירום"
          required
        />
        <Field
          {...props}
          path="contacts.emergencyRelationship"
          label="קרבה לחניך/ה"
          required
        />
        <Field
          {...props}
          path="contacts.emergencyPhone"
          label="טלפון לשעת חירום"
          type="tel"
          required
        />
        <Field
          {...props}
          path="trainee.school"
          label="בית ספר / מסגרת חינוכית"
          required
        />
        <Field
          {...props}
          path="contacts.schoolPhone"
          label="טלפון בית הספר"
          type="tel"
        />
        <Field
          {...props}
          path="contacts.schoolCounselor"
          label="יועץ/ת או עו״ס המסגרת"
        />
        <Field
          {...props}
          path="contacts.schoolCounselorPhone"
          label="טלפון היועץ/ת"
          type="tel"
        />
      </Box>
    </Stack>
  );
}
export function MedicalStage(props: FieldProps) {
  const medical = props.data.medical;
  return (
    <Stack gap={5}>
      <Alert severity="info">
        המידע נשמר בטופס הרישום בלבד. הוא אינו משנה את רשימת התרופות או המידע
        הרפואי המאושר בפרופיל.
      </Alert>
      <YesNo
        {...props}
        path="medical.hasConditions"
        label="האם יש מגבלה בריאותית, מחלה פעילה או אבחנות?"
        clearPaths={[{ path: "medical.conditions", value: [] }]}
      />
      {medical?.hasConditions && (
        <Field
          {...props}
          path="medical.conditions"
          label="מצבים רפואיים ואבחנות (שורה לכל מצב)"
          multiline
          required
          displayValue={medical.conditions?.join("\n") ?? ""}
          change={(_, value) =>
            props.change(
              "medical.conditions",
              String(value).split("\n").slice(0, 30),
            )
          }
        />
      )}
      {medical?.hasConditions && (
        <Box sx={{ mt: -4 }}>
          <Typography variant="body2" color="text.secondary">
            {medical.conditions?.filter(Boolean).join(" • ")}
          </Typography>
        </Box>
      )}
      <YesNo
        {...props}
        path="medical.participationRestricted"
        label="האם קיימת מגבלה על השתתפות מלאה או חלקית בפעילות?"
      />
      {medical?.participationRestricted && (
        <Field
          {...props}
          path="medical.restrictionDetails"
          label="פירוט מגבלות השתתפות"
          multiline
          required
        />
      )}
      <YesNo
        {...props}
        path="medical.takesMedication"
        label="האם נוטלים תרופות?"
        clearPaths={[{ path: "medical.medications", value: [] }]}
      />
      {medical?.takesMedication && (
        <Stack gap={4}>
          {(medical.medications ?? []).map((medication, index) => (
            <Box
              key={index}
              sx={{ ...grid, p: 4, bgcolor: "#F7F1F5", borderRadius: 3 }}
            >
              {(["name", "dosage", "frequency", "instructions"] as const).map(
                (key, i) => (
                  <Field
                    {...props}
                    key={key}
                    path={`medical.medications.${index}.${key}`}
                    label={["שם התרופה", "מינון", "תדירות", "הנחיות"][i]}
                    required={key === "name"}
                    change={(_, value) =>
                      props.change(
                        "medical.medications",
                        medical.medications?.map((m, j) =>
                          j === index
                            ? { ...medication, [key]: String(value) }
                            : m,
                        ),
                      )
                    }
                  />
                ),
              )}
              <Button
                disabled={props.disabled}
                onClick={() =>
                  props.change(
                    "medical.medications",
                    medical.medications?.filter((_, j) => j !== index),
                  )
                }
              >
                הסרת תרופה
              </Button>
            </Box>
          ))}
          <Button
            variant="outlined"
            disabled={
              props.disabled || (medical.medications?.length ?? 0) >= 30
            }
            onClick={() =>
              props.change("medical.medications", [
                ...(medical.medications ?? []),
                { name: "" },
              ])
            }
          >
            הוספת תרופה
          </Button>
        </Stack>
      )}
      <YesNo
        {...props}
        path="medical.hasFoodAllergies"
        label="האם קיימת רגישות למזון?"
        clearPaths={[{ path: "medical.allergies", value: "" }]}
      />
      {medical?.hasFoodAllergies && (
        <Field
          {...props}
          path="medical.allergies"
          label="פירוט אלרגיות והנחיות"
          required
          multiline
        />
      )}
      <YesNo
        {...props}
        path="medical.eatsIndependently"
        label="האם אוכל/ת באופן עצמאי?"
      />
      <YesNo
        {...props}
        path="medical.hasToiletingDifficulties"
        label="האם יש קשיים בשירותים?"
      />
      {medical?.hasToiletingDifficulties && (
        <Field
          {...props}
          path="medical.toiletingDetails"
          label="פירוט קשיים בשירותים"
          required
          multiline
        />
      )}
      <YesNo
        {...props}
        path="medical.usesDiapers"
        label="האם משתמש/ת בטיטולים?"
      />
      <Field
        {...props}
        path="development.level"
        label="מצב התפתחותי"
        required
        options={[
          "מתאים לגיל הכרונולוגי",
          "לא מתאים לגיל הכרונולוגי",
          "מש״ה קל",
          "מש״ה בינוני",
          "מש״ה קשה",
          "אוטיזם / PDD",
          "בעיות קשב וריכוז",
          "אחר",
        ]}
      />
      <Field
        {...props}
        path="development.details"
        label="פירוט התפתחות, ניידות ועזרה באכילה"
        multiline
      />
      <Typography variant="body2" color="text.secondary">
        פרטו כאן גם עזרה בניידות ובאכילה.
      </Typography>
      <Typography variant="h6" component="h3">
        הרופא/ה המטפל/ת
      </Typography>
      <Box sx={grid}>
        <Field
          {...props}
          path="medical.physicianName"
          label="שם הרופא/ה"
          required
        />
        <Field
          {...props}
          path="medical.physicianHealthFund"
          label="קופת חולים של הרופא/ה"
          required
        />
        <Field
          {...props}
          path="medical.physicianPhone"
          label="טלפון הרופא/ה"
          type="tel"
          required
        />
      </Box>
    </Stack>
  );
}
export function DeclarationsStage(
  props: FieldProps & { declarations: string[]; version: string },
) {
  const accepted = props.data.declarationAcceptances ?? [];
  return (
    <Stack gap={3}>
      <Typography color="text.secondary">
        קראו ואשרו כל הצהרה בנפרד. שינוי באישור מבטל חתימות קודמות.
      </Typography>
      {props.declarations.map((text, index) => (
        <Box
          key={text}
          sx={{
            p: 4,
            border: "1px solid #D9BFD2",
            borderRadius: 3,
            bgcolor: accepted[index] ? "#F7F1F5" : "white",
          }}
        >
          <Typography sx={{ lineHeight: 1.85 }}>
            <Box component="b" sx={{ color: "#7A3E6B", mr: 1 }}>
              {index + 1}.
            </Box>{" "}
            <span>{text}</span>
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                disabled={props.disabled}
                checked={accepted[index] ?? false}
                onChange={(_, checked) => {
                  props.change("declarationVersion", props.version);
                  props.change(
                    "declarationAcceptances",
                    Array.from({ length: 10 }, (_, i) =>
                      i === index ? checked : (accepted[i] ?? false),
                    ),
                  );
                }}
              />
            }
            label={`קראתי ואני מאשר/ת הצהרה ${index + 1}`}
          />
        </Box>
      ))}
      {props.issues.some((i) => i.path === "declarationAcceptances") && (
        <Alert severity="error">יש לאשר את כל עשר ההצהרות</Alert>
      )}
    </Stack>
  );
}
export function SigningStage(
  props: FieldProps & {
    live?: boolean;
    file?: File;
    onFile: (file?: File) => void;
    signatures: { parent1?: CompletedSignature; parent2?: CompletedSignature };
    onSignature: (
      parent: "parent1" | "parent2",
      value?: CompletedSignature,
    ) => void;
    generation: number;
  },
) {
  const [fileError, setFileError] = useState("");
  return (
    <Stack gap={5}>
      <Alert severity={props.live ? "info" : "warning"}>
        {props.live
          ? "הקבצים והחתימות יישמרו באחסון פרטי בעת השליחה. שינוי פרטי הטופס מבטל חתימות קודמות."
          : "הדגמה בלבד: הקבצים והחתימות נשארים בזיכרון ולא מועלים."}
      </Alert>
      <Typography variant="h6" component="h3">
        סיכום רפואי עדכני
      </Typography>
      <Typography>{parentLetter.medicalRequirement}</Typography>
      <Button component="label" variant="outlined" disabled={props.disabled}>
        בחירת סיכום רפואי
        <input
          hidden
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          aria-label="בחירת סיכום רפואי"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (
              file &&
              (!["application/pdf", "image/png", "image/jpeg"].includes(
                file.type,
              ) ||
                file.size === 0 ||
                file.size > 10 * 1024 * 1024)
            ) {
              setFileError("יש לבחור PDF, PNG או JPEG בגודל עד 10MB");
              event.target.value = "";
              return;
            }
            setFileError("");
            props.onFile(file);
          }}
        />
      </Button>
      {fileError && <Alert severity="error">{fileError}</Alert>}
      {props.file && (
        <Alert severity="info">
          {props.live ? "נבחר:" : "נבחר בזיכרון בלבד:"} {props.file.name} (
          {Math.ceil(props.file.size / 1024)} KB).{" "}
          {props.live ? "יועלה בעת השליחה." : "הקובץ לא הועלה."}
          <Button onClick={() => props.onFile(undefined)}>הסרה</Button>
        </Alert>
      )}
      {(["parent1", "parent2"] as const).map((parent, index) => (
        <Stack
          gap={4}
          key={parent}
          sx={{ border: "1px solid #D9BFD2", p: 4, borderRadius: 3 }}
        >
          <Typography variant="h6" component="h3">
            הורה {index + 1} —{" "}
            {index === 0 ? "חתימה חובה" : "חתימה נוספת (רשות)"}
          </Typography>
          <Field
            {...props}
            path={`${parent}.nationalId`}
            label={`תעודת זהות הורה ${index + 1}`}
            required={index === 0 || !!props.signatures.parent2}
          />
          {index === 1 && (
            <Typography variant="body2">
              חתימה נוספת דורשת גם שם ותעודת זהות נפרדים של הורה 2. אפשר להשאיר
              את שניהם ריקים.
            </Typography>
          )}
          {!props.disabled && (
            <SignaturePad
              key={props.generation}
              label={`הורה ${index + 1}`}
              value={props.signatures[parent]}
              onChange={(value) => props.onSignature(parent, value)}
            />
          )}
          {props.issues.some((i) => i.path === `signatures.${parent}`) && (
            <Alert severity="error">יש להשלים חתימה</Alert>
          )}
        </Stack>
      ))}
    </Stack>
  );
}
