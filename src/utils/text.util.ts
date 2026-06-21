const unicodeEscapePattern = /\\u[0-9a-fA-F]{4}/;

export const decodeUnicodeEscapes = (value: unknown): string => {
  if (typeof value !== "string") return "";
  if (!unicodeEscapePattern.test(value)) return value;

  try {
    return value.replace(/\\u([0-9a-fA-F]{4})/g, (_, code: string) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    );
  } catch {
    return value;
  }
};
