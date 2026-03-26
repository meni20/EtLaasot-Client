import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useLocation, useNavigate } from "react-router-dom";

export default function MobileSideMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  const value = location.pathname;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: 500,
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: 4,
        zIndex: 1000,
      }}
    >
      <Tabs
        value={value}
        onChange={(_, newValue) => navigate(newValue)}
        centered
        variant="fullWidth"
      >
        <Tab label="Home" value="/home" />
        <Tab label="Calendar" value="/calendar" />
        <Tab label="Events" value="/events" />
      </Tabs>
    </Box>
  );
}
