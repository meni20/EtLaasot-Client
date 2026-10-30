import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  ButtonBase,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { DocumentViewer } from "../../../components/TraineeDocuments/DocumentViewer";
import { useBranch } from "../../../contexts/useBranch";
import type {
  AdminTraineeDocument,
  DocumentType,
} from "../../../interfaces/trainee-document.interface";
import traineeDocumentService from "../../../services/trainee-document.service";
import { formatDateTimeShort } from "../../../utils/data.utillity";
import { useFilesPageStyles } from "./FilesPage.styles";

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const SEARCH_DEBOUNCE_MS = 350;

const CATEGORIES: {
  type: DocumentType;
  label: string;
  emptyLabel: string;
  icon: React.ReactNode;
}[] = [
  {
    type: "ID_APPENDIX",
    label: "ספחים",
    emptyLabel: "אין ספחים להצגה",
    icon: <DescriptionOutlinedIcon />,
  },
  {
    type: "QUEUE_EXEMPTION",
    label: "פטור מתור",
    emptyLabel: "אין פטורים מתור להצגה",
    icon: <FactCheckOutlinedIcon />,
  },
  {
    type: "MAGNETIC_CARD",
    label: "כרטיסים מגנטיים",
    emptyLabel: "אין כרטיסים מגנטיים להצגה",
    icon: <CreditCardOutlinedIcon />,
  },
];

const FILE_TYPE_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
};

const formatFileSize = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes < 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) return `${kilobytes.toFixed(kilobytes < 10 ? 1 : 0)} KB`;
  const megabytes = kilobytes / 1024;
  return `${megabytes.toFixed(megabytes < 10 ? 1 : 0)} MB`;
};

