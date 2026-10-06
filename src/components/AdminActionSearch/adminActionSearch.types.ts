import type { ReactNode } from "react";

export type AdminRouteActionId =
  | "create-volunteer"
  | "create-trainee"
  | "create-event";

export type AdminDialogActionId =
  | "personal-details"
  | "change-password";

interface AdminActionBase {
  id: string;
  label: string;
  aliases: string[];
  icon: ReactNode;
  allowedRoles: number[];
  description?: string;
}

export type AdminSearchAction =
  | (AdminActionBase & {
      type: "navigate";
      path: string;
    })
  | (AdminActionBase & {
      type: "route-action";
      path: string;
      routeAction: AdminRouteActionId;
    })
  | (AdminActionBase & {
      type: "dialog";
      dialog: AdminDialogActionId;
    })
  | (AdminActionBase & {
      type: "switch-branch";
      branchId: string;
    });

export interface AdminRouteActionState {
  adminAction?: AdminRouteActionId;
  [key: string]: unknown;
}
