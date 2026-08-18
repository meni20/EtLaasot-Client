import * as React from "react";
import { createPortal } from "react-dom";
import {
  Avatar,
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import attendeeService from "../../services/attendee.service";
import eventService from "../../services/event.service";
import type {
  IAttendees,
  IEventAssignmentEmailResult,
  IEventParticipants,
} from "../../interfaces/event.interface";
import type { IEventAtendeeDialogProps } from "./EventAtendeeDialog.interface";
import { useStyles } from "./EventAtendeeDialog.styles";
import { AddAttendeeDialog } from "../AddAttendeeDialog/AddAttendeeDialog";
import { useBranch } from "../../contexts/useBranch";
import { EventShabbatSheet } from "./EventShabbatSheet";
import { useAuth } from "../../contexts/useAuth";
import { AUTH_ROLES } from "../../constants/auth.const";
import {
  countUniqueEventParticipants,
  groupPairingsByTrainee,
} from "./eventPairing.utils";

export const EventAtendeeDialog: React.FC<IEventAtendeeDialogProps> = ({
  open,
  onClose,
  eventId,
  users,
  eventName,
  startDate,
  endDate,
  address,
}) => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const { activeBranch, availableBranches } = useBranch();
  const { user } = useAuth();
  const [isAddAttendeeOpen, setIsAddAttendeeOpen] = React.useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = React.useState(false);
  const [isAssignmentsDialogOpen, setIsAssignmentsDialogOpen] =
    React.useState(false);
  const [assignmentsResult, setAssignmentsResult] =
    React.useState<IEventAssignmentEmailResult | null>(null);
  const [assignmentsError, setAssignmentsError] = React.useState("");
  const [selectedMentorId, setSelectedMentorId] = React.useState<string | null>(
    null,
  );
  const [selectedTraineeId, setSelectedTraineeId] = React.useState<
    string | null
  >(null);

  const { data: participants, isFetching: isFetchingAttendees } = useQuery({
    queryKey: ["attendeesByEvent", eventId],
    queryFn: () => eventService.getEventParticipants(eventId),
    enabled: open,
  });

  const invalidateParticipants = React.useCallback(
    (refreshCurrentParticipants = true) => {
      if (refreshCurrentParticipants) {
        queryClient.invalidateQueries({
          queryKey: ["attendeesByEvent", eventId],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["printableEventParticipants", eventId],
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingEvents"] });
      queryClient.invalidateQueries({ queryKey: ["eventAttendees", eventId] });
      queryClient.invalidateQueries({ queryKey: ["eventAttendees"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    [eventId, queryClient],
  );

  const pairMutation = useMutation({
    mutationFn: ({
      mentorId,
      traineeId,
    }: {
      mentorId: string;
      traineeId: string;
    }) => eventService.createEventPairing(eventId, mentorId, traineeId),
    onMutate: async ({ mentorId, traineeId }) => {
      await queryClient.cancelQueries({
        queryKey: ["attendeesByEvent", eventId],
      });

      const previousParticipants = queryClient.getQueryData<IEventParticipants>(
        ["attendeesByEvent", eventId],
      );
      if (!previousParticipants) return { previousParticipants };

      const mentorAttendee = previousParticipants.unpairedMentors.find(
        (attendee) => (attendee.user?.id ?? attendee.userId) === mentorId,
      );
      const trainee = previousParticipants.paired.find(
        (pairing) => pairing.traineeId === traineeId,
      )?.trainee;

      if (mentorAttendee && trainee) {
        queryClient.setQueryData<IEventParticipants>(
          ["attendeesByEvent", eventId],
          {
            ...previousParticipants,
            paired: [
              ...previousParticipants.paired,
              {
                id: `pending-${mentorId}-${traineeId}`,
                eventId,
                mentorId,
                traineeId,
                mentor: mentorAttendee.user,
                trainee,
              },
            ],
            unpairedMentors: previousParticipants.unpairedMentors.filter(
              (attendee) => (attendee.user?.id ?? attendee.userId) !== mentorId,
            ),
          },
        );
      }

      return { previousParticipants };
    },
    onSuccess: async (updatedParticipants) => {
      await queryClient.cancelQueries({
        queryKey: ["attendeesByEvent", eventId],
      });
      queryClient.setQueryData(
        ["attendeesByEvent", eventId],
        updatedParticipants,
      );
      setSelectedMentorId(null);
      setSelectedTraineeId(null);
      invalidateParticipants(false);
    },
    onError: (_error, _variables, context) => {
      if (context?.previousParticipants) {
        queryClient.setQueryData(
          ["attendeesByEvent", eventId],
          context.previousParticipants,
        );
      }
    },
  });

  const deletePairingMutation = useMutation({
    mutationFn: (pairingId: string) =>
      eventService.deleteEventPairing(eventId, pairingId),
    onSuccess: async (updatedParticipants) => {
      await queryClient.cancelQueries({
        queryKey: ["attendeesByEvent", eventId],
      });
      queryClient.setQueryData(
        ["attendeesByEvent", eventId],
        updatedParticipants,
      );
      invalidateParticipants(false);
    },
  });

  const deleteAttendeeMutation = useMutation({
    mutationFn: (attendeeId: string) =>
      attendeeService.deleteAttendee(attendeeId),
    onSuccess: () => {
      invalidateParticipants();
    },
  });

  const paired = React.useMemo(
    () => participants?.paired ?? [],
    [participants?.paired],
  );
  const pairedGroups = React.useMemo(
    () => groupPairingsByTrainee(paired),
    [paired],
  );
  const pairedMentorIds = React.useMemo(
    () => new Set(paired.map((pairing) => pairing.mentorId)),
    [paired],
  );
  const unpairedMentors = React.useMemo(
    () =>
      (participants?.unpairedMentors ?? []).filter(
        (attendee) =>
          !pairedMentorIds.has(attendee.user?.id ?? attendee.userId),
      ),
    [pairedMentorIds, participants?.unpairedMentors],
  );
  const unpairedTrainees = participants?.unpairedTrainees ?? [];
  const branchName =
    availableBranches.find((branch) => branch.id === activeBranch)?.name ?? "";
  const totalCount = countUniqueEventParticipants(participants);
  const isMutating =
    pairMutation.isPending ||
    deletePairingMutation.isPending ||
    deleteAttendeeMutation.isPending;
  const isAdmin = Boolean(
    user?.roles?.some(
      (role) =>
        role.roleId === AUTH_ROLES.SUPER_ADMIN.id ||
        role.roleId === AUTH_ROLES.BRANCH_ADMIN.id,
    ),
  );

  const {
    data: printableParticipants,
    isFetching: isFetchingPrintableParticipants,
    isError: isPrintableParticipantsError,
  } = useQuery({
    queryKey: ["printableEventParticipants", eventId],
    queryFn: () => eventService.getPrintableEventParticipants(eventId),
    enabled: isPrintPreviewOpen && isAdmin,
  });

  const sendAssignmentsMutation = useMutation({
    mutationFn: () => eventService.sendEventAssignments(eventId),
    onSuccess: (result) => {
      setAssignmentsResult(result);
      setAssignmentsError("");
    },
    onError: () => {
      setAssignmentsError("לא הצלחנו לשלוח את השיבוצים. נסו שוב מאוחר יותר.");
    },
  });

  const createPairIfReady = (
    nextMentorId: string | null,
    nextTraineeId: string | null,
  ) => {
    if (nextMentorId && nextTraineeId && !pairMutation.isPending) {
      pairMutation.mutate({ mentorId: nextMentorId, traineeId: nextTraineeId });
    }
  };

  const handleMentorClick = (mentorId: string) => {
    const nextMentorId = selectedMentorId === mentorId ? null : mentorId;
    setSelectedMentorId(nextMentorId);
    createPairIfReady(nextMentorId, selectedTraineeId);
  };

  const handleTraineeClick = (traineeId: string) => {
    const nextTraineeId = selectedTraineeId === traineeId ? null : traineeId;
    setSelectedTraineeId(nextTraineeId);
    createPairIfReady(selectedMentorId, nextTraineeId);
  };

  const handlePairedTraineeClick = (traineeId: string) => {
    if (!selectedMentorId || pairMutation.isPending) return;

    setSelectedTraineeId(traineeId);
    pairMutation.mutate({ mentorId: selectedMentorId, traineeId });
  };

  const handleDeleteAttendee = (attendee: IAttendees) => {
    if (!attendee.id || deleteAttendeeMutation.isPending) return;

    deleteAttendeeMutation.mutate(attendee.id);
  };

  const openAssignmentsDialog = () => {
    setAssignmentsResult(null);
    setAssignmentsError("");
    setIsAssignmentsDialogOpen(true);
  };

  const closeAssignmentsDialog = () => {
    if (sendAssignmentsMutation.isPending) return;
    setIsAssignmentsDialogOpen(false);
  };

  const renderAttendee = (
    attendee: IAttendees,
    selected: boolean,
    onClick: () => void,
  ) => (
    <Box key={attendee.id ?? attendee.userId} className={classes.attendeeRow}>
      <Button
        className={`${classes.selectableItem} ${
          selected ? classes.selectedItem : ""
        }`}
        onClick={onClick}
        disabled={isMutating}
        aria-pressed={selected}
        aria-label={`בחר ${attendee.user?.name ?? "משתתף"} לשיבוץ`}
      >
        <Avatar className={classes.avatar}>
          {attendee.user?.name?.[0]?.toUpperCase() ?? "?"}
        </Avatar>
        <Box sx={{ minWidth: 0, textAlign: "right" }}>
          <Typography className={classes.personName}>
            {attendee.user?.name ?? "ללא שם"}
          </Typography>
          {attendee.user?.email && (
            <Typography className={classes.personMeta}>
              {attendee.user.email}
            </Typography>
          )}
        </Box>
      </Button>
      <Tooltip title="הסר מהאירוע">
        <Box component="span" className={classes.participantActions}>
          <IconButton
            size="small"
            className={classes.deleteButton}
            disabled={!attendee.id || deleteAttendeeMutation.isPending}
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteAttendee(attendee);
            }}
            aria-label="הסר מהאירוע"
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      </Tooltip>
    </Box>
  );

  const handlePrint = React.useCallback(async () => {
    await document.fonts?.ready;
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    window.print();
  }, []);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{ className: classes.dialogPaper }}
      >
        <Box className={classes.header}>
          רשומים לאירוע
          {!isFetchingAttendees && (
            <Typography className={classes.countBadge}>
              ({totalCount})
            </Typography>
          )}
          <Tooltip title="הוסף משתתף">
            <IconButton
              aria-label="הוסף משתתף"
              onClick={() => setIsAddAttendeeOpen(true)}
              className={classes.addButton}
              size="small"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {isAdmin && (
            <Tooltip title="שליחת שיבוצים">
              <Box
                component="span"
                className={classes.sendAssignmentsButtonWrap}
              >
                <IconButton
                  aria-label="שליחת שיבוצים"
                  onClick={openAssignmentsDialog}
                  className={classes.sendAssignmentsButton}
                  size="small"
                  disabled={sendAssignmentsMutation.isPending}
                >
                  <EmailOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Tooltip>
          )}
          {isAdmin && (
            <Tooltip title="הכנת דף שבת">
              <Box component="span" className={classes.printSheetButtonWrap}>
                <IconButton
                  aria-label="הכנת דף שבת"
                  onClick={() => setIsPrintPreviewOpen(true)}
                  className={classes.printSheetIconButton}
                  size="small"
                  disabled={isFetchingAttendees}
                >
                  <PrintOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Tooltip>
          )}
          <IconButton
            aria-label="סגירת חלון משתתפים"
            onClick={onClose}
            className={classes.closeButton}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box className={classes.dialogContent}>
          {isFetchingAttendees ? (
            <Box className={classes.loadingState}>
              <CircularProgress size={36} />
            </Box>
          ) : totalCount === 0 ? (
            <Box className={classes.emptyState}>
              <PeopleOutlineIcon
                sx={{ fontSize: 48, mb: 1, color: "text.disabled" }}
              />
              <Typography sx={{ color: "text.secondary", fontWeight: 700 }}>
                אין משתתפים רשומים
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {(pairMutation.isError ||
                deletePairingMutation.isError ||
                deleteAttendeeMutation.isError) && (
                <Alert severity="error">
                  הפעולה לא הושלמה. בדקו את החיבור ונסו שוב.
                </Alert>
              )}
              {selectedMentorId && !isMutating && (
                <Alert severity="info">
                  בחרו חניך כדי להשלים את השיבוץ, או לחצו שוב על החונך לביטול
                  הבחירה.
                </Alert>
              )}
              <Box className={classes.participantsGrid}>
                <Box className={classes.sectionColumn}>
                <Typography className={classes.sectionTitle}>
                  משובצים
                </Typography>
                <Box
                  className={`${classes.sectionBody} ${classes.pairedCardsGrid}`}
                >
                  {pairedGroups.length === 0 ? (
                    <Typography className={classes.sectionEmpty}>
                      אין שיבוצים
                    </Typography>
                  ) : (
                    pairedGroups.map((group) => (
                      <Box
                        key={group.traineeId}
                        className={`${classes.pairRow} ${
                          selectedMentorId && !isMutating
                            ? classes.availablePairingTarget
                            : ""
                        }`}
                        onClick={
                          selectedMentorId && !isMutating
                            ? () =>
                                handlePairedTraineeClick(group.traineeId)
                            : undefined
                        }
                        onKeyDown={(event) => {
                          if (
                            event.target !== event.currentTarget ||
                            !selectedMentorId ||
                            isMutating ||
                            (event.key !== "Enter" && event.key !== " ")
                          ) {
                            return;
                          }

                          event.preventDefault();
                          handlePairedTraineeClick(group.traineeId);
                        }}
                        role={
                          selectedMentorId && !isMutating
                            ? "button"
                            : undefined
                        }
                        tabIndex={
                          selectedMentorId && !isMutating ? 0 : undefined
                        }
                        aria-label={
                          selectedMentorId && !isMutating
                            ? `שבץ חונך נוסף ל${group.trainee?.name ?? "חניך"}`
                            : undefined
                        }
                      >
                        <Box className={classes.pairedMentorsList}>
                          {group.pairings.map((pairing) => (
                            <Box
                              key={pairing.id}
                              className={classes.pairedMentorRow}
                            >
                              <Box className={classes.pairedMentorInfo}>
                                <Avatar className={classes.mentorAvatar}>
                                  {pairing.mentor?.name?.[0]?.toUpperCase() ??
                                    "?"}
                                </Avatar>
                                <Typography className={classes.personName}>
                                  {pairing.mentor?.name ?? "ללא שם"}
                                </Typography>
                              </Box>
                              <Tooltip title="הסר שיבוץ">
                                <Box
                                  component="span"
                                  className={classes.participantActions}
                                >
                                  <IconButton
                                    size="small"
                                    className={classes.deleteButton}
                                    disabled={deletePairingMutation.isPending}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      deletePairingMutation.mutate(pairing.id);
                                    }}
                                    aria-label={`הסר את השיבוץ של ${
                                      pairing.mentor?.name ?? "החונך"
                                    }`}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Tooltip>
                            </Box>
                          ))}
                        </Box>

                        <Typography className={classes.pairDirection}>
                          ←
                        </Typography>

                        <Button
                          className={`${classes.pairedTraineeButton} ${
                            selectedTraineeId === group.traineeId
                              ? classes.selectedItem
                              : ""
                          }`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handlePairedTraineeClick(group.traineeId);
                          }}
                          disabled={!selectedMentorId || isMutating}
                          aria-label={
                            selectedMentorId
                              ? `שבץ חונך נוסף ל${group.trainee?.name ?? "חניך"}`
                              : undefined
                          }
                        >
                          <Avatar className={classes.mentorAvatar}>
                            {group.trainee?.name?.[0]?.toUpperCase() ?? "?"}
                          </Avatar>
                          <Typography className={classes.personName}>
                            {group.trainee?.name ?? "ללא שם"}
                          </Typography>
                          <AddIcon
                            className={`${classes.pairingTargetIcon} ${
                              selectedMentorId
                                ? classes.pairingTargetIconVisible
                                : ""
                            }`}
                            fontSize="small"
                          />
                        </Button>
                      </Box>
                    ))
                )}
              </Box>
                </Box>

                <Box className={classes.sectionColumn}>
                <Typography className={classes.sectionTitle}>
                  חונכים ללא שיבוץ
                </Typography>
                <Box className={classes.sectionBody}>
                  {unpairedMentors.length === 0 ? (
                    <Typography className={classes.sectionEmpty}>
                      אין חונכים ללא שיבוץ
                    </Typography>
                  ) : (
                    unpairedMentors.map((attendee) =>
                      renderAttendee(
                        attendee,
                        selectedMentorId ===
                          (attendee.user?.id ?? attendee.userId),
                        () =>
                          handleMentorClick(
                            attendee.user?.id ?? attendee.userId,
                          ),
                      ),
                    )
                )}
              </Box>
                </Box>

                <Box className={classes.sectionColumn}>
                <Typography className={classes.sectionTitle}>
                  חניכים ללא שיבוץ
                </Typography>
                <Box className={classes.sectionBody}>
                  {unpairedTrainees.length === 0 ? (
                    <Typography className={classes.sectionEmpty}>
                      אין חניכים ללא שיבוץ
                    </Typography>
                  ) : (
                    unpairedTrainees.map((attendee) =>
                      renderAttendee(
                        attendee,
                        selectedTraineeId ===
                          (attendee.user?.id ?? attendee.userId),
                        () =>
                          handleTraineeClick(
                            attendee.user?.id ?? attendee.userId,
                          ),
                      ),
                    )
                )}
              </Box>
                </Box>
              </Box>
            </Stack>
          )}
        </Box>
      </Dialog>

      <Dialog
        open={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ className: classes.printPreviewDialogPaper }}
      >
        <Box className={classes.printPreviewHeader}>
          <Typography className={classes.printPreviewTitle}>
            הכנת דף שבת
          </Typography>
          <IconButton
            aria-label="סגירת תצוגה מקדימה להדפסה"
            onClick={() => setIsPrintPreviewOpen(false)}
            className={classes.printPreviewCloseButton}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box className={classes.printDialogContent}>
          {isFetchingPrintableParticipants ? (
            <Box className={classes.loadingState}>
              <CircularProgress size={36} />
            </Box>
          ) : isPrintableParticipantsError ? (
            <Alert severity="error">
              לא הצלחנו לטעון את פרטי המשתתפים לדף השבת
            </Alert>
          ) : (
            <EventShabbatSheet
              classes={classes}
              participants={printableParticipants}
              eventName={eventName}
              startDate={startDate}
              endDate={endDate}
              address={address}
              branchName={branchName}
            />
          )}
        </Box>

        <DialogActions className={classes.printPreviewActions}>
          <Button
            className={classes.printPrimaryButton}
            startIcon={<PrintOutlinedIcon />}
            onClick={handlePrint}
            disabled={
              isFetchingPrintableParticipants ||
              isPrintableParticipantsError ||
              !printableParticipants
            }
          >
            הדפסה / שמירה כ-PDF
          </Button>
          <Button
            className={classes.printSecondaryButton}
            onClick={() => setIsPrintPreviewOpen(false)}
          >
            סגירה
          </Button>
        </DialogActions>
      </Dialog>

      {isPrintPreviewOpen &&
        printableParticipants &&
        typeof document !== "undefined" &&
        createPortal(
          <Box
            className={`${classes.printHost} shabbat-print-host`}
            aria-hidden="true"
          >
            <EventShabbatSheet
              classes={classes}
              participants={printableParticipants}
              eventName={eventName}
              startDate={startDate}
              endDate={endDate}
              address={address}
              branchName={branchName}
              printRoot
            />
          </Box>,
          document.body,
        )}

      <Dialog
        open={isAssignmentsDialogOpen}
        onClose={closeAssignmentsDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { direction: "rtl", borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 800,
            color: "text.primary",
          }}
        >
          שליחת שיבוצים
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography>
              שליחת מייל אישי לחונכים הרשומים לאירוע "{eventName}" עם פרטי
              ההשתתפות והשיבוץ שלהם.
            </Typography>
            {assignmentsError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {assignmentsError}
              </Alert>
            )}

            {assignmentsResult && (
              <Alert
                severity={
                  assignmentsResult.failedCount > 0 ? "warning" : "success"
                }
                sx={{ borderRadius: 2 }}
              >
                <Typography sx={{ fontWeight: 800, mb: 0.75 }}>
                  סיכום שליחה
                </Typography>
                <Typography>
                  נרשמים: {assignmentsResult.totalRegisteredAttendees}
                </Typography>
                <Typography>
                  חונכים רשומים: {assignmentsResult.totalAttendingMentors}
                </Typography>
                <Typography>
                  חניכים רשומים: {assignmentsResult.totalAttendingTrainees}
                </Typography>
                <Typography>
                  נשלחו בהצלחה: {assignmentsResult.sentCount}
                </Typography>
                <Typography>
                  דולגו ללא אימייל: {assignmentsResult.skippedCount}
                </Typography>
                <Typography>נכשלו: {assignmentsResult.failedCount}</Typography>
              </Alert>
            )}

            {assignmentsResult?.skipped.length ? (
              <Box>
                <Typography sx={{ fontWeight: 800, mb: 0.5 }}>דולגו</Typography>
                {assignmentsResult.skipped.map((entry) => (
                  <Typography key={entry.userId} sx={{ fontSize: 13 }}>
                    {entry.name} ({entry.userId})
                  </Typography>
                ))}
              </Box>
            ) : null}

            {assignmentsResult?.failed.length ? (
              <Box>
                <Typography sx={{ fontWeight: 800, mb: 0.5 }}>נכשלו</Typography>
                {assignmentsResult.failed.map((entry) => (
                  <Typography key={entry.userId} sx={{ fontSize: 13 }}>
                    {entry.name} ({entry.userId})
                  </Typography>
                ))}
              </Box>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={closeAssignmentsDialog}
            disabled={sendAssignmentsMutation.isPending}
          >
            {assignmentsResult ? "סגירה" : "ביטול"}
          </Button>
          {!assignmentsResult && (
            <Button
              variant="contained"
              onClick={() => sendAssignmentsMutation.mutate()}
              disabled={sendAssignmentsMutation.isPending}
            >
              {sendAssignmentsMutation.isPending ? "שולח..." : "שליחת שיבוצים"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {isAddAttendeeOpen && (
        <AddAttendeeDialog
          eventId={eventId}
          open={isAddAttendeeOpen}
          onClose={() => setIsAddAttendeeOpen(false)}
          users={users || []}
        />
      )}
    </>
  );
};
