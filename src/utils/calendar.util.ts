import type { IEvent } from "../interfaces/event.interface";

type CalendarEvent = Pick<
  IEvent,
  "name" | "description" | "address" | "startDate" | "endDate"
>;

const ICS_DATE_PART_LENGTH = 2;

const padDatePart = (value: number) =>
  String(value).padStart(ICS_DATE_PART_LENGTH, "0");

const sanitizeFilename = (value: string) => {
  const filename = value
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "-");

  return filename || "event";
};

export const formatDateForICS = (date: string | Date): string => {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    throw new Error("Invalid event date");
  }

  return `${value.getUTCFullYear()}${padDatePart(
    value.getUTCMonth() + 1,
  )}${padDatePart(value.getUTCDate())}T${padDatePart(
    value.getUTCHours(),
  )}${padDatePart(value.getUTCMinutes())}${padDatePart(
    value.getUTCSeconds(),
  )}Z`;
};

export const escapeICSText = (text = ""): string =>
  text
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

export const downloadICS = (event: CalendarEvent): void => {
  if (!event.startDate || !event.endDate) {
    throw new Error("Event start and end dates are required");
  }

  const summary = escapeICSText(event.name);
  const description = escapeICSText(event.description ?? "");
  const location = escapeICSText(event.address ?? "");
  const startDate = formatDateForICS(event.startDate);
  const endDate = formatDateForICS(event.endDate);
  const timestamp = formatDateForICS(new Date());
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@etlaasot`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Et Laasot//Events//HE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${sanitizeFilename(event.name)}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
