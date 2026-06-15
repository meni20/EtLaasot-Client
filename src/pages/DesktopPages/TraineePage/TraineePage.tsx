import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { COLUMNS } from "./Trainee.constants";
import { useQuery } from "@tanstack/react-query";
import userService from "../../../services/user.service";
import type { IUser } from "../../../interfaces/user.interface";
import { CreateTrainee } from "../../../components/CreateTrainee/CreateTrainee";
import { VolunteerDetails } from "../../../components/VolunteerDetails/VolunteerDetails";
import { useBranch } from "../../../contexts/useBranch";
import { useTraineePageStyles } from "./TraineePage.styles";

const avatarLetter = (name?: string) => name?.trim()?.[0]?.toUpperCase() || "?";

type TraineeTableRow = Pick<
  IUser,
  "id" | "name" | "age" | "gender" | "phoneNumber" | "email" | "address"
> & {
  originalTrainee: IUser;
};

const getOriginalTrainee = (row: TraineeTableRow | IUser) =>
  "originalTrainee" in row ? row.originalTrainee : row;

export const TraineePage: React.FC = () => {
  const styles = useTraineePageStyles();
  const { activeBranch } = useBranch();
  const [open, setOpen] = useState<boolean>(false);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] =
    useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrainee, setSelectedTrainee] = useState<IUser | null>(
    null
  );

  const {
    data: allTrainees,
    isFetching: isFetchingTrainees,
    isError,
  } = useQuery<IUser[]>({
    queryKey: ["trainees", activeBranch],
    queryFn: () => userService.getAllTrainees(activeBranch ?? undefined),
    enabled: !!activeBranch,
  });

  const openTraineeDetails = (trainee: IUser) => {
    setSelectedTrainee(trainee);
    setIsDetailsPanelOpen(true);
  };

  const closeTraineeDetails = () => {
    setIsDetailsPanelOpen(false);
    setSelectedTrainee(null);
  };

  const rowsData = useMemo<TraineeTableRow[]>(() => {
    return (
      allTrainees?.map((trainee: IUser) => ({
        id: trainee.id,
        name: trainee.name,
        age: trainee.age,
        gender: trainee.gender ?? "",
        phoneNumber: trainee.phoneNumber,
        email: trainee.email,
        address: trainee.address,
        originalTrainee: trainee,
      })) ?? []
    );
  }, [allTrainees]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return rowsData;

    return rowsData.filter((trainee) =>
      [
        trainee.name,
        trainee.id,
        trainee.phoneNumber,
        trainee.email,
        trainee.address,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
    );
  }, [rowsData, searchTerm]);

  const columns = useMemo<GridColDef[]>(
    () => [
      COLUMNS[0],
      {
        ...COLUMNS[1],
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#f2e6ee",
                color: "#7a3e6b",
                fontWeight: 800,
                fontSize: 14,
                fontFamily: "Rubik, sans-serif",
              }}
            >
              {avatarLetter(params.value)}
            </Avatar>
            <Typography
              sx={{
                fontFamily: "Rubik, sans-serif",
                fontWeight: 700,
                color: "#2f2930",
                fontSize: 14,
              }}
            >
              {params.value}
            </Typography>
          </Box>
        ),
      },
      ...COLUMNS.slice(2),
      {
        field: "actions",
        headerName: "פעולות",
        width: 100,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Tooltip title="פרטי חניך">
            <IconButton
              size="small"
              aria-label={`פרטי חניך ${params.row.name ?? ""}`}
              onClick={(event) => {
                event.stopPropagation();
                openTraineeDetails(
                  getOriginalTrainee(params.row as TraineeTableRow),
                );
              }}
              sx={{
                color: "#7a3e6b",
                bgcolor: "#fbf7fa",
                border: "1px solid #ead8e5",
                "&:hover": {
                  bgcolor: "#9a5188",
                  color: "#fff",
                },
              }}
            >
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [],
  );
  const emptyMessage = searchTerm.trim()
    ? "לא נמצאו חניכים שתואמים לחיפוש."
    : "אין עדיין חניכים להצגה.";

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Box>
          <Typography className={styles.pageTitle}>חניכים</Typography>
          <Typography className={styles.pageSubtitle}>
            ניהול וצפייה בפרטי החניכים בסניף הנוכחי
          </Typography>
        </Box>
        <Button
          className={styles.createButton}
          onClick={() => setOpen(true)}
          startIcon={<AddIcon />}
          variant="contained"
        >
          יצירת חניך חדש
        </Button>
      </Box>

      <Box className={styles.toolbarCard}>
        <TextField
          className={styles.searchField}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="חיפוש לפי שם, ת.ז, טלפון, אימייל או כתובת"
          aria-label="חיפוש חניכים"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Typography className={styles.resultCount}>
          {filteredRows.length} מתוך {rowsData.length} חניכים
        </Typography>
      </Box>

      <Box className={styles.contentLayout}>
        {isDetailsPanelOpen && selectedTrainee && (
          <VolunteerDetails
            open={isDetailsPanelOpen}
            onClose={closeTraineeDetails}
            volunteerData={selectedTrainee}
            entityLabel="חניך"
            onUserUpdated={setSelectedTrainee}
          />
        )}

        <Box className={styles.dataGridBox}>
          {isError ? (
            <Box className={styles.stateBox}>
              <Typography className={styles.stateTitle}>
                לא הצלחנו לטעון את רשימת החניכים
              </Typography>
              <Typography className={styles.stateText}>
                נסו לרענן את העמוד או לבחור סניף מחדש.
              </Typography>
            </Box>
          ) : (
            <DataGrid
              rows={filteredRows}
              columns={columns}
              loading={isFetchingTrainees}
              disableRowSelectionOnClick
              onRowClick={(params) =>
                openTraineeDetails(
                  getOriginalTrainee(params.row as TraineeTableRow),
                )
              }
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              localeText={{
                noRowsLabel: emptyMessage,
              }}
            />
          )}
        </Box>
      </Box>

      {open && <CreateTrainee open={open} onClose={() => setOpen(false)} />}
    </Box>
  );
};
