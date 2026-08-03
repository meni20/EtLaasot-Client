import axios from "axios";

export const PASSWORD_POLICY_MESSAGE =
  "הסיסמה צריכה להכיל לפחות 6 תווים ולא להיות סיסמה נפוצה מדי";

const COMMON_PASSWORDS = new Set([
  "123456",
  "111111",
  "000000",
  "password",
  "qwerty",
]);

export const normalizeNewPassword = (password: string) => password.trim();

export const getNewPasswordValidationError = (password: string) => {
  const normalizedPassword = normalizeNewPassword(password);

  if (
    normalizedPassword.length < 6 ||
    COMMON_PASSWORDS.has(normalizedPassword.toLowerCase())
  ) {
    return PASSWORD_POLICY_MESSAGE;
  }

  if (normalizedPassword.length > 128) {
    return "הסיסמה ארוכה מדי";
  }

  return "";
};

export const getPasswordChangeErrorMessage = (
  error: unknown,
  fallback: string,
) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && /[\u0590-\u05FF]/.test(message)) {
      return message;
    }
  }

  return fallback;
};
