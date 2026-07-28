import { makeStyles } from "@mui/styles";

export const useMentorAssignmentStyles = makeStyles({
    root: {
        padding: "88px 24px 24px",
        direction: "rtl",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        animation: "fadeIn 0.4s ease-out",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        animation: "fadeInDown 0.5s ease-out",
    },
    title: {
        fontFamily: "Rubik, sans-serif",
        fontWeight: 700,
        color: "#333",
    },
    card: {
        background: "#fff",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        border: "1px solid #f0ecef",
        marginBottom: 24,
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        animation: "fadeInUp 0.5s ease-out both",
        "&:hover": {
            boxShadow: "0 8px 28px rgba(154, 81, 136, 0.1)",
            transform: "translateY(-2px)",
        },
    },
    sectionTitle: {
        fontFamily: "Rubik, sans-serif",
        fontWeight: 600,
        color: "#333",
        marginBottom: 16,
        fontSize: "1.1rem",
    },
    mentorRow: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 0",
        borderBottom: "1px solid #f0ecef",
        transition: "background 0.2s ease, padding 0.2s ease",
        borderRadius: 8,
        "&:hover": {
            backgroundColor: "rgba(154, 81, 136, 0.03)",
            paddingRight: 8,
            paddingLeft: 8,
        },
        "&:last-child": {
            borderBottom: "none",
        },
    },
    mentorName: {
        fontFamily: "Rubik, sans-serif",
        fontWeight: 600,
        color: "#333",
        minWidth: 120,
    },
    traineesChips: {
        display: "flex",
        flexWrap: "wrap" as const,
        gap: 6,
    },
    chip: {
        backgroundColor: "#f3e8f0",
        color: "#9a5188",
        borderRadius: 20,
        padding: "4px 14px",
        fontSize: "0.85rem",
        fontFamily: "Rubik, sans-serif",
        transition: "all 0.2s ease",
        "&:hover": {
            backgroundColor: "#ead3e4",
            transform: "scale(1.05)",
        },
    },
    overloadChip: {
        backgroundColor: "#fce4ec",
        color: "#c62828",
    },
    unassignedCard: {
        background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
        borderRadius: 14,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "Rubik, sans-serif",
        fontSize: "0.9rem",
        color: "#e65100",
        marginBottom: 8,
        borderRight: "4px solid #e65100",
        animation: "slideInRight 0.4s ease-out both",
    },
    addButton: {
        background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
        color: "#fff",
        borderRadius: 14,
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        "&:hover": {
            background: "linear-gradient(135deg, #7a3e6b 0%, #5a2d51 100%)",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 16px rgba(154, 81, 136, 0.3)",
        },
    },
    dialogContent: {
        minWidth: 400,
        padding: 20,
    },
    selectField: {
        marginBottom: 16,
        width: "100%",
    },
    "@media (max-width: 760px)": {
        root: {
            padding: "72px 12px 16px",
            overflowX: "hidden",
        },
        header: {
            alignItems: "flex-start",
            flexDirection: "column" as const,
            gap: 12,
        },
        card: {
            padding: 16,
            borderRadius: 16,
        },
        mentorRow: {
            alignItems: "flex-start",
            flexDirection: "column" as const,
        },
        mentorName: {
            minWidth: 0,
        },
        dialogContent: {
            minWidth: 0,
            width: "min(100%, 360px)",
            padding: 16,
        },
    },
});
