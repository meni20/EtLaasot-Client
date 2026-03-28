import { makeStyles } from "@mui/styles";

export const useTraineePageStyles = makeStyles({
    container: {
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
        marginBottom: 20,
        animation: "fadeInDown 0.5s ease-out",
    },
    pageTitle: {
        fontFamily: "Rubik, sans-serif",
        fontWeight: 700,
        color: "#333",
        fontSize: "1.5rem",
    },
    createButton: {
        background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
        color: "#fff",
        fontWeight: 600,
        fontFamily: "Rubik, sans-serif",
        borderRadius: 14,
        padding: "10px 24px",
        boxShadow: "0 4px 16px rgba(154, 81, 136, 0.25)",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        "&:hover": {
            background: "linear-gradient(135deg, #7a3e6b 0%, #5a2d51 100%)",
            boxShadow: "0 8px 28px rgba(154, 81, 136, 0.4)",
            transform: "translateY(-2px)",
        },
        "&:active": {
            transform: "translateY(0) scale(0.98)",
        },
    },
    dataGridBox: {
        height: "calc(100vh - 200px)",
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        border: "1px solid #f0ecef",
        animation: "fadeInUp 0.6s ease-out",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
            boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
        },
        "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f8f4f9",
            fontWeight: 700,
            fontSize: 14,
            color: "#7a3e6b",
            fontFamily: "Rubik, sans-serif",
        },
        "& .MuiDataGrid-row": {
            fontFamily: "Rubik, sans-serif",
            cursor: "pointer",
            transition: "background 0.25s ease, transform 0.15s ease",
            "&:hover": {
                backgroundColor: "rgba(154,81,136,0.06)",
            },
        },
        "& .MuiDataGrid-cell": {
            fontSize: 13,
            borderColor: "#f5f0f3",
        },
        "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#faf8fa",
            borderTop: "1px solid #f0ecef",
        },
    },
});
