import type { ShirtSize } from "../interfaces/user.interface";

export const SHIRT_SIZE_OPTIONS: Array<{
  value: ShirtSize;
  label: string;
}> = [
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
  { value: "OTHER", label: "אחר" },
];

export const formatShirtSize = (
  shirtSize?: ShirtSize | "" | null,
  customShirtSize?: string | null,
): string => {
  if (!shirtSize) return "-";
  if (shirtSize === "OTHER") return customShirtSize?.trim() || "אחר";
  return shirtSize;
};
