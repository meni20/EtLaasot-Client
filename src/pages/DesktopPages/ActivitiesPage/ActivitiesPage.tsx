import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import activityService from "../../../services/activity.service";
import userService from "../../../services/user.service";
import eventService from "../../../services/event.service";
import { useBranch } from "../../../contexts/useBranch";
import { useActivityAdminStyles } from "./ActivitiesPage.styles";
import { formatDateTime, formatDurationMinutes } from "../../../utils/data.utillity";
import type {
  IActivityAdminFilters,
  IVolunteerActivity,
} from "../../../interfaces/activity.interface";
import type { IUser } from "../../../interfaces/user.interface";
import type { IEvent } from "../../../interfaces/event.interface";

export const ActivitiesPage: React.FC = () => {
  const styles = useActivityAdminStyles();
  const { activeBranch, availableBranches } = useBranch();
  const [filters, setFilters] = useState<IActivityAdminFilters>({
    branchId: activeBranch ?? "",
    status: undefined,
    volunteerId: "",
    traineeId: "",
    eventId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      branchId:
        current.branchId && current.branchId !== "" ? current.branchId : activeBranch ?? "",
    }));
  }, [activeBranch]);

  const normalizedFilters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined),
      ) as IActivityAdminFilters,
    [filters],
  );

  const selectedBranchId =
    (normalizedFilters.branchId as string | undefined) ?? activeBranch ?? undefined;

  const { data: activities = [], isLoading, isFetching } = useQuery<
    IVolunteerActivity[]
  >({
    queryKey: ["activities", "admin", normalizedFilters],
    queryFn: () => activityService.getAdminActivities(normalizedFilters),
  });

  const { data: volunteers = [] } = useQuery<IUser[]>({
    queryKey: ["volunteers", selectedBranchId],
    queryFn: () => userService.getAllVolunteers(selectedBranchId),
  });

  const { data: trainees = [] } = useQuery<IUser[]>({
    queryKey: ["trainees", selectedBranchId],
    queryFn: () => userService.getAllTrainees(selectedBranchId),
  });

  const { data: events = [] } = useQuery<IEvent[]>({
    queryKey: ["events", "admin-filter", selectedBranchId],
    queryFn: () => eventService.getAllEvents(selectedBranchId),
  });

  const rows = useMemo(
    () =>
      activities.map((activity) => ({
        id: activity.id,
        volunteerName: activity.volunteer?.name ?? activity.volunteerId,
        traineeName: activity.trainee?.name ?? activity.traineeId,
        eventName: activity.event?.name ?? activity.eventId,
        branchName: activity.branch?.name ?? activity.branchId ?? "-",
        startTime: activity.startTime,
        endTime: activity.endTime,
        duration: activity.durationFormatted ?? formatDurationMinutes(activity.durationMinutes),
        status: activity.status,
        notes: activity.notes?.trim() || "-",
        timezone: activity.timezone,
      })),
    [activities],
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "volunteerName", headerName: "מתנדב", flex: 1 },
      { field: "traineeName", headerName: "חניך", flex: 1 },
      { field: "eventName", headerName: "אירוע", flex: 1.1 },
      { field: "branchName", headerName: "סניף", flex: 1 },
      {
        field: "startTime",
        headerName: "התחלה",
        flex: 1.2,
        renderCell: (params) =>
          formatDateTime(params.row.startTime, params.row.timezone),
      },
      {
        field: "endTime",
        headerName: "סיום",
        flex: 1.2,
        renderCell: (params) =>
          params.row.endTime
            ? formatDateTime(params.row.endTime, params.row.timezone)
            : "-",
      },
      { field: "duration", headerName: "משך", flex: 0.9 },
      {
        field: "status",
        headerName: "סטטוס",
        flex: 0.9,
        renderCell: (params) => (
          <Chip
            size="small"
            color={params.value === "ACTIVE" ? "warning" : "success"}
            label={params.value}
          />
        ),
      },
      { field: "notes", headerName: "הערות", flex: 1.4 },
    ],
    [],
  );

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography className={styles.pageTitle}>ניהול פעילויות מתנדבים</Typography>
        <Typography className={styles.subtitle}>
          צפייה בכל הסשנים, כולל שעות, סטטוס, חניך, אירוע והערות.
        </Typography>
      </Box>

      <Box className={styles.filtersCard}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              select
              fullWidth
              label="סניף"
              value={filters.branchId ?? ""}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  branchId: event.target.value,
                  volunteerId: "",
                  traineeId: "",
                  eventId: "",
                }))
              }
            >
              <MenuItem value="">כל הסניפים</MenuItem>
              {availableBranches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              select
              fullWidth
              label="מתנדב"
              value={filters.volunteerId ?? ""}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  volunteerId: event.target.value,
                }))
              }
            >
              <MenuItem value="">כולם</MenuItem>
              {volunteers.map((volunteer) => (
                <MenuItem key={volunteer.id} value={volunteer.id}>
                  {volunteer.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              select
              fullWidth
              label="חניך"
              value={filters.traineeId ?? ""}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  traineeId: event.target.value,
                }))
              }
            >
              <MenuItem value="">כולם</MenuItem>
              {trainees.map((trainee) => (
                <MenuItem key={trainee.id} value={trainee.id}>
                  {trainee.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              select
              fullWidth
              label="אירוע"
              value={filters.eventId ?? ""}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  eventId: event.target.value,
                }))
              }
            >
              <MenuItem value="">כולם</MenuItem>
              {events.map((event) => (
                <MenuItem key={event.id} value={event.id}>
                  {event.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 1.5 }}>
            <TextField
              select
              fullWidth
              label="סטטוס"
              value={filters.status ?? ""}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  status: (event.target.value || undefined) as
                    | "ACTIVE"
                    | "COMPLETED"
                    | undefined,
                }))
              }
            >
              <MenuItem value="">הכול</MenuItem>
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="COMPLETED">COMPLETED</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 1.25 }}>
            <TextField
              fullWidth
              type="date"
              label="מתאריך"
              InputLabelProps={{ shrink: true }}
              value={filters.startDate ?? ""}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  startDate: event.target.value,
                }))
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 1.25 }}>
            <TextField
              fullWidth
              type="date"
              label="עד תאריך"
              InputLabelProps={{ shrink: true }}
              value={filters.endDate ?? ""}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  endDate: event.target.value,
                }))
              }
            />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() =>
              setFilters({
                branchId: activeBranch ?? "",
                status: undefined,
                volunteerId: "",
                traineeId: "",
                eventId: "",
                startDate: "",
                endDate: "",
              })
            }
          >
            איפוס מסננים
          </Button>
        </Stack>
      </Box>

      <Box className={styles.dataGridBox}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading || isFetching}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
        />
      </Box>

      {!isLoading && !isFetching && rows.length === 0 && (
        <Typography className={styles.emptyState}>
          לא נמצאו פעילויות למסננים שנבחרו.
        </Typography>
      )}

      {(isLoading || isFetching) && rows.length === 0 && (
        <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
          <CircularProgress size={26} sx={{ color: "#9a5188" }} />
        </Stack>
      )}
    </Box>
  );
};
