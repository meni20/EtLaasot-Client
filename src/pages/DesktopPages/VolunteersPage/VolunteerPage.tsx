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
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { VOLUNTEER_BASE_COLUMNS } from "./Volunteer.constants";
import { useQuery } from "@tanstack/react-query";
import userService, {
  type UserListStatus,
} from "../../../services/user.service";
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
  const [statusFilter, setStatusFilter] =
    useState<UserListStatus>("active");
  const [selectedVolunteer, setSelectedVolunteer] = useState<IUser | null>(
    null,
  );

  const {
    data: allVolunteers,
    isFetching: isFetchingVolunteers,
    isError,
  } = useQuery<IUser[]>({
    queryKey: ["volunteers", activeBranch, statusFilter],
    queryFn: () =>
      userService.getAllVolunteers(activeBranch ?? undefined, statusFilter),
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

  const switchStatusFilter = (nextStatus: UserListStatus) => {
    setStatusFilter(nextStatus);
    closeVolunteerDetails();
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
                width: 34,
                height: 34,
                bgcolor: "primary.light",
                color: "primary.dark",
                fontWeight: 800,
                fontSize: 14,
                fontFamily: "inherit",
              }}
            >
              {avatarLetter(params.value)}
            </Avatar>
            <Typography
              sx={{
                fontWeight: 700,
                color: "text.primary",
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
                minWidth: 44,
                minHeight: 44,
                color: "primary.dark",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  bgcolor: "primary.light",
                  borderColor: "primary.main",
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
  const isArchivedView = statusFilter === "archived";
  const emptyMessage = searchTerm.trim()
    ? "לא נמצאו מתנדבים שתואמים לחיפוש."
    : isArchivedView
      ? "אין מתנדבים בארכיון."
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

      <Box className={styles.toolbarCard} role="search">
        <TextField
          className={styles.searchField}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="חיפוש לפי שם, 4 ספרות ת.ז, טלפון, אימייל או כתובת"
          aria-label="חיפוש מתנדבים"
          size="small"
          type="search"
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        {isArchivedView ? (
          <Button
            variant="outlined"
            startIcon={<ArrowForwardRoundedIcon />}
            onClick={() => switchStatusFilter("active")}
            className={styles.archiveModeButton}
          >
            חזרה לפעילים
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<Inventory2OutlinedIcon />}
            onClick={() => switchStatusFilter("archived")}
            className={styles.archiveModeButton}
          >
            בארכיון
          </Button>
        )}
        <Typography className={styles.resultCount}>
          {filteredRows.length} מתוך {rowsData.length}{" "}
          {isArchivedView ? "מתנדבים בארכיון" : "מתנדבים"}
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
              rowHeight={60}
              columnHeaderHeight={48}
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
