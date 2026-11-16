import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import userService, { type IBranchManager } from "../../../services/user.service";

export const ManagersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<IBranchManager | null>(null);
  const managers = useQuery({
    queryKey: ["branch-managers"],
    queryFn: () => userService.getBranchManagers(),
  });
  const remove = useMutation({
    mutationFn: (id: string) => userService.removeBranchAdminRole(id),
    onSuccess: async () => {
      setSelected(null);
      await queryClient.invalidateQueries({ queryKey: ["branch-managers"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "super-admin"] });
    },
  });

  return (
    <Box
      dir="rtl"
      sx={{
        minHeight: "100dvh",
        pt: { xs: 10, md: 11 },
        px: { xs: 1.5, sm: 3 },
        pb: 4,
        bgcolor: "var(--color-canvas)",
      }}
    >
      <Box sx={{ width: "min(100%, 960px)", mx: "auto" }}>
        <Typography component="h1" variant="h4" fontWeight={700} mb={3}>
          מנהלי סניפים
        </Typography>
        {managers.isPending ? (
          <Stack alignItems="center" py={8}>
            <CircularProgress />
          </Stack>
        ) : managers.isError ? (
          <Alert
            severity="error"
            action={<Button onClick={() => void managers.refetch()}>ניסיון נוסף</Button>}
          >
            לא ניתן לטעון את רשימת המנהלים.
          </Alert>
        ) : managers.data.length === 0 ? (
          <Alert severity="info">לא נמצאו מנהלי סניפים פעילים.</Alert>
        ) : (
          <Stack gap={1.5}>
            {managers.data.map((manager) => (
              <Paper
                key={manager.id}
                variant="outlined"
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  display: "flex",
                  alignItems: { xs: "stretch", sm: "center" },
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  borderRadius: 3,
                }}
              >
                <Box>
                  <Typography fontWeight={700}>{manager.name}</Typography>
                  <Typography color="text.secondary">{manager.branchName}</Typography>
                </Box>
                <Button
                  color="error"
                  variant="outlined"
                  startIcon={<PersonRemoveOutlinedIcon />}
                  onClick={() => setSelected(manager)}
                  sx={{ minHeight: 44 }}
                >
                  הסרת הרשאת מנהל
                </Button>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
      <Dialog
        open={!!selected}
        onClose={() => !remove.isPending && setSelected(null)}
        fullWidth
        maxWidth="xs"
        dir="rtl"
      >
        <DialogTitle>הסרת הרשאת מנהל סניף</DialogTitle>
        <DialogContent>
          <Typography>
            להסיר את הרשאת מנהל הסניף של {selected?.name}? החשבון והמידע יישמרו,
            ותוחזר הרשאת המשתמש הרגילה.
          </Typography>
          {remove.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              לא ניתן להסיר את ההרשאה. נסו שוב.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button disabled={remove.isPending} onClick={() => setSelected(null)}>
            ביטול
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={!selected || remove.isPending}
            onClick={() => selected && remove.mutate(selected.id)}
          >
            {remove.isPending ? "מסיר הרשאה…" : "אישור הסרה"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
