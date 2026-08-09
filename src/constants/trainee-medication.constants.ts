import type { MedicationFrequency } from "../interfaces/trainee-medication.interface";

export const MEDICATION_FREQUENCY_OPTIONS: Array<{
  value: MedicationFrequency;
  label: string;
}> = [
  { value: "ONCE_DAILY", label: "פעם ביום" },
  { value: "TWICE_DAILY", label: "פעמיים ביום" },
  { value: "THREE_TIMES_DAILY", label: "שלוש פעמים ביום" },
  { value: "FOUR_TIMES_DAILY", label: "ארבע פעמים ביום" },
  { value: "AS_NEEDED", label: "לפי צורך" },
  { value: "CUSTOM", label: "מותאם אישית" },
];

export const formatMedicationFrequency = (
  frequency?: MedicationFrequency | null,
) =>
  MEDICATION_FREQUENCY_OPTIONS.find((option) => option.value === frequency)
    ?.label ?? "";
