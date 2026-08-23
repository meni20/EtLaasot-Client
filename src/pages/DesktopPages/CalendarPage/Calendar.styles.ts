import { makeStyles } from "@mui/styles";

export const useCalendarStyles = makeStyles({
    root: {
        padding: "calc(var(--shell-top-inset, 68px) + 24px) 24px 32px",
        direction: "rtl",
        minHeight: "100dvh",
        background:
            "linear-gradient(180deg, var(--color-canvas-warm, #faf9fb) 0%, var(--color-canvas, #f5f6f8) 100%)",
        animation: "fadeIn 180ms var(--ease-out, ease-out)",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        marginBottom: 20,
        maxWidth: 1480,
        marginInline: "auto",
    },
    pageTitle: {
        fontWeight: 800,
        color: "var(--color-text, #1d1d1f)",
        fontSize: "clamp(1.55rem, 2.2vw, 2.1rem)",
        lineHeight: 1.12,
        letterSpacing: "-0.01em",
    },
    eventsButton: {
        minHeight: 44,
        color: "var(--color-brand)",
        borderColor: "var(--color-border, #dadde3)",
        backgroundColor: "var(--color-surface-elevated, rgba(255,255,255,0.82))",
        backdropFilter: "blur(18px) saturate(160%)",
        borderRadius: "var(--radius-md, 14px)",
        padding: "9px 18px",
        fontWeight: 700,
        textTransform: "none" as const,
        transition:
            "transform var(--transition-fast, 140ms ease), border-color var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease), box-shadow var(--transition-fast, 140ms ease)",
        "& .MuiButton-startIcon": {
            marginLeft: 6,
            marginRight: 0,
        },
        "&:hover": {
            borderColor: "var(--color-brand)",
            backgroundColor: "var(--color-brand-soft)",
            boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16,24,40,0.07))",
        },
        "&:active": {
            transform: "scale(0.98)",
        },
    },
    headerActions: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 10,
        flexWrap: "wrap" as const,
    },
    hiddenFileInput: {
        display: "none",
    },
    removeBackgroundButton: {
        width: 44,
        height: 44,
        color: "var(--color-danger, #b42318)",
        border: "1px solid rgba(180, 35, 24, 0.24)",
        backgroundColor: "var(--color-surface, #fff)",
        "&:hover": {
            backgroundColor: "var(--color-danger-soft, #fff1f0)",
            borderColor: "rgba(180, 35, 24, 0.42)",
        },
    },
    backgroundAlert: {
        marginBottom: 16,
        borderRadius: "var(--radius-md, 14px)",
        maxWidth: 1480,
        marginInline: "auto",
    },
    backgroundLoading: {
        position: "absolute" as const,
        top: 14,
        left: 18,
        zIndex: 2,
        fontSize: 12,
        fontWeight: 700,
        color: "var(--color-text-muted, #6e737a)",
        backgroundColor: "var(--color-surface-elevated, rgba(255,255,255,0.82))",
        border: "1px solid var(--color-border-subtle, #e9ebef)",
        borderRadius: 999,
        padding: "5px 10px",
        backdropFilter: "blur(14px)",
    },
    calendarWrapper: {
        position: "relative" as const,
        maxWidth: 1480,
        marginInline: "auto",
        background: "var(--color-surface, #fff)",
        borderRadius: "var(--radius-xl, 22px)",
        padding: "20px 24px 24px",
        boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16,24,40,0.07))",
        border: "1px solid var(--color-border-subtle, #e9ebef)",
        animation: "fadeInUp 220ms var(--ease-out, ease-out)",
        transition: "box-shadow var(--transition-normal, 180ms ease), border-color var(--transition-normal, 180ms ease)",
        overflow: "hidden",
        "&:hover": {
            boxShadow: "var(--shadow-md, 0 12px 34px rgba(16,24,40,0.10))",
            borderColor: "var(--color-border, #dadde3)",
        },

        /* FullCalendar overrides */
        "& .fc": {
            position: "relative" as const,
            zIndex: 1,
            color: "var(--color-text, #1d1d1f)",
        },
        "& .fc-toolbar": {
            marginBottom: "16px !important",
            flexWrap: "wrap",
            gap: 8,
        },
        "& .fc-toolbar-title": {
            fontWeight: 800,
            fontSize: "1.35rem",
            color: "var(--color-text, #1d1d1f)",
        },
        "& .fc-button-group": {
            gap: 4,
        },
        "& .fc-button-primary": {
            minHeight: "40px !important",
            background: "var(--color-surface, #fff)",
            color: "var(--color-primary)",
            border: "1px solid var(--color-border, #dadde3)",
            borderRadius: "var(--radius-sm, 10px) !important",
            fontWeight: 800,
            fontSize: 13,
            padding: "7px 14px",
            transition:
                "transform var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease), border-color var(--transition-fast, 140ms ease), box-shadow var(--transition-fast, 140ms ease)",
            boxShadow: "none",
            "&:hover": {
                background: "var(--color-primary-soft)",
                borderColor: "var(--color-primary)",
                boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16,24,40,0.07))",
            },
            "&:active": {
                transform: "scale(0.97)",
            },
            "&:focus": {
                boxShadow: "0 0 0 3px rgba(var(--color-primary-rgb), 0.20)",
            },
            "&:disabled": {
                opacity: 0.5,
            },
        },
        "& .fc-button-primary:not(:disabled).fc-button-active": {
            background: "var(--color-primary)",
            color: "#fff",
            borderColor: "var(--color-primary)",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.14)",
        },
        "& .fc-today-button": {
            borderRadius: "10px !important",
        },
        "& .fc-scrollgrid": {
            borderRadius: "var(--radius-lg, 18px)",
            overflow: "hidden",
            border: "1px solid var(--color-border-subtle, #e9ebef) !important",
        },
        "& .fc-col-header-cell": {
            backgroundColor: "var(--color-surface-muted, #f0f2f4)",
            fontWeight: 700,
            fontSize: 13,
            color: "var(--color-text-secondary, #51565c)",
            padding: "10px 0",
            borderColor: "var(--color-border-subtle, #e9ebef)",
        },
        "& .fc-daygrid-day": {
            transition: "background-color var(--transition-fast, 140ms ease)",
            "&:hover": {
                backgroundColor: "rgba(var(--color-primary-rgb), 0.035)",
            },
        },
        "& .fc-daygrid-day-number": {
            fontWeight: 700,
            color: "var(--color-text, #1d1d1f)",
            fontSize: 13,
            padding: "6px 10px 4px",
        },
        "& .fc-daygrid-day.fc-day-today": {
            backgroundColor: "rgba(var(--color-primary-rgb), 0.07) !important",
        },
        "& .fc-daygrid-day.fc-day-today .fc-daygrid-day-number": {
            background: "transparent",
            color: "inherit",
            borderRadius: 0,
            width: "auto",
            height: "auto",
            display: "block",
        },
        "& .fc-daygrid-day.fc-day-today $gregorianDate": {
            background: "var(--color-primary)",
            color: "#fff",
            borderRadius: "50%",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        "& .fc-daygrid-event": {
            borderRadius: "8px !important",
            padding: "3px 8px !important",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "transform var(--transition-fast, 140ms ease), box-shadow var(--transition-fast, 140ms ease)",
            border: "none !important",
            "&:hover": {
                boxShadow: "0 5px 14px rgba(var(--color-primary-rgb),0.22)",
            },
        },
        "& .fc-daygrid-more-link": {
            fontWeight: 700,
            color: "var(--color-brand)",
            fontSize: 12,
            "&:hover": {
                color: "var(--color-brand-hover)",
            },
        },
        "& .fc-daygrid-body td, & .fc-daygrid-body th, & .fc-scrollgrid td, & .fc-scrollgrid th":
        {
            borderColor: "var(--color-border-subtle, #e9ebef)",
        },
        "& .fc-popover": {
            borderRadius: "var(--radius-lg, 18px)",
            border: "1px solid var(--color-border-subtle, #e9ebef)",
            boxShadow: "var(--shadow-lg, 0 24px 64px rgba(16,24,40,0.15))",
            overflow: "hidden",
        },
        "& .fc-popover-header": {
            backgroundColor: "var(--color-surface-muted, #f0f2f4)",
            color: "var(--color-text, #1d1d1f)",
            fontWeight: 700,
        },
        "@media (hover: hover) and (pointer: fine)": {
            "& .fc-button-primary:hover": {
                transform: "translateY(-1px)",
            },
            "& .fc-daygrid-event:hover": {
                transform: "scale(1.03)",
            },
        },
    },
    calendarWrapperWithBackground: {
        "&::before": {
            content: '""',
            position: "absolute" as const,
            inset: 0,
            backgroundImage: "var(--calendar-background-image)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.42,
            pointerEvents: "none" as const,
            zIndex: 0,
        },
        "&::after": {
            content: '""',
            position: "absolute" as const,
            inset: 0,
            background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.76), rgba(245, 246, 248, 0.82))",
            pointerEvents: "none" as const,
            zIndex: 0,
        },
        "& .fc-view-harness, & .fc-view, & .fc-scrollgrid, & .fc-scrollgrid table, & .fc-daygrid-body, & .fc-daygrid-body table":
        {
            backgroundColor: "transparent !important",
        },
        "& .fc-scrollgrid-section, & .fc-scrollgrid td, & .fc-scrollgrid th": {
            backgroundColor: "transparent !important",
        },
        "& .fc-daygrid-day, & .fc-daygrid-day-frame": {
            backgroundColor: "rgba(255, 255, 255, 0.12) !important",
        },
        "& .fc-daygrid-day:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.28) !important",
        },
        "& .fc-col-header-cell": {
            backgroundColor: "rgba(255, 255, 255, 0.82) !important",
            backdropFilter: "blur(2px)",
        },
        "& .fc-daygrid-day.fc-day-today": {
            backgroundColor: "rgba(var(--color-primary-rgb),0.18) !important",
        },
        "& .fc-event, & .fc-daygrid-event": {
            backgroundColor: "var(--color-primary) !important",
            borderColor: "var(--color-primary-dark) !important",
            opacity: "1 !important",
            color: "#fff !important",
        },
        "& .fc-event-main, & .fc-event-title, & .fc-event-time": {
            opacity: "1 !important",
            color: "#fff !important",
            textShadow: "0 1px 1px rgba(45, 35, 43, 0.28)",
        },
    },
    dayNumberContent: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "flex-start",
        gap: 2,
        lineHeight: 1.1,
        direction: "rtl",
    },
    gregorianDate: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 20,
        minHeight: 20,
        fontSize: "13px !important",
        fontWeight: "700 !important" as const,
        color: "var(--color-text, #1d1d1f)",
    },
    hebrewDate: {
        display: "block",
        maxWidth: 86,
        color: "var(--color-text-muted, #6e737a)",
        fontSize: "10.5px !important",
        fontWeight: "600 !important" as const,
        lineHeight: "1.15 !important" as const,
        whiteSpace: "nowrap" as const,
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    loadingBox: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 400,
    },
    emptyState: {
        textAlign: "center",
        padding: "60px 20px",
        color: "var(--color-text-muted, #6e737a)",
        fontSize: 15,
    },
    "@media (min-width: 1024px)": {
        root: {
            paddingInline: 32,
        },
    },
    "@media (max-width: 760px)": {
        root: {
            padding:
                "calc(var(--shell-top-inset, 60px) + 12px) 10px calc(var(--shell-bottom-inset, 0px) + 20px)",
            overflowX: "hidden",
        },
        header: {
            alignItems: "flex-start",
            flexDirection: "column" as const,
        },
        headerActions: {
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "stretch",
        },
        eventsButton: {
            flex: "1 1 100%",
            minHeight: 44,
            justifyContent: "center",
        },
        hebrewDate: {
            display: "none",
        },
        calendarWrapper: {
            padding: "16px 12px 18px",
            overflowX: "auto" as const,
            WebkitOverflowScrolling: "touch",
            borderRadius: "var(--radius-lg, 18px)",
            "& .fc": {
                minWidth: 620,
            },
            "& .fc-toolbar": {
                alignItems: "stretch",
                flexDirection: "column" as const,
            },
            "& .fc-toolbar-title": {
                fontSize: "1.12rem",
                textAlign: "center" as const,
            },
            "& .fc-button-primary": {
                minHeight: "40px !important",
                padding: "6px 10px",
            },
        },
    },
    "@media (prefers-reduced-transparency: reduce)": {
        eventsButton: {
            backgroundColor: "var(--color-surface, #fff)",
            backdropFilter: "none",
        },
        backgroundLoading: {
            backgroundColor: "var(--color-surface, #fff)",
            backdropFilter: "none",
        },
        calendarWrapperWithBackground: {
            "& .fc-col-header-cell": {
                backdropFilter: "none",
            },
        },
    },
});
