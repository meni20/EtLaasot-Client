import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { DocumentViewer } from "../../../components/TraineeDocuments/DocumentViewer";
import {
  discountApi,
  type DiscountRequestListItem,
} from "../../../features/discount-request/discount-api";
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
const DISCOUNT_CATEGORY = "DISCOUNT_REQUEST" as const;
type FileCategory = DocumentType | typeof DISCOUNT_CATEGORY;

const CATEGORIES: {
  type: FileCategory;
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
  {
    type: DISCOUNT_CATEGORY,
    label: "בקשות הנחה",
    emptyLabel: "אין בקשות הנחה להצגה",
    icon: <RequestQuoteOutlinedIcon />,
  },
];

const DISCOUNT_STATUS_LABELS = {
  enabled: "ממתין למילוי",
  draft: "טיוטה",
  submitted: "הוגש",
};

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
  if (kilobytes < 1024)
    return `${kilobytes.toFixed(kilobytes < 10 ? 1 : 0)} KB`;
  const megabytes = kilobytes / 1024;
  return `${megabytes.toFixed(megabytes < 10 ? 1 : 0)} MB`;
};

export const FilesPage: React.FC = () => {
  const classes = useFilesPageStyles();
  const { availableBranches, isSuperAdmin } = useBranch();
  const [documentType, setDocumentType] = useState<FileCategory>("ID_APPENDIX");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [branchId, setBranchId] = useState("");
  const [discountStatus, setDiscountStatus] = useState<
    "" | "enabled" | "draft" | "submitted"
  >("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [selectedDocument, setSelectedDocument] =
    useState<AdminTraineeDocument | null>(null);
  const [selectedDiscountRequest, setSelectedDiscountRequest] =
    useState<DiscountRequestListItem | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPaginationModel((current) =>
        current.page === 0 ? current : { ...current, page: 0 },
      );
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const isDiscountCategory = documentType === DISCOUNT_CATEGORY;
  const queryParams = useMemo(
    () => ({
      documentType: documentType as DocumentType,
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
    enabled: !isDiscountCategory,
    retry: false,
  });

  const discountRequests = useQuery({
    queryKey: [
      "discount-requests",
      "admin-list",
      branchId,
      debouncedSearch,
      discountStatus,
      paginationModel,
    ],
    queryFn: ({ signal }) =>
      discountApi
        .list(
          {
            ...(isSuperAdmin && branchId ? { branchId } : {}),
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
            ...(discountStatus ? { status: discountStatus } : {}),
            page: paginationModel.page + 1,
            pageSize: paginationModel.pageSize,
          },
          signal,
        )
        .then(({ data }) => data),
    enabled: isDiscountCategory,
    retry: false,
  });

  const selectedCategory =
    CATEGORIES.find((category) => category.type === documentType) ??
    CATEGORIES[0];
  const hasSearch = Boolean(debouncedSearch);
  const rows = documents.data?.items ?? [];
  const discountRows = discountRequests.data?.items ?? [];

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

  const discountColumns = useMemo<GridColDef<DiscountRequestListItem>[]>(
    () => [
      {
        field: "traineeName",
        headerName: "שם החניך",
        flex: 1,
        minWidth: 155,
        align: "right",
        headerAlign: "right",
        sortable: false,
      },
      {
        field: "branchName",
        headerName: "סניף",
        flex: 0.9,
        minWidth: 135,
        align: "right",
        headerAlign: "right",
        sortable: false,
        valueGetter: (_value, row) => row.branchName || "-",
      },
      {
        field: "status",
        headerName: "סטטוס",
        flex: 0.8,
        minWidth: 125,
        align: "right",
        headerAlign: "right",
        sortable: false,
        valueFormatter: (value) =>
          DISCOUNT_STATUS_LABELS[
            value as keyof typeof DISCOUNT_STATUS_LABELS
          ] ?? value,
      },
      {
        field: "submittedAt",
        headerName: "מועד הגשה",
        flex: 1,
        minWidth: 165,
        align: "right",
        headerAlign: "right",
        sortable: false,
        valueFormatter: (value) => (value ? formatDateTimeShort(value) : "-"),
      },
      {
        field: "actions",
        headerName: "פעולות",
        width: 140,
        align: "center",
        headerAlign: "center",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => (
          <Button
            variant="outlined"
            className={classes.viewButton}
            startIcon={<VisibilityOutlinedIcon fontSize="small" />}
            disabled={!row.files.length}
            onClick={() => setSelectedDiscountRequest(row)}
          >
            קבצים
          </Button>
        ),
      },
    ],
    [classes.viewButton],
  );

  const selectCategory = (nextType: FileCategory) => {
    setDocumentType(nextType);
    setSelectedDocument(null);
    setSelectedDiscountRequest(null);
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

          {isDiscountCategory && (
            <TextField
              select
              size="small"
              label="סטטוס"
              className={classes.branchField}
              value={discountStatus}
              onChange={(event) => {
                setDiscountStatus(event.target.value as typeof discountStatus);
                setPaginationModel((current) => ({ ...current, page: 0 }));
              }}
            >
              <MenuItem value="">כל הסטטוסים</MenuItem>
              {Object.entries(DISCOUNT_STATUS_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          )}

          <Typography className={classes.resultCount} aria-live="polite">
            {isDiscountCategory
              ? discountRequests.data
                ? `${discountRequests.data.total} ${selectedCategory.label}`
                : `טוען ${selectedCategory.label}...`
              : documents.data
                ? `${documents.data.total} ${selectedCategory.label}`
                : `טוען ${selectedCategory.label}...`}
          </Typography>
        </Box>

        {(isDiscountCategory ? discountRequests.isError : documents.isError) ? (
          <Box className={classes.stateCard} role="alert">
            <Typography className={classes.stateTitle}>
              לא הצלחנו לטעון את הקבצים
            </Typography>
            <Typography className={classes.stateText}>
              נסו שוב. אם הבעיה נמשכת, פנו למנהל הסניף.
            </Typography>
            <Button
              variant="outlined"
              onClick={() =>
                void (isDiscountCategory
                  ? discountRequests.refetch()
                  : documents.refetch())
              }
            >
              ניסיון נוסף
            </Button>
          </Box>
        ) : (
          <Box className={classes.dataGridBox}>
            {isDiscountCategory ? (
              <DataGrid
                rows={discountRows}
                getRowId={(row) => row.traineeId}
                columns={discountColumns}
                loading={
                  discountRequests.isPending || discountRequests.isFetching
                }
                rowCount={discountRequests.data?.total ?? 0}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                disableRowSelectionOnClick
                disableColumnFilter
                disableColumnSorting
                rowHeight={64}
                columnHeaderHeight={48}
                aria-label="רשימת בקשות הנחה"
                localeText={{
                  noRowsLabel: emptyMessage,
                  footerRowSelected: () => "",
                }}
              />
            ) : (
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
            )}
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
        {selectedDiscountRequest && (
          <DiscountRequestFilesDialog
            request={selectedDiscountRequest}
            onClose={() => setSelectedDiscountRequest(null)}
          />
        )}
      </Box>
    </Box>
  );
};

function DiscountRequestFilesDialog({
  request,
  onClose,
}: {
  request: DiscountRequestListItem;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{
    url: string;
    type: string;
    name: string;
  }>();

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview.url);
    },
    [preview],
  );

  async function openFile(
    file: DiscountRequestListItem["files"][number],
    download: boolean,
  ) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const { data } = await discountApi.file(request.traineeId, file.key);
      const url = URL.createObjectURL(data);
      if (download) {
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else {
        if (preview) URL.revokeObjectURL(preview.url);
        setPreview({ url, type: data.type, name: file.name });
      }
    } catch {
      setError("לא ניתן לטעון את הקובץ. נסו שוב.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open fullWidth maxWidth="md" dir="rtl" onClose={onClose}>
      <DialogTitle>בקשת הנחה — {request.traineeName}</DialogTitle>
      <DialogContent>
        <Stack gap={1.5}>
          {error && <Typography color="error">{error}</Typography>}
          {busy && <CircularProgress size={22} aria-label="טוען קובץ" />}
          {request.files.map((file) => (
            <Stack
              key={file.key}
              direction={{ xs: "column", sm: "row" }}
              gap={1}
              alignItems={{ sm: "center" }}
            >
              <Typography sx={{ flex: 1, overflowWrap: "anywhere" }}>
                {file.name}
              </Typography>
              <Stack direction="row" gap={1}>
                <Button
                  size="small"
                  disabled={busy}
                  onClick={() => void openFile(file, false)}
                >
                  צפייה
                </Button>
                <Button
                  size="small"
                  disabled={busy}
                  onClick={() => void openFile(file, true)}
                >
                  הורדה
                </Button>
              </Stack>
            </Stack>
          ))}
          {preview &&
            (preview.type.startsWith("image/") ? (
              <Box
                component="img"
                src={preview.url}
                alt={preview.name}
                sx={{ width: "100%", maxHeight: "55vh", objectFit: "contain" }}
              />
            ) : (
              <Box
                component="iframe"
                src={preview.url}
                title={preview.name}
                referrerPolicy="no-referrer"
                sx={{ width: "100%", height: "55vh", border: 0 }}
              />
            ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>סגירה</Button>
      </DialogActions>
    </Dialog>
  );
}
