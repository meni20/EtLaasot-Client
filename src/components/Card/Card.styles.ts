import { makeStyles } from "@mui/styles";

export const useCardStyles = makeStyles({
  cardContainer: {
    width: "100%",
  },
  card: {
    direction: "rtl" as const,
    position: "relative" as const,
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    borderRadius: "var(--radius-lg, 18px)",
    border: "1px solid var(--color-border-subtle, #e9ebef)",
    backgroundColor: "var(--color-surface, #fff)",
    boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16,24,40,0.07))",
    overflow: "hidden",
    transition:
      "transform var(--transition-normal, 180ms ease), box-shadow var(--transition-normal, 180ms ease), border-color var(--transition-normal, 180ms ease)",
    animation: "fadeInUp 220ms var(--ease-out, ease-out) both",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "var(--shadow-md, 0 12px 34px rgba(16,24,40,0.1))",
      borderColor: "var(--color-border, #dadde3)",
    },
    "&:focus-within": {
      borderColor: "var(--color-primary)",
      boxShadow: "0 0 0 3px rgba(var(--color-primary-rgb), 0.16)",
    },
  },
  cardWithImage: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#2f2930",
    borderColor: "rgba(255, 255, 255, 0.22)",
    "&::before": {
      content: '""',
      position: "absolute" as const,
      inset: 0,
      background:
        "linear-gradient(180deg, rgba(12, 15, 18, 0.42) 0%, rgba(12, 15, 18, 0.34) 42%, rgba(12, 15, 18, 0.56) 100%)",
      pointerEvents: "none" as const,
      zIndex: 0,
    },
    "& $cardContent, & $cardActions, & $divider": {
      position: "relative" as const,
      zIndex: 1,
    },
    "& $eventName, & $detailValue, & $description": {
      color: "#fff",
      textShadow: "0 1px 3px rgba(0, 0, 0, 0.45)",
    },
    "& $detailIcon": {
      color: "#fff",
      filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4))",
    },
    "& $typeChip": {
      backgroundColor: "rgba(255, 255, 255, 0.86)",
      color: "var(--color-brand)",
      borderColor: "rgba(255, 255, 255, 0.55)",
    },
    "& $statusChip": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      color: "#fff",
      borderColor: "rgba(255, 255, 255, 0.34)",
      backdropFilter: "blur(10px)",
    },
    "& $editButton, & $aiButton": {
      color: "#fff",
      backgroundColor: "rgba(0, 0, 0, 0.26)",
      borderColor: "rgba(255, 255, 255, 0.35)",
      backdropFilter: "blur(10px)",
      "&:hover": {
        color: "#fff",
        backgroundColor: "rgba(var(--color-primary-rgb), 0.92)",
        borderColor: "rgba(255, 255, 255, 0.72)",
      },
    },
    "& $divider": {
      borderColor: "rgba(255, 255, 255, 0.22)",
    },
    "& $secondaryButton": {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      color: "var(--color-primary-dark)",
      borderColor: "rgba(255, 255, 255, 0.72)",
      "&:hover": {
        backgroundColor: "#fff",
        borderColor: "#fff",
      },
    },
  },
  cardContent: {
    flex: 1,
    padding: "18px 18px 14px",
  },
  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 14,
  },
  titleBlock: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    gap: 8,
    minWidth: 0,
    flex: 1,
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  eventName: {
    minWidth: 0,
    fontWeight: 800,
    fontSize: "1.08rem",
    lineHeight: 1.3,
    color: "var(--color-text, #1d1d1f)",
    overflowWrap: "anywhere" as const,
  },
  chipRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    alignItems: "center",
    gap: 6,
  },
  editButton: {
    flexShrink: 0,
    width: 44,
    height: 44,
    color: "var(--color-brand)",
    backgroundColor: "var(--color-brand-soft)",
    border: "1px solid var(--color-border-subtle, #e9ebef)",
    transition:
      "transform var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease), color var(--transition-fast, 140ms ease)",
    "&:hover": {
      color: "#fff",
      backgroundColor: "var(--color-brand)",
      borderColor: "var(--color-brand)",
    },
    "&:active": {
      transform: "scale(0.94)",
    },
  },
  aiButton: {
    flexShrink: 0,
    width: 44,
    height: 44,
    color: "var(--color-brand)",
    backgroundColor: "var(--color-brand-soft)",
    border: "1px solid var(--color-border-subtle, #e9ebef)",
    transition:
      "transform var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease), color var(--transition-fast, 140ms ease)",
    "&:hover": {
      color: "#fff",
      backgroundColor: "var(--color-brand)",
      borderColor: "var(--color-brand)",
    },
    "&:active": {
      transform: "scale(0.94)",
    },
  },
  typeChip: {
    flexShrink: 0,
    height: 26,
    borderRadius: "var(--radius-sm, 10px)",
    backgroundColor: "var(--color-brand-soft)",
    color: "var(--color-brand)",
    fontSize: 12,
    fontWeight: 700,
    border: "1px solid rgba(var(--color-brand-rgb), 0.18)",
  },
  statusChip: {
    flexShrink: 0,
    height: 26,
    borderRadius: "var(--radius-sm, 10px)",
    fontSize: 12,
    fontWeight: 800,
    border: "1px solid transparent",
  },
  statusUpcoming: {
    color: "var(--color-primary-dark)",
    backgroundColor: "var(--color-primary-soft)",
    borderColor: "rgba(var(--color-primary-rgb), 0.18)",
  },
  statusPast: {
    color: "var(--color-text-secondary, #51565c)",
    backgroundColor: "var(--color-surface-muted, #f0f2f4)",
    borderColor: "var(--color-border-subtle, #e9ebef)",
  },
  detailsList: {
    marginBottom: 4,
  },
  detailRow: {
    display: "grid",
    gridTemplateColumns: "22px minmax(0, 1fr)",
    gap: 9,
    alignItems: "center",
    minHeight: 26,
  },
  detailIcon: {
    color: "var(--color-brand)",
    fontSize: 19,
  },
  detailValue: {
    color: "var(--color-text, #1d1d1f)",
    fontSize: 13.5,
    fontWeight: 700,
    lineHeight: 1.45,
    overflowWrap: "anywhere" as const,
  },
  description: {
    color: "var(--color-text-secondary, #51565c)",
    fontSize: 13,
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
  },
  divider: {
    borderColor: "var(--color-border-subtle, #e9ebef)",
  },
  cardActions: {
    display: "flex",
    flexWrap: "wrap" as const,
    justifyContent: "flex-start",
    gap: 8,
    padding: "12px 14px 14px",
  },
  showButton: {
    minHeight: 44,
    borderRadius: "var(--radius-sm, 10px)",
    fontWeight: 700,
    textTransform: "none" as const,
    fontSize: 12.5,
    backgroundColor: "var(--color-primary) !important",
    color: "#fff !important",
    padding: "8px 12px",
    opacity: "1 !important",
    boxShadow:
      "inset 0 0 0 1px rgba(var(--color-primary-rgb), 0.18), var(--shadow-sm)",
    transition:
      "transform var(--transition-fast), background-color var(--transition-fast), box-shadow var(--transition-fast)",
    "& .MuiButton-startIcon": {
      marginLeft: 5,
      marginRight: 0,
      "& svg": {
        fontSize: 18,
      },
    },
    "&:hover": {
      backgroundColor: "var(--color-primary-dark) !important",
      boxShadow:
        "inset 0 0 0 1px rgba(var(--color-primary-rgb), 0.24), 0 6px 16px rgba(var(--color-primary-rgb), 0.22)",
    },
    "&:active": {
      backgroundColor: "var(--color-primary-pressed) !important",
      transform: "scale(0.98)",
      boxShadow: "inset 0 0 0 1px rgba(var(--color-primary-rgb), 0.28)",
    },
    "&:focus-visible": {
      boxShadow: "var(--shadow-focus)",
    },
    "&.Mui-disabled": {
      backgroundColor: "var(--color-surface-muted) !important",
      color: "var(--color-text-muted) !important",
      opacity: "1 !important",
      boxShadow: "inset 0 0 0 1px var(--color-border)",
    },
  },
  secondaryButton: {
    minHeight: 44,
    borderRadius: "var(--radius-sm, 10px)",
    fontWeight: 700,
    textTransform: "none" as const,
    fontSize: 12.5,
    backgroundColor: "var(--color-surface, #fff)",
    color: "var(--color-brand)",
    border: "1px solid var(--color-border, #dadde3)",
    padding: "8px 12px",
    "& .MuiButton-startIcon": {
      marginLeft: 5,
      marginRight: 0,
      "& svg": {
        fontSize: 18,
      },
    },
    "&:hover": {
      backgroundColor: "var(--color-brand-soft)",
      borderColor: "var(--color-brand)",
    },
    "&:active": {
      transform: "scale(0.98)",
    },
  },
  "@media (max-width: 760px)": {
    card: {
      borderRadius: "var(--radius-md, 14px)",
    },
    cardContent: {
      padding: "16px 16px 12px",
    },
    headerRow: {
      gap: 8,
    },
    headerActions: {
      gap: 6,
    },
    cardActions: {
      padding: "10px 12px 12px",
    },
    showButton: {
      flex: "1 1 100%",
    },
    secondaryButton: {
      flex: "1 1 100%",
    },
  },
  "@media (prefers-reduced-transparency: reduce)": {
    cardWithImage: {
      "& $statusChip, & $editButton, & $aiButton": {
        backdropFilter: "none",
      },
    },
  },
});
