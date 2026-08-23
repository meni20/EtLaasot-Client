import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useBranch } from "../../../contexts/useBranch";
import dashboardService from "../../../services/dashboard.service";
import type { ISuperAdminDashboardTotals } from "../../../interfaces/dashboard.interface";
import { useSuperAdminDashboardStyles } from "./SuperAdminDashboard.styles";

type SummaryMetric = {
  key: keyof ISuperAdminDashboardTotals;
  label: string;
  icon: ReactNode;
};

const SUMMARY_METRICS: SummaryMetric[] = [
  {
    key: "activeBranches",
    label: "סניפים פעילים",
    icon: <CorporateFareOutlinedIcon />,
  },
  {
    key: "activeVolunteers",
    label: "מתנדבים פעילים",
    icon: <VolunteerActivismOutlinedIcon />,
  },
  {
    key: "activeTrainees",
    label: "חניכים פעילים",
    icon: <SchoolOutlinedIcon />,
  },
  {
    key: "activeAssignments",
    label: "חונכויות פעילות",
    icon: <AccountTreeOutlinedIcon />,
  },
  {
    key: "unassignedTrainees",
    label: "חניכים ללא חונך",
    icon: <PersonOffOutlinedIcon />,
  },
  {
    key: "upcomingEvents",
    label: "אירועים קרובים",
    icon: <EventOutlinedIcon />,
  },
];

export const SuperAdminDashboardPage: React.FC = () => {
  const classes = useSuperAdminDashboardStyles();
  const navigate = useNavigate();
  const { switchBranch } = useBranch();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard", "super-admin"],
    queryFn: () => dashboardService.getSuperAdminDashboard(),
  });

  const openBranchDashboard = (branchId: string) => {
    switchBranch(branchId);
    navigate("/dashboard");
  };

  if (isLoading) {
    return (
      <Box className={classes.root}>
        <Box className={classes.state}>
          <CircularProgress size={34} sx={{ color: "var(--color-primary)" }} />
          <Typography>טוען נתונים ארגוניים...</Typography>
        </Box>
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box className={classes.root}>
        <Box className={classes.state} role="alert">
          <Typography>לא הצלחנו לטעון את נתוני הסקירה הארגונית.</Typography>
          <Button
            variant="outlined"
            className={classes.retryButton}
            onClick={() => refetch()}
          >
            ניסיון נוסף
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography component="h1" className={classes.title}>
          סקירה ארגונית
        </Typography>
        <Typography className={classes.subtitle}>
          תמונת מצב עדכנית של כל הסניפים הפעילים
        </Typography>
      </Box>

      <Box className={classes.summaryGrid}>
        {SUMMARY_METRICS.map((metric) => (
          <Box key={metric.key} className={classes.summaryCard}>
            <Box className={classes.summaryIcon}>{metric.icon}</Box>
            <Typography className={classes.summaryValue}>
              {data.totals[metric.key]}
            </Typography>
            <Typography className={classes.summaryLabel}>
              {metric.label}
            </Typography>
          </Box>
        ))}
      </Box>

      <Paper className={classes.tableSection} elevation={0}>
        <Box className={classes.tableHeader}>
          <Typography component="h2" className={classes.sectionTitle}>
            השוואה בין סניפים
          </Typography>
        </Box>

        {data.branches.length === 0 ? (
          <Box className={classes.state}>
            <Typography>אין סניפים פעילים להצגה</Typography>
          </Box>
        ) : (
          <TableContainer className={classes.tableContainer}>
            <Table className={classes.table} aria-label="השוואה בין סניפים">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.headingCell}>סניף</TableCell>
                  <TableCell className={classes.headingCell}>מתנדבים</TableCell>
                  <TableCell className={classes.headingCell}>חניכים</TableCell>
                  <TableCell className={classes.headingCell}>
                    חונכויות
                  </TableCell>
                  <TableCell className={classes.headingCell}>
                    ללא חונך
                  </TableCell>
                  <TableCell className={classes.headingCell}>
                    אירועים קרובים
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.branches.map((branch) => (
                  <TableRow
                    hover
                    key={branch.branchId}
                    className={classes.tableRow}
                  >
                    <TableCell className={classes.bodyCell}>
                      <Tooltip title="מעבר לדשבורד הסניף">
                        <ButtonBase
                          className={classes.branchButton}
                          onClick={() => openBranchDashboard(branch.branchId)}
                          aria-label={`מעבר לדשבורד ${branch.branchName}`}
                        >
                          {branch.branchName}
                          <DashboardOutlinedIcon
                            className={classes.branchButtonIcon}
                          />
                        </ButtonBase>
                      </Tooltip>
                    </TableCell>
                    <TableCell className={classes.bodyCell}>
                      {branch.activeVolunteers}
                    </TableCell>
                    <TableCell className={classes.bodyCell}>
                      {branch.activeTrainees}
                    </TableCell>
                    <TableCell className={classes.bodyCell}>
                      {branch.activeAssignments}
                    </TableCell>
                    <TableCell className={classes.bodyCell}>
                      {branch.unassignedTrainees}
                    </TableCell>
                    <TableCell className={classes.bodyCell}>
                      {branch.upcomingEvents}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};
