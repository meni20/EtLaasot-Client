import { useState, useMemo } from "react";
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
import { VOLUNTEER_BASE_COLUMNS } from "./Volunteer.constants";
import { useQuery } from "@tanstack/react-query";
import userService from "../../../services/user.service";
import type { IUser } from "../../../interfaces/user.interface";
import { useVolunteerPageStyles } from "./VolunteerPage.styles";
import { VolunteerDetails } from "../../../components/VolunteerDetails/VolunteerDetails";
import { CreateVolunteer } from "../../../components/CreateVolunteerPopup/CreateVolunteer";
import { useBranch } from "../../../contexts/useBranch";
import {
  calculateAge,
  formatMaskedNationalId,
} from "../../../utils/data.utillity";
import { formatShirtSize } from "../../../constants/user.constants";

const avatarLetter = (name?: string) => name?.trim()?.[0]?.toUpperCase() || "?";
const DEFAULT_PEOPLE_PAGE_SIZE = 100;

type VolunteerTableRow = Pick<
  IUser,
  "id" | "name" | "age" | "gender" | "phoneNumber" | "email" | "address"
> & {
  nationalIdMasked: string;
  shirtSizeDisplay: string;
  originalVolunteer: IUser;
};

const getOriginalVolunteer = (row: VolunteerTableRow | IUser) =>
  "originalVolunteer" in row ? row.originalVolunteer : row;

export const VolunteerPage: React.FC = () => {
  const styles = useVolunteerPageStyles();
  const { activeBranch } = useBranch();
  const [open, setOpen] = useState<boolean>(false);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] =
    useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState<IUser | null>(
    null,
  );

  const {
    data: allVolunteers,
    isFetching: isFetchingVolunteers,
    isError,
  } = useQuery<IUser[]>({
    queryKey: ["volunteers", activeBranch],
    queryFn: () => userService.getAllVolunteers(activeBranch ?? undefined),
    enabled: !!activeBranch,
  });

  const openVolunteerDetails = (volunteer: IUser) => {
    setSelectedVolunteer(volunteer);
    setIsDetailsPanelOpen(true);
  };

  const closeVolunteerDetails = () => {
    setIsDetailsPanelOpen(false);
    setSelectedVolunteer(null);
  };

  const rowsData = useMemo<VolunteerTableRow[]>(() => {
    return (
      allVolunteers?.map((volunteer: IUser) => ({
        id: volunteer.id,
        nationalIdMasked: formatMaskedNationalId(
          volunteer.nationalIdMasked,
          volunteer.nationalIdLast4,
        ),
        name: volunteer.name,
        age: calculateAge(volunteer.dateOfBirth, volunteer.age),
        gender: volunteer.gender ?? "",
        shirtSizeDisplay: formatShirtSize(
          volunteer.shirtSize,
          volunteer.customShirtSize,
        ),
        phoneNumber: volunteer.phoneNumber,
        email: volunteer.email,
        address: volunteer.address,
        originalVolunteer: volunteer,
      })) ?? []
    );
  }, [allVolunteers]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return rowsData;

    return rowsData.filter((volunteer) =>
      [
        volunteer.name,
        volunteer.nationalIdMasked,
        volunteer.phoneNumber,
        volunteer.email,
        volunteer.address,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
    );
  }, [rowsData, searchTerm]);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        ...VOLUNTEER_BASE_COLUMNS[0],
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
      ...VOLUNTEER_BASE_COLUMNS.slice(1),
      {
        field: "actions",
        headerName: "פעולות",
        width: 100,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Tooltip title="פרטי מתנדב">
            <IconButton
              size="small"
              aria-label={`פרטי מתנדב ${params.row.name ?? ""}`}
              onClick={(event) => {
                event.stopPropagation();
                openVolunteerDetails(
                  getOriginalVolunteer(params.row as VolunteerTableRow),
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
    ? "לא נמצאו מתנדבים שתואמים לחיפוש."
    : "אין עדיין מתנדבים להצגה.";

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Box>
          <Typography className={styles.pageTitle}>מתנדבים</Typography>
          <Typography className={styles.pageSubtitle}>
            ניהול וצפייה בפרטי המתנדבים בסניף הנוכחי
          </Typography>
        </Box>
        <Button
          className={styles.createButton}
          onClick={() => setOpen(true)}
          startIcon={<AddIcon />}
          variant="contained"
        >
          יצירת מתנדב חדש
        </Button>
      </Box>

      <Box className={styles.toolbarCard}>
        <TextField
          className={styles.searchField}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="חיפוש לפי שם, 4 ספרות ת.ז, טלפון, אימייל או כתובת"
          aria-label="חיפוש מתנדבים"
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
          {filteredRows.length} מתוך {rowsData.length} מתנדבים
        </Typography>
      </Box>

      <Box className={styles.contentLayout}>
        {isDetailsPanelOpen && selectedVolunteer && (
          <VolunteerDetails
            open={isDetailsPanelOpen}
            onClose={closeVolunteerDetails}
            volunteerData={selectedVolunteer}
            onUserUpdated={setSelectedVolunteer}
          />
        )}

        <Box className={styles.dataGridBox}>
          {isError ? (
            <Box className={styles.stateBox}>
              <Typography className={styles.stateTitle}>
                לא הצלחנו לטעון את רשימת המתנדבים
              </Typography>
              <Typography className={styles.stateText}>
                נסו לרענן את העמוד או לבחור סניף מחדש.
              </Typography>
            </Box>
          ) : (
            <DataGrid
              rows={filteredRows}
              columns={columns}
              loading={isFetchingVolunteers}
              disableRowSelectionOnClick
              onRowClick={(params) =>
                openVolunteerDetails(
                  getOriginalVolunteer(params.row as VolunteerTableRow),
                )
              }
              pageSizeOptions={[25, 50, DEFAULT_PEOPLE_PAGE_SIZE]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: DEFAULT_PEOPLE_PAGE_SIZE,
                    page: 0,
                  },
                },
              }}
              localeText={{
                noRowsLabel: emptyMessage,
              }}
            />
          )}
        </Box>
      </Box>

      {open && <CreateVolunteer open={open} onClose={() => setOpen(false)} />}
    </Box>
  );
};
