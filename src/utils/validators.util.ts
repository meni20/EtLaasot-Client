import type { IEvent } from "../interfaces/event.interface";
import type { IUserFormData } from "../interfaces/user.interface";
import { isValidIsraeliId, isValidIsraeliPhone } from "./data.utillity";

export interface IEventFormData extends Omit<IEvent, "startDate" | "endDate"> {
  startDate: Date | null;
  endDate: Date | null;
}

export type UserValidationErrors = Partial<Record<keyof IUserFormData, string>>;
export type EventValidationErrors = Partial<
  Record<"name" | "address" | "startDate" | "endDate", string>
>;

const isValidDate = (value: Date | null): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime());

export const validateFormVolunteer = (
  form: IUserFormData
): UserValidationErrors => {
  const newErrors: UserValidationErrors = {};

  if (!form.name.trim()) {
    newErrors.name = "Name is required";
  }

  if (!isValidIsraeliId(form.id)) {
    newErrors.id = "Invalid Israeli ID";
  }

  if (!isValidIsraeliPhone(form.phoneNumber)) {
    newErrors.phoneNumber = "Invalid Israeli phone number";
  }

  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = "Invalid email address";
  }

  return newErrors;
};

export const validateFormEvent = (
  form: IEventFormData
): EventValidationErrors => {
  const newErrors: EventValidationErrors = {};

  if (!form.name.trim()) {
    newErrors.name = "Name is required";
  }

  if (!form.address.trim()) {
    newErrors.address = "Address is required";
  }

  if (!isValidDate(form.startDate)) {
    newErrors.startDate = "Start date is required";
  }

  if (!isValidDate(form.endDate)) {
    newErrors.endDate = "End date is required";
  }

  if (
    isValidDate(form.startDate) &&
    isValidDate(form.endDate) &&
    form.endDate.getTime() <= form.startDate.getTime()
  ) {
    newErrors.endDate = "End date must be after start date";
  }

  return newErrors;
};
