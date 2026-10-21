import {
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
} from "@mui/material";
import type { RegistrationData } from "./contracts";
import { valueAt, type FieldIssue } from "./model";

export interface FieldProps {
  data: RegistrationData;
  change: (path: string, value: unknown) => void;
  issues: FieldIssue[];
  disabled?: boolean;
}
export function Field({
  path,
  label,
  required,
  type = "text",
  options,
  multiline,
  displayValue,
  ...props
}: FieldProps & {
  path: string;
  label: string;
  required?: boolean;
  type?: string;
  options?: readonly string[];
  multiline?: boolean;
  displayValue?: string;
}) {
  const error = props.issues.find((i) => i.path === path);
  const value = valueAt(props.data, path);
  const maxLength = /nationalId/.test(path)
    ? 9
    : /name|familyName/.test(path)
      ? 100
      : /address/.test(path)
        ? 255
        : /customShirt/.test(path)
          ? 50
          : multiline
            ? 2000
            : 300;
  return (
    <TextField
      fullWidth
      size="small"
      name={path}
      label={label}
      required={required}
      type={type}
      value={displayValue ?? value ?? ""}
      disabled={props.disabled}
      select={!!options}
      multiline={multiline}
      minRows={multiline ? 3 : undefined}
      onChange={(e) => props.change(path, e.target.value)}
      error={!!error}
      helperText={error?.message}
      slotProps={{
        htmlInput: {
          maxLength,
          inputMode: /nationalId|Phone|phone/.test(path) ? "tel" : undefined,
        },
        inputLabel: type === "date" ? { shrink: true } : undefined,
      }}
    >
      {options?.map((option) => (
        <MenuItem key={option} value={option}>
          {option === "male"
            ? "זכר"
            : option === "female"
              ? "נקבה"
              : option === "OTHER"
                ? "אחר"
                : option}
        </MenuItem>
      ))}
    </TextField>
  );
}
export function YesNo({
  path,
  label,
  clearPaths = [],
  ...props
}: FieldProps & {
  path: string;
  label: string;
  clearPaths?: { path: string; value: unknown }[];
}) {
  const error = props.issues.find((i) => i.path === path);
  return (
    <FormControl error={!!error} disabled={props.disabled}>
      <FormLabel sx={{ color: "#303050", lineHeight: 1.6 }}>
        {label} *
      </FormLabel>
      <RadioGroup
        row
        aria-label={label}
        value={
          valueAt(props.data, path) === undefined
            ? ""
            : String(valueAt(props.data, path))
        }
        onChange={(_, value) => {
          props.change(path, value === "true");
          if (value === "false")
            clearPaths.forEach((item) => props.change(item.path, item.value));
        }}
      >
        <FormControlLabel value="true" control={<Radio />} label="כן" />
        <FormControlLabel value="false" control={<Radio />} label="לא" />
      </RadioGroup>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
}
