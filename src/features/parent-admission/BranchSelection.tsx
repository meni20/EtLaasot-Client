import { MenuItem, TextField } from "@mui/material";

export interface BranchSelectionProps {
  branches: { id: string; name: string }[];
  value: string | null;
  onChange: (id: string) => void;
  disabled?: boolean;
  locked?: boolean;
  error?: string;
}
export function BranchSelection({
  branches,
  value,
  onChange,
  disabled,
  locked,
  error,
}: BranchSelectionProps) {
  return (
    <TextField
      data-registration-field="branchId"
      name="branchId"
      select
      fullWidth
      required
      label="סניף"
      value={value ?? ""}
      disabled={disabled || locked}
      error={!!error}
      onChange={(e) => onChange(e.target.value)}
      helperText={
        error ||
        (locked
          ? "שינוי סניף לאחר חתימה או הגשה נעשה מול מנהל הסניף."
          : "בחרו את הסניף שאליו נרשמים לפני החתימה.")
      }
    >
      <MenuItem value="" disabled>
        בחירת סניף
      </MenuItem>
      {value && !branches.some((b) => b.id === value) && (
        <MenuItem value={value} disabled>
          הסניף שנבחר אינו פעיל
        </MenuItem>
      )}
      {branches.map((b) => (
        <MenuItem key={b.id} value={b.id}>
          {b.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
