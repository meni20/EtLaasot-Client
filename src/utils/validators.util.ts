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
    newErrors.name = "יש להזין שם מלא";
  }

  if (!isValidIsraeliId(form.id)) {
    newErrors.id = "תעודת הזהות אינה תקינה";
  }

  if (!isValidIsraeliPhone(form.phoneNumber)) {
    newErrors.phoneNumber = "מספר הטלפון אינו תקין";
  }

  if (!form.gender) {
    newErrors.gender = "יש לבחור מגדר";
  }

  if (!form.dateOfBirth || !isValidDateOfBirth(form.dateOfBirth)) {
    newErrors.dateOfBirth = "יש להזין תאריך לידה תקין";
  }

  if (form.customShirtSize && form.customShirtSize.trim().length > 50) {
    newErrors.customShirtSize = "מידה אחרת יכולה להכיל עד 50 תווים";
  }

  if (form.notes && form.notes.trim().length > 2000) {
    newErrors.notes = "הערות יכולות להכיל עד 2000 תווים";
  }

  if (form.parentName && form.parentName.trim().length > 100) {
    newErrors.parentName = "שם הורה יכול להכיל עד 100 תווים";
  }

  if (
    form.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  ) {
    newErrors.email = "כתובת האימייל אינה תקינה";
  }

  return newErrors;
};

export const validateFormEvent = (form: IEvent): EventValidationErrors => {
  const newErrors: EventValidationErrors = {};

  if (!form.name.trim()) {
    newErrors.name = "יש להזין שם מלא";
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
