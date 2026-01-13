import type { IUser } from "../interfaces/user.interface";

export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
export const isValidIsraeliId = (id: string): boolean => {
  if (!/^\d{9}$/.test(id)) return false;

  const digits = id.split("").map(Number);

  const sum = digits.reduce((acc, digit, index) => {
    const step = digit * ((index % 2) + 1);
    return acc + (step > 9 ? step - 9 : step);
  }, 0);

  return sum % 10 === 0;
};

export const isValidIsraeliPhone = (phone: string): boolean => {
  return /^(\+972|972|0)5\d{8}$/.test(phone);
};
