import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

function QuerySession({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  useEffect(() => () => client.clear(), [client]);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

// Retire the whole cache on auth/role changes, including in-flight mutations
// whose callbacks could otherwise repopulate another user's cache after logout.
export function SessionQueries({ children }: { children: ReactNode }) {
  const { user, sessionId } = useAuth();
  const roles =
    user?.roles
      .map((role) => `${role.roleId}:${role.branchId}`)
      .sort()
      .join(",") ?? "";
  return (
    <QuerySession key={`${sessionId}:${user?.userId ?? "guest"}:${roles}`}>
      {children}
    </QuerySession>
  );
}
