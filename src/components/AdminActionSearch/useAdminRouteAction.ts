import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type {
  AdminRouteActionId,
  AdminRouteActionState,
} from "./adminActionSearch.types";

export const useAdminRouteAction = (
  actionId: AdminRouteActionId,
  onTrigger: () => void,
) => {
  const location = useLocation();
  const navigate = useNavigate();
  const onTriggerRef = useRef(onTrigger);

  useEffect(() => {
    onTriggerRef.current = onTrigger;
  }, [onTrigger]);

  useEffect(() => {
    const state = location.state as AdminRouteActionState | null;
    if (state?.adminAction !== actionId) return;

    onTriggerRef.current();

    const { adminAction: _consumedAction, ...remainingState } = state;
    navigate(
      {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      },
      {
        replace: true,
        state: Object.keys(remainingState).length ? remainingState : null,
      },
    );
  }, [actionId, location.hash, location.pathname, location.search, location.state, navigate]);
};
