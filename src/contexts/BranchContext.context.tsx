import React, { useState, useCallback, useEffect, type ReactNode } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { BranchContext } from "./useBranch";
import branchService from "../services/branch.service";

export const BranchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, isSuperAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [activeBranch, setActiveBranch] = useState<string | null>(() =>
    user?.roles?.length ? user.roles[0].branchId : null,
  );

  // Super admins: fetch ALL branches from the server
  const { data: allBranches } = useQuery({
    queryKey: ["allBranches"],
    queryFn: () => branchService.getAllBranches(),
    enabled: isSuperAdmin,
  });

  // Sync when user changes (e.g. after login)
  const prevUserId = React.useRef(user?.userId);
  useEffect(() => {
    if (user?.userId !== prevUserId.current) {
      prevUserId.current = user?.userId;
      const defaultBranch = user?.roles?.[0]?.branchId ?? null;
      if (defaultBranch && defaultBranch !== activeBranch) {
        setActiveBranch(defaultBranch);
      }
    }
  }, [user?.userId, user?.roles, activeBranch]);

  const switchBranch = useCallback(
    (branchId: string) => {
      setActiveBranch(branchId);
      queryClient.invalidateQueries();
    },
    [queryClient],
  );

  // Super admins see all branches; others see only branches from their roles
  const branchesFromRoles =
    user?.roles?.map((r) => ({
      id: r.branchId,
      name: r.branchName,
    })) ?? [];

  const uniqueRoleBranches = branchesFromRoles.filter(
    (b, i, arr) => arr.findIndex((x) => x.id === b.id) === i,
  );

  const resolvedBranches =
    isSuperAdmin && allBranches
      ? allBranches.map((b) => ({ id: b.id, name: b.name }))
      : uniqueRoleBranches;

  return (
    <BranchContext.Provider
      value={{
        activeBranch,
        availableBranches: resolvedBranches,
        switchBranch,
        isSuperAdmin,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};
