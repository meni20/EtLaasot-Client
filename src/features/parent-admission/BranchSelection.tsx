import { MenuItem, TextField } from "@mui/material";

export interface BranchSelectionProps {
  branches: { id: string; name: string }[];
  value: string | null;
  onChange: (id: string) => void;
  disabled?: boolean;
  locked?: boolean;
}
export function BranchSelection({
  branches,
  value,
  onChange,
  disabled,
  locked,
}: BranchSelectionProps) {
  return (
    <TextField
      select
      fullWidth
      required
      label="סניף"
      value={value ?? ""}
      disabled={disabled || locked}
      onChange={(e) => onChange(e.target.value)}
      helperText={
        locked
          ? "שינוי סניף לאחר חתימה או הגשה נעשה מול מנהל הסניף."
          : "בחרו את הסניף שאליו נרשמים לפני החתימה."
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
