export const AUTH_ROLES = {
  SUPER_ADMIN: {
    id: 10001,
    name: "מנהל על",
  },
  BRANCH_ADMIN: {
    id: 10000,
    name: "מנהל סניף",
  },
  VOLUNTEER: {
    id: 1,
    name: "מתנדב",
  },
  TRAINEE: {
    id: 2,
    name: "חניך",
  },
};

export const BRANCHES = {
  BAT_YAM: { id: "branch-bat-yam", name: "סניף בת ים" },
  TEL_AVIV: { id: "branch-tel-aviv", name: "סניף תל אביב" },
  JERUSALEM: { id: "branch-jerusalem", name: "סניף ירושלים" },
  HAIFA: { id: "branch-haifa", name: "סניף חיפה" },
  BEER_SHEVA: { id: "branch-beer-sheva", name: "סניף באר שבע" },
};

export const EVENT_TYPES: Record<string, { label: string; icon: string }> = {
  shabbat: { label: "שבת", icon: "🕯️" },
  camp: { label: "מחנה", icon: "⛺" },
  trip: { label: "טיול", icon: "🥾" },
  meeting: { label: "פגישה", icon: "🤝" },
  holiday: { label: "חג", icon: "🎉" },
  training: { label: "הדרכה", icon: "📚" },
  general: { label: "כללי", icon: "📌" },
};
