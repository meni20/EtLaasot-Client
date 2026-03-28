import type { IUser } from "../interfaces/user.interface";

export const formatDate = (date: Date): string => {
  const dateObj = new Date(date);
  const day = String(dateObj?.getDate()).padStart(2, "0");
  const month = String(dateObj?.getMonth() + 1).padStart(2, "0");
  const year = dateObj?.getFullYear();

  return `${day}/${month}/${year}`;
};

export const isValidIsraeliPhone = (phone: string): boolean => {
  return /^(\+972|972|0)5\d{8}$/.test(phone);
};

export const isValidIsraeliId = (id: string): boolean => {
  if (!/^\d{5,9}$/.test(id)) return false;

  const paddedId = id.padStart(9, "0");

  const sum = paddedId
    .split("")
    .map((digit, index) => {
      const num = Number(digit) * ((index % 2) + 1);
      return num > 9 ? num - 9 : num;
    })
    .reduce((acc, curr) => acc + curr, 0);

  return sum % 10 === 0;
};
