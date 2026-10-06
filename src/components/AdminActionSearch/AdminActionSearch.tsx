import { useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { useBranch } from "../../contexts/useBranch";
import { STATIC_ADMIN_ACTIONS, createBranchAction } from "./adminActions";
import { filterAdminActions } from "./adminActionSearch.utils";
import type {
  AdminDialogActionId,
  AdminRouteActionState,
  AdminSearchAction,
} from "./adminActionSearch.types";
import { useAdminActionSearchStyles } from "./AdminActionSearch.styles";

interface AdminActionSearchProps {
  onOpenDialog: (dialog: AdminDialogActionId) => void;
}

export const AdminActionSearch: React.FC<AdminActionSearchProps> = ({
  onOpenDialog,
}) => {
  const classes = useAdminActionSearchStyles();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeBranch, availableBranches, switchBranch } = useBranch();
  const [inputValue, setInputValue] = useState("");

  const userRoleIds = useMemo(
    () => user?.roles?.map((role) => role.roleId) ?? [],
    [user?.roles],
  );

  const actions = useMemo(() => {
    const branchActions = availableBranches.length > 1
      ? availableBranches
          .filter((branch) => branch.id !== activeBranch)
          .map(createBranchAction)
      : [];

    return [...STATIC_ADMIN_ACTIONS, ...branchActions].filter((action) =>
      action.allowedRoles.some((roleId) => userRoleIds.includes(roleId)),
    );
  }, [activeBranch, availableBranches, userRoleIds]);

  const executeAction = (action: AdminSearchAction) => {
    setInputValue("");

    switch (action.type) {
      case "navigate":
        navigate(action.path);
        break;
      case "route-action":
        navigate(action.path, {
          state: { adminAction: action.routeAction } satisfies AdminRouteActionState,
        });
        break;
      case "dialog":
        onOpenDialog(action.dialog);
        break;
      case "switch-branch":
        switchBranch(action.branchId);
        break;
    }
  };

  return (
    <Box className={classes.root} role="search">
      <Autocomplete<AdminSearchAction, false, false, false>
        className={classes.autocomplete}
        options={actions}
        value={null}
        inputValue={inputValue}
        openOnFocus={false}
        clearOnBlur
        blurOnSelect
        forcePopupIcon={false}
        getOptionLabel={(action) => action.label}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        filterOptions={(options, state) =>
          filterAdminActions(options, state.inputValue)
        }
        onInputChange={(_event, value, reason) => {
          if (reason !== "reset") setInputValue(value);
        }}
        onChange={(_event, action) => {
          if (action) executeAction(action);
        }}
        noOptionsText="לא נמצאו פעולות. נסו ניסוח אחר."
        classes={{
          paper: classes.paper,
          listbox: classes.listbox,
          noOptions: classes.noOptions,
        }}
        renderOption={(props, action) => {
          const { key, ...optionProps } = props;
          return (
            <Box component="li" key={key} {...optionProps}>
              <Box className={classes.optionIcon} aria-hidden="true">
                {action.icon}
              </Box>
              <Box className={classes.optionText}>
                <Typography className={classes.optionLabel}>
                  {action.label}
                </Typography>
                {action.description && (
                  <Typography className={classes.optionDescription}>
                    {action.description}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="חיפוש פעולה..."
            inputProps={{
              ...params.inputProps,
              "aria-label": "חיפוש פעולות ניהול",
              dir: "rtl",
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon className={classes.searchIcon} />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </Box>
  );
};
