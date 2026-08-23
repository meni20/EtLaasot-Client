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

const medicationDialogPaperSx = {
  direction: "rtl",
  borderRadius: { xs: "22px 22px 0 0", sm: 4 },
  m: { xs: "auto 0 0", sm: 3 },
  maxHeight: { xs: "90dvh", sm: "calc(100dvh - 64px)" },
  backgroundColor: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(22px) saturate(170%)",
  border: "1px solid rgba(255,255,255,0.72)",
  boxShadow: "0 22px 70px rgba(31,31,35,0.2)",
  fontFamily: "inherit",
  "@media (prefers-reduced-transparency: reduce), (prefers-contrast: more)": {
    backgroundColor: "#fff",
    backdropFilter: "none",
    borderColor: "var(--people-border-strong, #d6c8d3)",
  },
};

const medicationFormSx = {
  pt: 1,
  direction: "rtl",
  textAlign: "right",
  "& .MuiInputBase-root": { direction: "rtl", borderRadius: 3 },
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
};

const medicationFieldSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 44,
    backgroundColor: "#fff",
  },
};

const medicationMenuProps = {
  PaperProps: {
    sx: { direction: "rtl", textAlign: "right" },
  },
  MenuListProps: {
    sx: {
      direction: "rtl",
      "& .MuiMenuItem-root": {
        justifyContent: "flex-start",
        minHeight: 44,
        textAlign: "right",
      },
    },
  },
};

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
                bgcolor: "var(--people-surface, #fff)",
                boxShadow: "var(--people-shadow-card, 0 8px 24px rgba(31,31,35,0.07))",
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
              sx={{
                width: 44,
                height: 44,
                color: "var(--people-primary)",
                border: "1px solid var(--people-border, #e6e1e6)",
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "var(--people-primary-soft, #efe5ed)",
                },
                "&:active": { transform: "scale(0.96)" },
                "@media (prefers-reduced-motion: reduce)": {
                  "&:active": { transform: "none" },
                },
              }}
            >
              <AddRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress
              size={28}
              sx={{ color: "var(--people-primary)" }}
            />
          </Box>
        ) : isError ? (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            לא הצלחנו לטעון את התרופות
          </Alert>
        ) : medications.length === 0 ? (
          <Typography
            variant="body2"
            sx={{
              color: "var(--people-text-muted, #6d6670)",
              fontFamily: "inherit",
              py: 1,
            }}
          >
            לא הוגדרו תרופות
          </Typography>
        ) : (
          <Stack spacing={1}>
            {medications.map((medication) => (
              <Box
                key={medication.id}
                sx={{
                  border: "1px solid var(--people-border, #e6e1e6)",
                  borderRadius: 3,
                  p: 1.5,
                  minWidth: 0,
                  backgroundColor: "#fff",
                  boxShadow: "0 6px 18px rgba(31,31,35,0.045)",
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
                      color: "var(--people-text, #1f1f23)",
                      fontFamily: "inherit",
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
                        sx={{
                          width: 44,
                          height: 44,
                          color: "var(--people-primary)",
                          "&:hover": {
                            backgroundColor:
                              "var(--people-primary-soft, #efe5ed)",
                          },
                        }}
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
                        sx={{
                          width: 44,
                          height: 44,
                          color: "var(--people-danger, #b42318)",
                          "&:hover": {
                            backgroundColor:
                              "var(--people-danger-soft, #fff1ef)",
                          },
                        }}
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
                            color: "var(--people-text-muted, #6d6670)",
                            fontFamily: "inherit",
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
          sx={{
            mt: 1,
            minHeight: 44,
            color: "var(--people-primary)",
            fontFamily: "inherit",
            fontWeight: 800,
          }}
        >
          הוספת תרופה
        </Button>
      </Box>

      <Dialog
        open={isFormOpen}
        onClose={closeFormDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: medicationDialogPaperSx }}
        aria-labelledby="medication-form-title"
      >
        <DialogTitle
          id="medication-form-title"
          sx={{
            direction: "rtl",
            textAlign: "right",
            fontFamily: "inherit",
            fontWeight: 900,
            color: "var(--people-text, #1f1f23)",
            borderBottom: "1px solid var(--people-border, #e6e1e6)",
          }}
        >
          {editingMedication ? "עריכת תרופה" : "הוספת תרופה"}
        </DialogTitle>
        <DialogContent sx={{ direction: "rtl", textAlign: "right" }}>
          <Stack
            spacing={2}
            sx={medicationFormSx}
          >
            {formError && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: 3,
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
                helperText="שדה חובה"
                sx={{ ...medicationFieldSx, flex: "2 1 220px", minWidth: 0 }}
              />
              <TextField
                fullWidth
                label="מינון"
                value={form.dosage}
                onChange={handleFieldChange("dosage")}
                inputProps={{ maxLength: 100, inputMode: "decimal" }}
                helperText="לדוגמה: 5 מ״ג"
                sx={{ ...medicationFieldSx, flex: "1 1 120px", minWidth: 0 }}
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
                helperText="אופציונלי"
                sx={{ ...medicationFieldSx, flex: "1 1 160px", minWidth: 0 }}
                SelectProps={{ MenuProps: medicationMenuProps }}
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
                helperText="לדוגמה: בוקר וערב"
                sx={{
                  ...medicationFieldSx,
                  flex: "1.25 1 190px",
                  minWidth: 0,
                }}
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
              helperText="הנחיות לצוות בזמן פעילות"
              sx={medicationFieldSx}
            />
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="הערות"
              value={form.notes}
              onChange={handleFieldChange("notes")}
              inputProps={{ maxLength: 2000 }}
              helperText="אופציונלי"
              sx={medicationFieldSx}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, borderTop: "1px solid #e6e1e6" }}>
          <Button
            onClick={closeFormDialog}
            disabled={saveMutation.isPending}
            sx={{ minHeight: 44, borderRadius: 3 }}
          >
            ביטול
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className={classes.buttonContained}
          >
            {saveMutation.isPending ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <CircularProgress size={18} color="inherit" />
                <span>שומר...</span>
              </Stack>
            ) : (
              "שמירה"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!pendingDelete}
        onClose={() => !deleteMutation.isPending && setPendingDelete(null)}
        PaperProps={{
          sx: {
            ...medicationDialogPaperSx,
            maxWidth: 460,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "inherit", fontWeight: 900 }}>
          הסרת תרופה
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            <Typography sx={{ fontFamily: "inherit" }}>
              האם להסיר את התרופה {pendingDelete?.medicationName}?
            </Typography>
            {deleteError && (
              <Alert severity="error" sx={{ borderRadius: 3 }}>
                {deleteError}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setPendingDelete(null)}
            disabled={deleteMutation.isPending}
            sx={{ minHeight: 44, borderRadius: 3 }}
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
            sx={{ minHeight: 44, borderRadius: 3, fontWeight: 800 }}
          >
            {deleteMutation.isPending ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <CircularProgress size={18} color="inherit" />
                <span>מסיר...</span>
              </Stack>
            ) : (
              "הסרה"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
