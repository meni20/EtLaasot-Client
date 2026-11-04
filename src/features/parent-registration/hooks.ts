import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { RegistrationApi, ListParams } from "./api";

export function useRegistration(api: RegistrationApi) {
  return useQuery({
    queryKey: ["registration", ...(api.queryScope ?? []), "me"],
    queryFn: () => api.me(),
    retry: false,
    staleTime: Infinity,
    // Submitted forms are read-only. Follow manager decisions without polling
    // or replacing an editable draft (including unsaved signatures).
    refetchInterval: (query) =>
      query.state.data?.form?.status === "PENDING_REVIEW" ? 3000 : false,
    gcTime: 0,
  });
}
export function useRegistrationStatus(api: RegistrationApi) {
  return useQuery({
    queryKey: ["registration", ...(api.queryScope ?? []), "status"],
    queryFn: () => api.status(),
    retry: false,
    gcTime: 0,
  });
}
export function useRegistrationFeedback(api: RegistrationApi, status?: string) {
  return useQuery({
    queryKey: ["registration", ...(api.queryScope ?? []), "feedback", status],
    queryFn: () => api.feedback(),
    retry: false,
    gcTime: 0,
  });
}
export function useRegistrationYears(api: RegistrationApi) {
  return useQuery({
    queryKey: ["registration", "years"],
    queryFn: () => api.years(),
    retry: false,
  });
}
export function useRegistrationList(api: RegistrationApi, params: ListParams) {
  return useQuery({
    queryKey: ["registration", "list", params],
    queryFn: () => api.list(params),
    enabled: !!params.branchId && !!params.activityYearId,
    retry: false,
    gcTime: 0,
  });
}
export function useRegistrationDetail(api: RegistrationApi, id: string) {
  return useQuery({
    queryKey: ["registration", "detail", id],
    queryFn: () => api.detail(id),
    enabled: !!id,
    retry: false,
    gcTime: 0,
  });
}
export function useRegistrationAction<T>(
  action: (input: T) => Promise<unknown>,
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: action,
    retry: false,
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: ["registration"] }),
        client.invalidateQueries({ queryKey: ["trainees"] }),
      ]),
  });
}
