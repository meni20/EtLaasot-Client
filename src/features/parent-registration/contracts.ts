// Mirrors the implemented Phase 2 DTOs; no storage paths or upload API are assumed.
export type Person = {
  name?: string;
  nationalId?: string;
  phone?: string;
  email?: string;
  occupation?: string;
  dateOfBirth?: string;
};
export type Signature = {
  documentId: string;
  contentHash: string;
  signedAt: string;
};
export interface RegistrationData {
  trainee?: Person & {
    familyName?: string;
    nickname?: string;
    address?: string;
    gender?: "male" | "female";
    healthFund?: string;
    siblings?: number;
    school?: string;
    shirtSize?: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "OTHER";
    customShirtSize?: string;
    pantsSize?: string;
  };
  parent1?: Person;
  parent2?: Person;
  contacts?: {
    familyStatus?: string;
    emergencyName?: string;
    emergencyRelationship?: string;
    emergencyPhone?: string;
    schoolPhone?: string;
    schoolCounselor?: string;
    schoolCounselorPhone?: string;
  };
  medical?: {
    hasConditions?: boolean;
    conditions?: string[];
    participationRestricted?: boolean;
    restrictionDetails?: string;
    takesMedication?: boolean;
    medications?: {
      name: string;
      dosage?: string;
      frequency?: string;
      instructions?: string;
    }[];
    hasFoodAllergies?: boolean;
    allergies?: string;
    eatsIndependently?: boolean;
    hasToiletingDifficulties?: boolean;
    toiletingDetails?: string;
    usesDiapers?: boolean;
    physicianName?: string;
    physicianHealthFund?: string;
    physicianPhone?: string;
    physicianSummaryDocumentId?: string;
  };
  development?: { level?: string; details?: string };
  declarationVersion?: string;
  declarationAcceptances?: boolean[];
  signatures?: { parent1?: Signature; parent2?: Signature };
}
