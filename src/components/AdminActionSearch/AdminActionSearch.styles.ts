import { makeStyles } from "@mui/styles";

export const useAdminActionSearchStyles = makeStyles({
  root: {
    display: "none",
    minWidth: 0,
    flex: "1 1 220px",
    maxWidth: 360,
    transform: "translateX(-50px)",
  },
  autocomplete: {
    width: "100%",
    direction: "rtl" as const,
    "& .MuiOutlinedInput-root": {
      minHeight: 40,
      paddingBlock: "0 !important",
      paddingInline: "8px 10px !important",
      borderRadius: "12px !important",
      backgroundColor: "rgba(255, 255, 255, 0.13)",
      color: "var(--color-surface)",
      transition:
        "background-color 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.3)",
      },
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.18)",
        "& fieldset": {
          borderColor: "rgba(255, 255, 255, 0.52)",
        },
      },
      "&.Mui-focused": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
        "& fieldset": {
          borderColor: "rgba(255, 255, 255, 0.9) !important",
          borderWidth: "1px !important",
        },
      },
    },
    "& .MuiAutocomplete-input": {
      minWidth: "0 !important",
      padding: "7px 2px !important",
      fontFamily: "inherit",
      fontSize: "0.88rem",
      fontWeight: 600,
      textAlign: "right" as const,
      color: "var(--color-surface)",
      "&::placeholder": {
        color: "rgba(255, 255, 255, 0.78)",
        opacity: 1,
      },
    },
  },
  searchIcon: {
    color: "rgba(255, 255, 255, 0.86)",
    fontSize: "1.2rem !important",
  },
  paper: {
    direction: "rtl" as const,
    marginTop: "6px !important",
    borderRadius: "14px !important",
    border: "1px solid var(--color-border-subtle)",
    backgroundColor: "var(--color-surface) !important",
    boxShadow: "0 14px 36px rgba(45, 35, 43, 0.2) !important",
    overflow: "hidden",
  },
  listbox: {
    padding: "6px !important",
    maxHeight: "min(420px, calc(100dvh - 96px)) !important",
    "& .MuiAutocomplete-option": {
      minHeight: "50px !important",
      padding: "7px 10px !important",
      borderRadius: "10px",
      alignItems: "center !important",
      gap: 10,
      "&[aria-selected='true']": {
        backgroundColor: "var(--color-primary-soft) !important",
      },
      "&.Mui-focused": {
        backgroundColor: "var(--color-primary-soft) !important",
      },
    },
  },
  optionIcon: {
    width: 34,
    height: 34,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    color: "var(--color-primary)",
    backgroundColor: "var(--color-primary-soft)",
    "& svg": {
      fontSize: "1.15rem",
    },
  },
  optionText: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
  },
  optionLabel: {
    fontFamily: "inherit !important",
    fontWeight: "700 !important" as const,
    fontSize: "0.9rem !important",
    lineHeight: "1.35 !important",
    color: "var(--color-text)",
  },
  optionDescription: {
    fontFamily: "inherit !important",
    fontSize: "0.75rem !important",
    lineHeight: "1.35 !important",
    color: "var(--color-text-secondary)",
  },
  noOptions: {
    direction: "rtl" as const,
    padding: "14px 16px !important",
    fontFamily: "inherit",
    fontSize: "0.86rem",
    color: "var(--color-text-secondary)",
  },
  "@media (min-width: 1024px)": {
    root: {
      display: "block",
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    autocomplete: {
      "& .MuiOutlinedInput-root": {
        transition: "none",
      },
    },
  },
});
