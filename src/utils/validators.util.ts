// utils/validators.ts
import type { IEvent } from "../interfaces/event.interface";
import type { IUser } from "../interfaces/user.interface";
import {
  isValidDateOfBirth,
  isValidIsraeliId,
  isValidIsraeliPhone,
} from "./data.utillity";

export type ValidationErrors = Partial<Record<keyof IUser, string>>;
export type EventValidationErrors = Partial<Record<keyof IEvent, string>>;

export const validateFormVolunteer = (form: IUser): ValidationErrors => {
  const newErrors: ValidationErrors = {};

  if (!form.name.trim()) {
    newErrors.name = "Name is required";
  }

  if (!isValidIsraeliId(form.id)) {
    newErrors.id = "Invalid Israeli ID";
  }

  if (!isValidIsraeliPhone(form.phoneNumber)) {
    newErrors.phoneNumber = "Invalid Israeli phone number";
  }

  if (!form.gender) {
    newErrors.gender = "Gender is required";
  }

  if (!form.dateOfBirth || !isValidDateOfBirth(form.dateOfBirth)) {
    newErrors.dateOfBirth = "Valid date of birth is required";
  }

  if (form.customShirtSize && form.customShirtSize.trim().length > 50) {
    newErrors.customShirtSize = "Custom shirt size is too long";
  }

  if (form.notes && form.notes.trim().length > 2000) {
    newErrors.notes = "Notes cannot exceed 2000 characters";
  }

  if (form.parentName && form.parentName.trim().length > 100) {
    newErrors.parentName = "Parent name cannot exceed 100 characters";
  }

  if (
    form.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  ) {
    newErrors.email = "Invalid email address";
  }

  return newErrors;
};

export const validateFormEvent = (form: IEvent): EventValidationErrors => {
  const newErrors: EventValidationErrors = {};

  if (!form.name.trim()) {
    newErrors.name = "Name is required";
  }

  if (
    !(form.startDate instanceof Date) ||
    Number.isNaN(form.startDate.getTime())
  ) {
    newErrors.startDate = "יש לבחור תאריך ושעת התחלה תקינים";
  }

  if (!(form.endDate instanceof Date) || Number.isNaN(form.endDate.getTime())) {
    newErrors.endDate = "יש לבחור שעת סיום תקינה";
  } else if (!newErrors.startDate && form.endDate <= form.startDate) {
    newErrors.endDate = "שעת הסיום חייבת להיות מאוחרת משעת ההתחלה";
  }

  return newErrors;
};

export const isValidTAZ = (taz: string): boolean => isValidIsraeliId(taz);
