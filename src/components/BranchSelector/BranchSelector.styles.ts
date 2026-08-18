import { makeStyles } from "@mui/styles";

export const useBranchSelectorStyles = makeStyles({
  select: {
    color: "#fff",
    fontFamily: "inherit",
    fontSize: "0.9rem",
    borderRadius: 10,
    transition: "color var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease)",
    "& .MuiSelect-icon": {
      color: "#fff",
      transition: "transform var(--transition-fast, 140ms ease)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.4)",
      transition: "border-color var(--transition-fast, 140ms ease)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#fff",
    },
    "@media (hover: hover) and (pointer: fine)": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(255,255,255,0.7)",
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
    minWidth: 170,
    color: "#342b33",
    fontFamily: "inherit",
    fontSize: "0.9rem",
    borderRadius: 10,
    backgroundColor: "#fff",
    "& .MuiSelect-icon": {
      color: "#7a3e6b",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ead8e5",
    },
    "@media (hover: hover) and (pointer: fine)": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#9a5188",
      },
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#9a5188",
    },
  },
});
