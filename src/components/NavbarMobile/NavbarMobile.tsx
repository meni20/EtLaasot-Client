import { useStyles } from "./NavbarMobile.styles";
import { AppBar, Toolbar, Typography } from "@mui/material";

export const NavbarMobile: React.FC = () => {
  const styles = useStyles();
  return (
    <AppBar position="fixed" className={styles.appBar} component="header">
      <Toolbar className={styles.toolbar} aria-label="סרגל ניווט לנייד">
        <Typography variant="h5" component="div" className={styles.title}>
          עת לעשות
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
