// utils/validators.ts
import type { IEvent } from "../interfaces/event.interface";
import type { IUser } from "../interfaces/user.interface";
import { isValidIsraeliId, isValidIsraeliPhone } from "./data.utillity";

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

  return newErrors;
};

export const isValidTAZ = (taz: string): boolean => isValidIsraeliId(taz);
