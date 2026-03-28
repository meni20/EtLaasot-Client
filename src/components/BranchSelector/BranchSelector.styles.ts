import { makeStyles } from "@mui/styles";

export const useBranchSelectorStyles = makeStyles({
    select: {
        color: "#fff",
        fontFamily: "Rubik, sans-serif",
        fontSize: "0.9rem",
        borderRadius: 10,
        transition: "all 0.3s ease",
        "& .MuiSelect-icon": {
            color: "#fff",
            transition: "transform 0.3s ease",
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.4)",
            transition: "border-color 0.3s ease",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.7)",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
        },
        "&:hover .MuiSelect-icon": {
            transform: "translateY(2px)",
        },
    },
});
