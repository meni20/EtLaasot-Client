import { isAxiosError } from "axios";
import type { IUserRole } from "../interfaces/user.interface";
import { AUTH_ROLES } from "./auth.const";

export type EventAudience = "ALL" | "VOLUNTEERS" | "TRAINEES";
export const EVENT_AUDIENCE_LABELS: Record<EventAudience, string> = {
  ALL: "כולם",
  VOLUNTEERS: "מתנדבים בלבד",
  TRAINEES: "חניכים בלבד",
};

export function isEligibleForAudience(
  roles: IUserRole[] | undefined,
  audience: EventAudience = "ALL",
  branchId?: string,
) {
  if (audience === "ALL") return true;
  return (
    roles?.some(
      (role) =>
        role.roleId === AUTH_ROLES.SUPER_ADMIN.id ||
        ((role.branchId ?? role.resourceId) === branchId &&
          (role.roleId === AUTH_ROLES.BRANCH_ADMIN.id ||
            role.roleId === (audience === "VOLUNTEERS" ? 1 : 2))),
    ) ?? false
  );
}

export function eventAccessError(error: unknown, fallback: string) {
  if (!isAxiosError(error)) return fallback;
  if (error.response?.status === 403)
    return "אין הרשאה לפעולה זו עבור קהל היעד או הסניף של האירוע. יש לרענן ולנסות שוב.";
  if (error.response?.status === 409) {
    const data = error.response.data;
    if (data?.code === "EVENT_AUDIENCE_CONFLICT") {
      return `לא ניתן לשנות את קהל היעד: ${Number(data.participantCount) || 0} משתתפים ו־${Number(data.activeActivityCount) || 0} פעילויות פעילות אינם מתאימים. יש להסדיר אותם תחילה ולנסות שוב. המשתתפים לא נמחקו.`;
    }
    return "הנתונים השתנו או שהפעולה מתנגשת בנתונים קיימים. יש לרענן ולנסות שוב.";
  }
  return fallback;
}
