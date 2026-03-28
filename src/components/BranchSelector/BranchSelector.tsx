import React from "react";
import { Select, MenuItem } from "@mui/material";
import { useBranch } from "../../contexts/useBranch";
import { useBranchSelectorStyles } from "./BranchSelector.styles";

export const BranchSelector: React.FC = () => {
  const { activeBranch, availableBranches, switchBranch } = useBranch();
  const classes = useBranchSelectorStyles();

  if (availableBranches.length <= 1) return null;

  return (
    <Select
      value={activeBranch ?? ""}
      onChange={(e) => switchBranch(e.target.value as string)}
      size="small"
      className={classes.select}
      variant="outlined"
    >
      {availableBranches.map((branch) => (
        <MenuItem key={branch.id} value={branch.id}>
          {branch.name}
        </MenuItem>
      ))}
    </Select>
  );
};
