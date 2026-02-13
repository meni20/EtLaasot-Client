export const initials = (name?: string) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
};

export const copy = async (text?: string) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch {}
};
