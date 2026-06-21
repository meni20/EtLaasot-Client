export const formatDate = (date: Date): string => {
  const dateObj = new Date(date);
  const day = String(dateObj?.getDate()).padStart(2, "0");
  const month = String(dateObj?.getMonth() + 1).padStart(2, "0");
  const year = dateObj?.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatDateTimeShort = (
  date: Date | string | null | undefined,
): string => {
  if (!date) return "-";

  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) return "-";

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatDateTime = (
  date: Date | string | null | undefined,
  timeZone = "Asia/Jerusalem",
): string => {
  if (!date) return "-";

  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "-";

  return new Intl.DateTimeFormat("he-IL", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
};

export const formatDurationMinutes = (
  totalMinutes: number | null | undefined,
): string => {
  if (totalMinutes === null || totalMinutes === undefined || totalMinutes < 0) {
    return "-";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (!hours) return `${minutes} דק'`;
  if (!minutes) return `${hours} שע'`;
  return `${hours} שע' ${minutes} דק'`;
};

export const getDurationMinutesBetween = (
  startTime: Date | string | null | undefined,
  endTime?: Date | string | null,
): number | null => {
  if (!startTime) return null;

  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end.getTime() < start.getTime()
  ) {
    return null;
  }

  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
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

const parseDateOnly = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

export const calculateAge = (
  dateOfBirth?: string | null,
  fallbackAge?: number | null,
): number | null => {
  if (!dateOfBirth) return fallbackAge ?? null;

  const birthDate = parseDateOnly(dateOfBirth);
  if (!birthDate) return fallbackAge ?? null;

  const today = new Date();
  if (birthDate > today) return fallbackAge ?? null;

  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayHasPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!birthdayHasPassed) age -= 1;
  return age >= 0 && age <= 120 ? age : fallbackAge ?? null;
};

export const isValidDateOfBirth = (value: string): boolean =>
  !!value && calculateAge(value) !== null;

export const getTodayDateInputValue = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(today.getDate()).padStart(2, "0")}`;
};
