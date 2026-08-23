import { makeStyles } from "@mui/styles";

export const useBranchSelectorStyles = makeStyles({
  select: {
    color: "var(--color-text)",
    fontFamily: "inherit",
    fontSize: "0.9rem",
    borderRadius: 10,
    transition: "color var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease)",
    "& .MuiSelect-icon": {
      color: "var(--color-primary)",
      transition: "transform var(--transition-fast, 140ms ease)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--color-border)",
      transition: "border-color var(--transition-fast, 140ms ease)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--color-primary)",
    },
    "@media (hover: hover) and (pointer: fine)": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--color-primary)",
      },
      "&:hover .MuiSelect-icon": {
        transform: "translateY(2px)",
      },
    },
    "@media (prefers-reduced-motion: reduce)": {
      transition: "color 1ms linear, background-color 1ms linear",
      "& .MuiSelect-icon": {
        transition: "none",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        transition: "border-color 1ms linear",
      },
      "&:hover .MuiSelect-icon": {
        transform: "none",
      },
    },
  },
  dialogSelect: {
    minWidth: 180,
    maxWidth: 230,
    flex: "1 1 auto",
    minHeight: 44,
    color: "var(--color-text)",
    fontFamily: "inherit",
    fontSize: "0.9rem",
    borderRadius: 10,
    backgroundColor: "var(--color-surface)",
    "& .MuiSelect-icon": {
      color: "var(--color-primary)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--color-primary-border)",
    },
    "@media (hover: hover) and (pointer: fine)": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--color-primary)",
      },
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--color-primary)",
    },
    "&.Mui-focused": {
      boxShadow: "var(--shadow-focus)",
    },
    "@media (max-width: 420px)": {
      width: "100%",
      maxWidth: "none",
    },
  },
});
