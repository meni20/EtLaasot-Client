export interface ISuperAdminDashboardTotals {
  activeBranches: number;
  activeVolunteers: number;
  activeTrainees: number;
  activeAssignments: number;
  unassignedTrainees: number;
  upcomingEvents: number;
}

export interface ISuperAdminBranchSummary {
  branchId: string;
  branchName: string;
  activeVolunteers: number;
  activeTrainees: number;
  activeAssignments: number;
  unassignedTrainees: number;
  upcomingEvents: number;
}

export interface ISuperAdminDashboardData {
  totals: ISuperAdminDashboardTotals;
  branches: ISuperAdminBranchSummary[];
}
