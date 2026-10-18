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
        padding: "18px 20px 22px",
        boxShadow: "var(--shadow-xs, 0 1px 2px rgba(16,24,40,0.05))",
        border: "1px solid rgba(var(--color-primary-rgb), 0.12)",
        animation: "fadeInUp 220ms var(--ease-out, ease-out)",
        overflow: "hidden",

        /* FullCalendar overrides */
        "& .fc": {
            position: "relative" as const,
            zIndex: 1,
            color: "var(--color-text, #1d1d1f)",
        },
        "& .fc-toolbar": {
            display: "grid !important",
            gridTemplateColumns: "1fr minmax(240px, auto) 1fr",
            alignItems: "center",
            marginBottom: "18px !important",
            gap: 12,
            minHeight: 50,
        },
        "& .fc-toolbar-chunk": {
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 0,
        },
        "& .fc-toolbar-chunk:nth-child(1)": {
            justifySelf: "start",
        },
        "& .fc-toolbar-chunk:nth-child(2)": {
            justifySelf: "center",
            textAlign: "center" as const,
        },
        "& .fc-toolbar-chunk:nth-child(3)": {
            justifySelf: "end",
        },
        "& .fc-toolbar-title": {
            fontWeight: 800,
            fontSize: "clamp(1.35rem, 2.2vw, 1.85rem)",
            lineHeight: 1.25,
            color: "var(--color-primary-pressed, #57294c)",
            letterSpacing: "-0.015em",
            whiteSpace: "normal" as const,
            textWrap: "balance" as const,
        },
        "& .fc-button-group": {
            gap: 3,
            padding: 3,
            borderRadius: "var(--radius-md, 14px)",
            backgroundColor: "var(--color-primary-soft, #f7f1f5)",
            border: "1px solid rgba(var(--color-primary-rgb), 0.12)",
        },
        "& .fc-button-primary": {
            minHeight: "44px !important",
            background: "var(--color-surface, #fff)",
            color: "var(--color-primary)",
            border: "1px solid rgba(var(--color-primary-rgb), 0.18)",
            borderRadius: "var(--radius-sm, 10px) !important",
            fontWeight: 800,
            fontSize: 13,
            padding: "8px 15px",
            margin: "0 !important",
            transition:
                "background-color var(--transition-fast, 140ms ease), border-color var(--transition-fast, 140ms ease), color var(--transition-fast, 140ms ease), box-shadow var(--transition-fast, 140ms ease)",
            boxShadow: "none",
            "&:hover": {
                background: "var(--color-primary-selected, #efe3eb)",
                borderColor: "var(--color-primary-border, #d9bfd2)",
                color: "var(--color-primary-pressed, #57294c)",
            },
            "&:focus-visible": {
                boxShadow: "var(--shadow-focus, 0 0 0 3px rgba(var(--color-primary-rgb), 0.24))",
            },
            "&:disabled": {
                opacity: 0.46,
            },
        },
        "& .fc-prev-button, & .fc-next-button": {
            width: 44,
            minWidth: "44px !important",
            padding: "0 !important",
        },
        "& .fc-button-primary:not(:disabled).fc-button-active": {
            background: "var(--color-primary)",
            color: "#fff",
            borderColor: "var(--color-primary)",
            boxShadow: "none",
        },
        "& .fc-today-button": {
            borderRadius: "var(--radius-md, 14px) !important",
            backgroundColor: "var(--color-primary-soft, #f7f1f5)",
        },
        "& .fc-scrollgrid": {
            borderRadius: "var(--radius-md, 14px)",
            overflow: "hidden",
            border: "1px solid rgba(var(--color-primary-rgb), 0.13) !important",
        },
        "& .fc-col-header-cell": {
            backgroundColor: "var(--color-primary-soft, #f7f1f5)",
            fontWeight: 800,
            fontSize: 13,
            color: "var(--color-primary-pressed, #57294c)",
            padding: "11px 0",
            borderColor: "rgba(var(--color-primary-rgb), 0.1)",
        },
        "& .fc-col-header-cell-cushion": {
            padding: "3px 8px",
        },
        "& .fc-daygrid-day": {
            transition: "background-color var(--transition-fast, 140ms ease)",
            "&:hover": {
                backgroundColor: "rgba(var(--color-primary-rgb), 0.035)",
            },
        },
        "& .fc-daygrid-day-frame": {
            minHeight: "clamp(108px, 10vw, 148px)",
            padding: "3px 4px 8px",
        },
        "& .fc-daygrid-day-top": {
            minHeight: 48,
        },
        "& .fc-day-other": {
            backgroundColor: "rgba(var(--color-primary-rgb), 0.015)",
        },
        "& .fc-day-other .fc-daygrid-day-number": {
            opacity: 0.5,
        },
        "& .fc-daygrid-day-number": {
            fontWeight: 700,
            color: "var(--color-text, #1d1d1f)",
            fontSize: 13,
            padding: "7px 8px 5px",
            width: "100%",
        },
        "& .fc-daygrid-day.fc-day-today": {
            backgroundColor: "rgba(var(--color-primary-rgb), 0.055) !important",
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
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 7px rgba(var(--color-primary-rgb), 0.2)",
        },
        "& .fc-daygrid-event": {
            borderRadius: "9px !important",
            padding: "5px 8px !important",
            marginTop: "3px !important",
            fontSize: 12.25,
            fontWeight: 700,
            lineHeight: 1.3,
            cursor: "pointer",
            transition: "box-shadow var(--transition-fast, 140ms ease), filter var(--transition-fast, 140ms ease)",
            border: "1px solid rgba(255,255,255,0.26) !important",
            boxShadow: "0 2px 6px rgba(48,48,80,0.13)",
            "&:hover": {
                boxShadow: "0 4px 11px rgba(48,48,80,0.2)",
                filter: "brightness(1.04)",
            },
        },
        "& .fc-event-main": {
            overflow: "hidden",
        },
        "& .fc-event-time": {
            fontWeight: 800,
            marginInlineEnd: 4,
        },
        "& .fc-event-title": {
            fontWeight: 700,
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
            borderColor: "rgba(var(--color-primary-rgb), 0.09)",
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
    },
    calendarWrapperWithBackground: {
        "&::before": {
            content: '""',
            position: "absolute" as const,
            inset: 0,
            backgroundImage:
                "linear-gradient(rgba(255,255,255,0.64), rgba(250,247,250,0.69)), var(--calendar-background-image)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
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
            backgroundColor: "rgba(255, 255, 255, 0.16) !important",
        },
        "& .fc-daygrid-day:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.34) !important",
        },
        "& .fc-col-header-cell": {
            backgroundColor: "rgba(247, 241, 245, 0.84) !important",
            backdropFilter: "blur(4px)",
        },
        "& .fc-daygrid-day.fc-day-today": {
            backgroundColor: "rgba(var(--color-primary-rgb),0.1) !important",
        },
        "& .fc-event-main, & .fc-event-title, & .fc-event-time": {
            opacity: "1 !important",
            color: "#fff !important",
            textShadow: "0 1px 2px rgba(45,35,43,0.24)",
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
        maxWidth: 108,
        color: "var(--color-text-muted, #6e737a)",
        fontSize: "11.5px !important",
        fontWeight: "600 !important" as const,
        lineHeight: "1.25 !important" as const,
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
    "@media (max-width: 1100px)": {
        root: {
            paddingInline: 16,
        },
        header: {
            alignItems: "flex-start",
            flexWrap: "wrap" as const,
        },
        headerActions: {
            flex: "1 1 auto",
        },
        calendarWrapper: {
            padding: "18px 14px 20px",
            "& .fc-toolbar": {
                gridTemplateColumns: "minmax(190px, 1fr) minmax(220px, 300px) minmax(0, 1fr)",
                gap: 10,
            },
            "& .fc-toolbar-title": {
                fontSize: "1.3rem",
                maxWidth: 300,
            },
            "& .fc-daygrid-day-frame": {
                minHeight: 104,
            },
            "& .fc-daygrid-event": {
                padding: "4px 6px !important",
                fontSize: 11.5,
            },
        },
        hebrewDate: {
            maxWidth: 84,
            fontSize: "11px !important",
        },
    },
    "@media (max-width: 900px)": {
        header: {
            flexDirection: "column" as const,
        },
        headerActions: {
            width: "100%",
        },
        calendarWrapper: {
            "& .fc-toolbar": {
                gridTemplateColumns: "minmax(180px, 1fr) minmax(210px, 260px) minmax(0, 0.35fr)",
            },
            "& .fc-toolbar-title": {
                fontSize: "1.2rem",
                maxWidth: 220,
                whiteSpace: "pre-line" as const,
            },
            "& .fc-button-primary": {
                padding: "8px 11px",
            },
            "& .fc-daygrid-day-frame": {
                minHeight: 96,
            },
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
                display: "flex !important",
                alignItems: "stretch",
                flexDirection: "column" as const,
                gap: 10,
            },
            "& .fc-toolbar-chunk": {
                justifyContent: "center",
                justifySelf: "stretch",
            },
            "& .fc-toolbar-chunk:nth-child(2)": {
                order: -1,
            },
            "& .fc-toolbar-title": {
                fontSize: "1.12rem",
                textAlign: "center" as const,
                maxWidth: 220,
            },
            "& .fc-button-primary": {
                minHeight: "44px !important",
                padding: "6px 10px",
            },
            "& .fc-daygrid-day-frame": {
                minHeight: 94,
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
