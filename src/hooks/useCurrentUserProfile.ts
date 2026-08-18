import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userService from "../services/user.service";
import type { IUpdateCurrentUserProfilePayload } from "../interfaces/user.interface";

export const CURRENT_USER_PROFILE_QUERY_KEY = ["current-user-profile"] as const;

export const useCurrentUserProfile = (enabled = true) => {
  return useQuery({
    queryKey: CURRENT_USER_PROFILE_QUERY_KEY,
    queryFn: () => userService.getMe(),
    enabled,
  });
};

export const useUpdateCurrentUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateCurrentUserProfilePayload) =>
      userService.updateMe(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(CURRENT_USER_PROFILE_QUERY_KEY, profile);
      queryClient.invalidateQueries({
        queryKey: CURRENT_USER_PROFILE_QUERY_KEY,
      });
    },
  });
};
