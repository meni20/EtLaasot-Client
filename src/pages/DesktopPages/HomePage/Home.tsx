import { Box, Typography } from "@mui/material";
import { LineChart } from "../../../components/LIneChart/LineChart";
import { useHomeStyles } from "./Home.styles";

export const HomePage: React.FC = () => {
  const classes = useHomeStyles();

  return (
    <Box className={classes.root}>
      <Typography className={classes.pageTitle}>סקירה כללית</Typography>
      <Box className={classes.chartCard}>
        <Typography className={classes.chartTitle}>
          משתתפים לפי אירוע
        </Typography>
        <LineChart />
      </Box>
    </Box>
  );
};
