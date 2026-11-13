import { Alert, Box, Button, CircularProgress, Paper, Stack, TablePagination, Typography } from "@mui/material";
import { useState, type ReactNode } from "react";

interface PersonRow {
  id: string;
  name?: string | null;
}

export function AdminRecordCards<T extends PersonRow>({
  rows, fields, loading, emptyMessage, onDetails, document,
}: {
  rows: T[];
  fields: { label: string; value: (row: T) => ReactNode }[];
  loading: boolean;
  emptyMessage: string;
  onDetails?: (row: T) => void;
  document?: (row: T) => ReactNode;
}) {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(25);
  const current = Math.min(page, Math.max(0, Math.ceil(rows.length / size) - 1));
  if (loading && !rows.length)
    return <CircularProgress size={24} aria-label="טוען רשימה" />;
  if (!rows.length) return <Alert severity="info">{emptyMessage}</Alert>;
  return (
    <Stack gap={1.5} aria-busy={loading}>
      {rows.slice(current * size, (current + 1) * size).map((row) => (
        <Paper key={row.id} component="article" variant="outlined" sx={{ p: 2, minWidth: 0 }}>
          <Typography component="h2" fontWeight={700} sx={{ overflowWrap: "anywhere" }}>
            {row.name || "שם לא זמין"}
          </Typography>
          <Box component="dl" sx={{ my: 1.5, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1 }}>
            {fields.map(({ label, value }) => {
              const content = value(row);
              return content == null || content === "" ? null : (
                <Box key={label} sx={{ overflowWrap: "anywhere" }}>
                  <Typography component="dt" variant="body2" color="text.secondary">{label}</Typography>
                  <Typography component="dd" sx={{ m: 0 }} variant="body2">{content}</Typography>
                </Box>
              );
            })}
          </Box>
          <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
            {onDetails && <Button variant="outlined" onClick={() => onDetails(row)} aria-label={`פרטים של ${row.name || "המשתמש"}`}>
              פתיחת פרטים
            </Button>}
            {document?.(row)}
          </Stack>
        </Paper>
      ))}
      <TablePagination
        component="div"
        count={rows.length}
        page={current}
        rowsPerPage={size}
        rowsPerPageOptions={[25, 50, 100]}
        onPageChange={(_, next) => setPage(next)}
        onRowsPerPageChange={(event) => {
          setSize(Number(event.target.value));
          setPage(0);
        }}
        labelRowsPerPage="בעמוד"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} מתוך ${count}`}
        getItemAriaLabel={(type) => type === "next" ? "לעמוד הבא" : "לעמוד הקודם"}
        sx={{ "& .MuiToolbar-root": { flexWrap: "wrap", px: 0, justifyContent: "flex-end" } }}
      />
    </Stack>
  );
}