export const FilesPage: React.FC = () => {
  const classes = useFilesPageStyles();
  const { availableBranches, isSuperAdmin } = useBranch();
  const [documentType, setDocumentType] =
    useState<DocumentType>("ID_APPENDIX");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [branchId, setBranchId] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [selectedDocument, setSelectedDocument] =
    useState<AdminTraineeDocument | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPaginationModel((current) =>
        current.page === 0 ? current : { ...current, page: 0 },
      );
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const queryParams = useMemo(
    () => ({
      documentType,
      ...(isSuperAdmin && branchId ? { branchId } : {}),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
    }),
    [
      branchId,
      debouncedSearch,
      documentType,
      isSuperAdmin,
      paginationModel.page,
      paginationModel.pageSize,
    ],
  );

  const documents = useQuery({
    queryKey: ["trainee-documents", "admin-list", queryParams],
    queryFn: ({ signal }) =>
      traineeDocumentService.listAdmin(queryParams, signal),
    retry: false,
  });

  const selectedCategory =
    CATEGORIES.find((category) => category.type === documentType) ??
    CATEGORIES[0];
  const hasSearch = Boolean(debouncedSearch);
  const rows = documents.data?.items ?? [];

  const columns = useMemo<GridColDef<AdminTraineeDocument>[]>(
    () => [
      {
        field: "traineeName",
        headerName: "שם החניך",
        flex: 1,
        minWidth: 155,
        align: "right",
        headerAlign: "right",
        sortable: false,
        renderCell: (params) => (
          <Typography sx={{ fontWeight: 750, fontSize: 13.5 }}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: "branchName",
        headerName: "סניף",
        flex: 0.9,
        minWidth: 135,
        align: "right",
        headerAlign: "right",
        sortable: false,
        valueGetter: (_value, row) => row.branchName || row.branchId || "-",
      },
      {
        field: "originalFilename",
        headerName: "שם הקובץ",
        flex: 1.5,
        minWidth: 210,
        align: "right",
        headerAlign: "right",
        sortable: false,
        renderCell: (params) => (
          <Typography
            component="span"
            title={params.value}
            sx={{
              minWidth: 0,
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: 13.5,
            }}
          >
            <bdi>{params.value}</bdi>
          </Typography>
        ),
      },
      {
        field: "updatedAt",
        headerName: "הועלה / עודכן",
        flex: 1.05,
        minWidth: 165,
        align: "right",
        headerAlign: "right",
        sortable: false,
        valueFormatter: (value) => formatDateTimeShort(value),
      },
      {
        field: "mimeType",
        headerName: "סוג קובץ",
        width: 105,
        align: "right",
        headerAlign: "right",
        sortable: false,
        valueFormatter: (value) => FILE_TYPE_LABELS[value] ?? value ?? "-",
      },
      {
        field: "fileSize",
        headerName: "גודל",
        width: 100,
        align: "right",
        headerAlign: "right",
        sortable: false,
        valueFormatter: (value) => formatFileSize(Number(value)),
      },
      {
        field: "actions",
        headerName: "פעולות",
        width: 118,
        align: "center",
        headerAlign: "center",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Button
            variant="outlined"
            className={classes.viewButton}
            startIcon={<VisibilityOutlinedIcon fontSize="small" />}
            aria-label={`צפייה בקובץ של ${params.row.traineeName}`}
            onClick={() => setSelectedDocument(params.row)}
          >
            צפייה
          </Button>
        ),
      },
    ],
    [classes.viewButton],
  );

  const selectCategory = (nextType: DocumentType) => {
    setDocumentType(nextType);
    setSelectedDocument(null);
    setPaginationModel((current) => ({ ...current, page: 0 }));
  };

  const emptyMessage = hasSearch
    ? "לא נמצאו קבצים התואמים לחיפוש"
    : selectedCategory.emptyLabel;

  return (
    <Box className={classes.root}>
      <Box className={classes.content}>
        <Box component="header" className={classes.header}>
          <Box className={classes.titleRow}>
            <Box className={classes.titleIcon} aria-hidden="true">
              <FolderOpenOutlinedIcon />
            </Box>
            <Box>
              <Typography component="h1" className={classes.pageTitle}>
                קבצים
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          className={classes.categoryGrid}
          role="tablist"
          aria-label="סוג מסמך"
        >
          {CATEGORIES.map((category) => {
            const selected = category.type === documentType;
            return (
              <ButtonBase
                key={category.type}
                role="tab"
                aria-selected={selected}
                className={`${classes.categoryButton} ${
                  selected ? classes.selectedCategory : ""
                }`}
                onClick={() => selectCategory(category.type)}
              >
                <Box className={classes.categoryIcon} aria-hidden="true">
                  {category.icon}
                </Box>
                <Typography className={classes.categoryText}>
                  {category.label}
                </Typography>
              </ButtonBase>
            );
          })}
        </Box>

        <Box component="section" className={classes.filtersCard}>
          <TextField
            className={classes.searchField}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="חיפוש לפי שם חניך..."
            aria-label="חיפוש קבצים לפי שם חניך"
            type="search"
            size="small"
            autoComplete="off"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {isSuperAdmin && (
            <TextField
              select
              size="small"
              label="סניף"
              className={classes.branchField}
              value={branchId}
              onChange={(event) => {
                setBranchId(event.target.value);
                setPaginationModel((current) => ({ ...current, page: 0 }));
              }}
            >
              <MenuItem value="">כל הסניפים</MenuItem>
              {availableBranches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </TextField>
          )}

          <Typography className={classes.resultCount} aria-live="polite">
            {documents.data
              ? `${documents.data.total} ${selectedCategory.label}`
              : `טוען ${selectedCategory.label}...`}
          </Typography>
        </Box>

        {documents.isError ? (
          <Box className={classes.stateCard} role="alert">
            <Typography className={classes.stateTitle}>
              לא הצלחנו לטעון את הקבצים
            </Typography>
            <Typography className={classes.stateText}>
              נסו שוב. אם הבעיה נמשכת, פנו למנהל הסניף.
            </Typography>
            <Button variant="outlined" onClick={() => void documents.refetch()}>
              ניסיון נוסף
            </Button>
          </Box>
        ) : (
          <Box className={classes.dataGridBox}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={documents.isPending || documents.isFetching}
              rowCount={documents.data?.total ?? 0}
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              disableRowSelectionOnClick
              disableColumnFilter
              disableColumnSorting
              rowHeight={64}
              columnHeaderHeight={48}
              aria-label={`רשימת ${selectedCategory.label}`}
              localeText={{
                noRowsLabel: emptyMessage,
                footerRowSelected: () => "",
              }}
            />
          </Box>
        )}

        {selectedDocument && (
          <DocumentViewer
            target={{
              mode: "admin",
              traineeUuid: selectedDocument.traineeUuid,
            }}
            document={selectedDocument}
            label={
              CATEGORIES.find(
                (category) => category.type === selectedDocument.documentType,
              )?.label ?? "מסמך"
            }
            onClose={() => setSelectedDocument(null)}
          />
        )}
      </Box>
    </Box>
  );
};
