const CODE_MESSAGES: Record<string, string> = {
  ACTIVITY_NOT_FOUND: "הפעילות אינה זמינה. רעננו את המסך.",
  ACTIVITY_NOT_OWNED: "אפשר לסיים רק פעילות שהתחלתם.",
  ACTIVITY_NOT_ACTIVE: "הפעילות כבר הסתיימה או אינה פעילה. רעננו את המסך.",
  ACTIVITY_INVALID_START: "לא ניתן לסיים את הפעילות. פנו למנהל הסניף.",
  ACTIVITY_INVALID_END: "לא ניתן לסיים את הפעילות כרגע. נסו שוב.",
  ACTIVITY_ALREADY_ACTIVE:
    "כבר יש פעילות פעילה. סיימו אותה לפני התחלת פעילות נוספת.",
};

// Deliberately never render arbitrary server messages or log response bodies.
export function apiErrorMessage(error: unknown, fallback: string): string {
  const response = (
    error as {
      response?: { status?: number; data?: { code?: unknown } };
    } | null
  )?.response;
  const code = response?.data?.code;
  if (typeof code === "string" && CODE_MESSAGES[code])
    return CODE_MESSAGES[code];
  switch (response?.status) {
    case 401:
      return "תוקף הכניסה פג. יש להתחבר מחדש.";
    case 403:
      return "אין לך הרשאה לפעולה זו. פנו למנהל הסניף.";
    case 404:
      return "המידע אינו זמין עוד. רעננו את המסך.";
    case 409:
      return "הנתונים השתנו. רעננו את המסך ובדקו את המצב לפני ניסיון נוסף.";
    case 400:
    case 422:
      return "יש לבדוק את הפרטים שהוזנו ולנסות שוב.";
    case 429:
      return "בוצעו ניסיונות רבים. המתינו מעט ונסו שוב.";
    default:
      return fallback;
  }
}
