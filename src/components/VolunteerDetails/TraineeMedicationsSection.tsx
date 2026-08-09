import * as React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  formatMedicationFrequency,
  MEDICATION_FREQUENCY_OPTIONS,
} from "../../constants/trainee-medication.constants";
import type {
  ITraineeMedication,
  ITraineeMedicationPayload,
  MedicationFrequency,
} from "../../interfaces/trainee-medication.interface";
import traineeMedicationService from "../../services/trainee-medication.service";
import { useVolunteerDetailsStyles } from "./VolunteerDetails.styles";

type ITraineeMedicationsSectionProps =
  | { mode: "admin"; traineeUuid: string }
  | { mode: "self"; traineeUuid?: never };

interface MedicationFormState {
  medicationName: string;
  dosage: string;
  frequency: MedicationFrequency | "";
  schedule: string;
  instructions: string;
  notes: string;
}

const EMPTY_FORM: MedicationFormState = {
  medicationName: "",
  dosage: "",
  frequency: "",
  schedule: "",
  instructions: "",
  notes: "",
};

const optionalValue = (value: string) => value.trim() || null;

export const TraineeMedicationsSection: React.FC<
  ITraineeMedicationsSectionProps
> = (props) => {
  const classes = useVolunteerDetailsStyles();
  const queryClient = useQueryClient();
  const isSelfService = props.mode === "self";
  const queryKey = isSelfService
    ? (["my-trainee-medications"] as const)
    : (["trainee-medications", props.traineeUuid] as const);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingMedication, setEditingMedication] =
    React.useState<ITraineeMedication | null>(null);
  const [pendingDelete, setPendingDelete] =
    React.useState<ITraineeMedication | null>(null);
  const [form, setForm] = React.useState<MedicationFormState>(EMPTY_FORM);
  const [formError, setFormError] = React.useState("");
  const [deleteError, setDeleteError] = React.useState("");

  const {
    data: medications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: () =>
      props.mode === "self"
        ? traineeMedicationService.getMine()
        : traineeMedicationService.getByTrainee(props.traineeUuid),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: ITraineeMedicationPayload) =>
      props.mode === "self"
        ? editingMedication
          ? traineeMedicationService.updateMine(editingMedication.id, payload)
          : traineeMedicationService.createMine(payload)
        : editingMedication
          ? traineeMedicationService.update(
              props.traineeUuid,
              editingMedication.id,
              payload,
            )
          : traineeMedicationService.create(props.traineeUuid, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      setIsFormOpen(false);
      setEditingMedication(null);
      setForm(EMPTY_FORM);
      setFormError("");
    },
    onError: () => {
      setFormError("לא הצלחנו לשמור את התרופה");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (medicationId: string) =>
      props.mode === "self"
        ? traineeMedicationService.removeMine(medicationId)
        : traineeMedicationService.remove(props.traineeUuid, medicationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      setPendingDelete(null);
      setDeleteError("");
    },
    onError: () => {
      setDeleteError("לא הצלחנו להסיר את התרופה");
    },
  });

  const openCreateDialog = () => {
    setEditingMedication(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditDialog = (medication: ITraineeMedication) => {
    setEditingMedication(medication);
    setForm({
      medicationName: medication.medicationName,
      dosage: medication.dosage ?? "",
      frequency: medication.frequency ?? "",
      schedule: medication.schedule ?? "",
      instructions: medication.instructions ?? "",
      notes: medication.notes ?? "",
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const closeFormDialog = () => {
    if (saveMutation.isPending) return;
    setIsFormOpen(false);
    setEditingMedication(null);
    setFormError("");
  };

  const handleFieldChange =
    (field: keyof MedicationFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSave = () => {
    if (!form.medicationName.trim()) {
      setFormError("יש להזין שם תרופה");
      return;
    }

    saveMutation.mutate({
      medicationName: form.medicationName.trim(),
      dosage: optionalValue(form.dosage),
      frequency: form.frequency || null,
      schedule: optionalValue(form.schedule),
      instructions: optionalValue(form.instructions),
      notes: optionalValue(form.notes),
    });
  };

  const detailRows = (medication: ITraineeMedication) => [
    medication.dosage ? { label: "מינון", value: medication.dosage } : null,
    medication.frequency
      ? {
          label: "תדירות",
          value: formatMedicationFrequency(medication.frequency),
        }
      : null,
    medication.schedule
      ? { label: "מועד / שעות", value: medication.schedule }
      : null,
    medication.instructions
      ? { label: "הוראות שימוש", value: medication.instructions }
      : null,
    medication.notes ? { label: "הערות", value: medication.notes } : null,
  ];

  return (
    <>
      <Box
        className={classes.section}
        sx={
          isSelfService
            ? {
                border: "none",
                borderRadius: "20px",
                p: "18px",
                mb: "14px",
                bgcolor: "#fff",
                boxShadow: "0 5px 20px rgba(55, 35, 52, 0.08)",
              }
            : undefined
        }
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          sx={{ mb: 1 }}
        >
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <MedicationOutlinedIcon className={classes.rowIcon} />
            <Typography
              className={classes.sectionTitle}
              sx={{ mb: "0 !important" }}
            >
              תרופות
            </Typography>
          </Stack>
          <Tooltip title="הוספת תרופה">
            <IconButton
              size="small"
              aria-label="הוספת תרופה"
              onClick={openCreateDialog}
              sx={{ color: "#7a3e6b", border: "1px solid #ead8e5" }}
            >
              <AddRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={28} sx={{ color: "#7a3e6b" }} />
          </Box>
        ) : isError ? (
          <Alert severity="error">לא הצלחנו לטעון את התרופות</Alert>
        ) : medications.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: "#817680", fontFamily: "Rubik, sans-serif", py: 1 }}
          >
            לא הוגדרו תרופות
          </Typography>
        ) : (
          <Stack spacing={1}>
            {medications.map((medication) => (
              <Box
                key={medication.id}
                sx={{
                  border: "1px solid #eee3eb",
                  borderRadius: 2,
                  p: 1.25,
                  minWidth: 0,
                  backgroundColor: "#fcfafc",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Typography
                    sx={{
                      minWidth: 0,
                      overflowWrap: "anywhere",
                      color: "#2f2930",
                      fontFamily: "Rubik, sans-serif",
                      fontWeight: 800,
                    }}
                  >
                    {medication.medicationName}
                  </Typography>
                  <Stack direction="row" spacing={0.25} flexShrink={0}>
                    <Tooltip title="עריכת תרופה">
                      <IconButton
                        size="small"
                        aria-label={`עריכת ${medication.medicationName}`}
                        onClick={() => openEditDialog(medication)}
                        sx={{ color: "#7a3e6b" }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="הסרת תרופה">
                      <IconButton
                        size="small"
                        aria-label={`הסרת ${medication.medicationName}`}
                        onClick={() => {
                          setDeleteError("");
                          setPendingDelete(medication);
                        }}
                        sx={{ color: "#b42318" }}
                      >
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
                <Stack spacing={0.35} sx={{ mt: 0.5 }}>
                  {detailRows(medication).map(
                    (row) =>
                      row && (
                        <Typography
                          key={row.label}
                          variant="body2"
                          sx={{
                            color: "#5f5660",
                            fontFamily: "Rubik, sans-serif",
                            overflowWrap: "anywhere",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          <Box component="span" sx={{ fontWeight: 700 }}>
                            {row.label}:
                          </Box>{" "}
                          {row.value}
                        </Typography>
                      ),
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}

        <Button
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={openCreateDialog}
          sx={{ mt: 1, color: "#7a3e6b", fontFamily: "Rubik, sans-serif" }}
        >
          הוספת תרופה
        </Button>
      </Box>

      <Dialog
        open={isFormOpen}
        onClose={closeFormDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { direction: "rtl", borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            direction: "rtl",
            textAlign: "right",
            fontFamily: "Rubik, sans-serif",
            fontWeight: 800,
          }}
        >
          {editingMedication ? "עריכת תרופה" : "הוספת תרופה"}
        </DialogTitle>
        <DialogContent sx={{ direction: "rtl", textAlign: "right" }}>
          <Stack
            spacing={2}
            sx={{
              pt: 1,
              direction: "rtl",
              textAlign: "right",
              "& .MuiInputBase-root": { direction: "rtl" },
              "& .MuiInputBase-input, & .MuiSelect-select": {
                textAlign: "right",
              },
              "& .MuiInputLabel-root": {
                right: 14,
                left: "auto",
                transform: "translate(0, 16px) scale(1)",
                transformOrigin: "top right",
              },
              "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                transform: "translate(0, -9px) scale(0.75)",
              },
              "& fieldset.MuiOutlinedInput-notchedOutline": {
                textAlign: "right",
              },
              "& fieldset.MuiOutlinedInput-notchedOutline > legend": {
                marginRight: 0,
                marginLeft: 0,
                textAlign: "right",
              },
              "& .MuiFormHelperText-root": {
                mr: 0,
                ml: 0,
                textAlign: "right",
              },
              "& .MuiSelect-icon": {
                right: "auto",
                left: 7,
              },
            }}
          >
            {formError && (
              <Alert
                severity="error"
                sx={{
                  direction: "rtl",
                  textAlign: "right",
                  "& .MuiAlert-message": { width: "100%" },
                }}
              >
                {formError}
              </Alert>
            )}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                direction: "rtl",
                width: "100%",
              }}
            >
              <TextField
                required
                fullWidth
                label="שם התרופה"
                value={form.medicationName}
                onChange={handleFieldChange("medicationName")}
                inputProps={{ maxLength: 200 }}
                sx={{ flex: "2 1 220px", minWidth: 0 }}
              />
              <TextField
                fullWidth
                label="מינון"
                value={form.dosage}
                onChange={handleFieldChange("dosage")}
                inputProps={{ maxLength: 100 }}
                sx={{ flex: "1 1 120px", minWidth: 0 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                direction: "rtl",
                width: "100%",
              }}
            >
              <TextField
                select
                fullWidth
                label="תדירות"
                value={form.frequency}
                onChange={handleFieldChange("frequency")}
                sx={{ flex: "1 1 160px", minWidth: 0 }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: { direction: "rtl", textAlign: "right" },
                    },
                    MenuListProps: {
                      sx: {
                        direction: "rtl",
                        "& .MuiMenuItem-root": {
                          justifyContent: "flex-start",
                          textAlign: "right",
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">לא צוין</MenuItem>
                {MEDICATION_FREQUENCY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="מועד / שעות"
                value={form.schedule}
                onChange={handleFieldChange("schedule")}
                inputProps={{ maxLength: 300 }}
                sx={{ flex: "1.25 1 190px", minWidth: 0 }}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="הוראות מיוחדות"
              value={form.instructions}
              onChange={handleFieldChange("instructions")}
              inputProps={{ maxLength: 2000 }}
            />
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="הערות"
              value={form.notes}
              onChange={handleFieldChange("notes")}
              inputProps={{ maxLength: 2000 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeFormDialog} disabled={saveMutation.isPending}>
            ביטול
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className={classes.buttonContained}
          >
            {saveMutation.isPending ? "שומר..." : "שמירה"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!pendingDelete}
        onClose={() => !deleteMutation.isPending && setPendingDelete(null)}
        PaperProps={{ sx: { direction: "rtl", borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontFamily: "Rubik, sans-serif", fontWeight: 800 }}>
          הסרת תרופה
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            <Typography sx={{ fontFamily: "Rubik, sans-serif" }}>
              האם להסיר את התרופה {pendingDelete?.medicationName}?
            </Typography>
            {deleteError && <Alert severity="error">{deleteError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setPendingDelete(null)}
            disabled={deleteMutation.isPending}
          >
            ביטול
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending || !pendingDelete}
            onClick={() =>
              pendingDelete && deleteMutation.mutate(pendingDelete.id)
            }
          >
            {deleteMutation.isPending ? "מסיר..." : "הסרה"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
