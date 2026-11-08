import { branding } from "../config/branding";

export const designTokens = {
  color: branding.colors,
  radius: {
    control: 10,
    card: 14,
    panel: 18,
    dialog: 22,
    sheet: 26,
    pill: 999,
  },
  shadow: {
    xs: "0 1px 2px rgba(16, 24, 40, 0.05)",
    sm: "0 3px 12px rgba(16, 24, 40, 0.07)",
    md: "0 12px 34px rgba(16, 24, 40, 0.10)",
    lg: "0 24px 64px rgba(16, 24, 40, 0.15)",
    focus: "0 0 0 3px rgba(var(--color-primary-rgb), 0.24)",
  },
  motion: {
    instant: "100ms",
    fast: "140ms",
    normal: "180ms",
    slow: "240ms",
    easeOut: "cubic-bezier(0.23, 1, 0.32, 1)",
    easeInOut: "cubic-bezier(0.77, 0, 0.175, 1)",
    drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
  },
  layout: {
    desktopHeader: 68,
    desktopSidebar: 264,
    desktopSidebarCollapsed: 84,
    contentMaxWidth: 1480,
    mobileHeader: 60,
    mobileNav: 72,
  },
  chart: branding.chart,
} as const;

export const appFontFamily =
  '"Noto Sans Hebrew", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
