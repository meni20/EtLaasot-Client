import type { ReactNode } from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

interface SettingsRowProps {
  icon: ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
  trailing?: ReactNode;
  destructive?: boolean;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  title,
  description,
  onClick,
  trailing,
  destructive = false,
}) => {
  const content = (
    <>
      <Box className="settings-row__icon" aria-hidden="true">
        {icon}
      </Box>
      <Box className="settings-row__copy">
        <Typography className="settings-row__title">{title}</Typography>
        {description && (
          <Typography className="settings-row__description">
            {description}
          </Typography>
        )}
      </Box>
      <Box className="settings-row__trailing">
        {trailing ?? (onClick ? <ChevronRightRoundedIcon aria-hidden="true" /> : null)}
      </Box>
    </>
  );

  const sharedSx = {
    width: "100%",
    minHeight: 68,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    px: 2,
    py: 1.25,
    color: destructive ? "var(--color-danger)" : "var(--color-text)",
    // Emotion's RTL transformer mirrors this declaration in the rendered CSS.
    textAlign: "left",
    borderRadius: "var(--radius-md)",
    transition:
      "background-color var(--transition-fast), box-shadow var(--transition-fast)",
    "& .settings-row__icon": {
      width: 42,
      height: 42,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-sm)",
      color: destructive ? "var(--color-danger)" : "var(--color-primary)",
      backgroundColor: destructive
        ? "var(--color-danger-soft)"
        : "var(--color-primary-soft)",
      "& svg": { fontSize: 22 },
    },
    "& .settings-row__copy": { flex: "1 1 auto", minWidth: 0 },
    "& .settings-row__title": {
      color: "inherit",
      fontFamily: "inherit",
      fontWeight: 700,
      fontSize: "0.96rem",
      lineHeight: 1.45,
    },
    "& .settings-row__description": {
      mt: 0.25,
      color: destructive ? "var(--color-danger)" : "var(--color-text-secondary)",
      fontFamily: "inherit",
      fontSize: "0.82rem",
      lineHeight: 1.45,
    },
    "& .settings-row__trailing": {
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      color: destructive ? "var(--color-danger)" : "var(--color-text-muted)",
    },
    ...(trailing
      ? {
          "@media (max-width: 640px)": {
            flexWrap: "wrap",
            "& .settings-row__trailing": {
              width: "calc(100% - 54px)",
              marginInlineStart: "auto",
              "& .MuiInputBase-root": { width: "100%", maxWidth: "none" },
            },
          },
        }
      : {}),
    "&:focus-visible": {
      outline: "none",
      boxShadow: "var(--shadow-focus)",
    },
    "@media (prefers-reduced-motion: reduce)": { transition: "none" },
  } as const;

  if (!onClick) {
    return <Box sx={sharedSx}>{content}</Box>;
  }

  return (
    <ButtonBase
      onClick={onClick}
      aria-label={title}
      sx={{
        ...sharedSx,
        justifyContent: "flex-start",
        "@media (hover: hover) and (pointer: fine)": {
          "&:hover": {
            backgroundColor: destructive
              ? "var(--color-danger-soft)"
              : "var(--color-primary-soft)",
          },
        },
        "&:active": {
          backgroundColor: destructive
            ? "var(--color-danger-soft)"
            : "var(--color-primary-selected)",
        },
      }}
    >
      {content}
    </ButtonBase>
  );
};
