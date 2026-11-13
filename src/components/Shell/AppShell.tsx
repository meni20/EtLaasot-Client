import { useMemo, useState } from "react";
import { Box, GlobalStyles, useMediaQuery } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import { SideMenu } from "../SideMenu/SideMenu";
import {
  COLLAPSED_DRAWER_WIDTH,
  DRAWER_WIDTH,
} from "../SideMenu/SideMenu.interface";

interface AppShellProps {
  children: React.ReactNode;
}

const SHELL_BREAKPOINT = "(min-width:1024px)";

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isPersistentSideMenu = useMediaQuery(SHELL_BREAKPOINT);

  const desktopSideMenuWidth = useMemo(() => {
    if (!isPersistentSideMenu) return 0;
    return menuOpen ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH;
  }, [isPersistentSideMenu, menuOpen]);

  return (
    <Box
      dir="rtl"
      sx={{
        minHeight: "100dvh",
        width: "100%",
        overflowX: "clip",
        background:
          "linear-gradient(180deg, rgba(251, 248, 251, 0.92) 0%, #f7f7f8 100%)",
      }}
    >
      <GlobalStyles styles={{
        "@media (max-width: 767px)": {
          ".MuiDialog-paper:not(.MuiDialog-paperFullScreen)": {
            margin: 12,
            width: "calc(100% - 24px)",
            maxHeight: "calc(100dvh - 24px)",
          },
          ".MuiDialogTitle-root, .MuiDialogContent-root, .MuiDialogActions-root": {
            paddingInline: 16,
            overflowWrap: "anywhere",
          },
          ".MuiDialogActions-root": { flexWrap: "wrap" },
          ".MuiDialogActions-root .MuiButton-root": { minHeight: 44 },
        },
      }} />
      <Navbar
        title="עת לעשות"
        menuOpen={menuOpen}
        onMenuClick={() =>
          setMenuOpen((current) =>
            isPersistentSideMenu ? !current : true,
          )
        }
      />
      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        persistent={isPersistentSideMenu}
      />
      <Box
        component="main"
        sx={{
          minWidth: 0,
          width: isPersistentSideMenu
            ? `calc(100% - ${desktopSideMenuWidth}px)`
            : "100%",
          marginInlineStart: isPersistentSideMenu
            ? `${desktopSideMenuWidth}px`
            : 0,
          overflowX: "clip",
          "@media (max-width: 767px)": {
            width: "100%",
            marginInlineStart: 0,
            "& .MuiTableContainer-root": { maxWidth: "100%", overflowX: "auto", overscrollBehaviorInline: "contain" },
            "& .MuiButton-root": { minHeight: 44 },
            "& .MuiTypography-h3, & .MuiTypography-h4": {
              fontSize: "clamp(1.45rem, 6vw, 2rem)",
              overflowWrap: "anywhere",
            },
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
