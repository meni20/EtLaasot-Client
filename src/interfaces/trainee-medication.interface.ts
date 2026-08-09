export type MedicationFrequency =
  | "ONCE_DAILY"
  | "TWICE_DAILY"
  | "THREE_TIMES_DAILY"
  | "FOUR_TIMES_DAILY"
  | "AS_NEEDED"
  | "CUSTOM";

export interface ITraineeMedication {
  id: string;
  traineeUuid: string;
  medicationName: string;
  dosage?: string | null;
  frequency?: MedicationFrequency | null;
  schedule?: string | null;
  instructions?: string | null;
  notes?: string | null;
  isActive: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ITraineeMedicationPayload {
  medicationName: string;
  dosage?: string | null;
  frequency?: MedicationFrequency | null;
  schedule?: string | null;
  instructions?: string | null;
  notes?: string | null;
}
