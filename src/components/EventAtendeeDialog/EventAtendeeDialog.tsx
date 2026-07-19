import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import attendeeService from "../../services/attendee.service";
import eventService from "../../services/event.service";
import type { IAttendees } from "../../interfaces/event.interface";
import type { IEventAtendeeDialogProps } from "./EventAtendeeDialog.interface";
import { useStyles } from "./EventAtendeeDialog.styles";
import { AddAttendeeDialog } from "../AddAttendeeDialog/AddAttendeeDialog";
import { useBranch } from "../../contexts/useBranch";
import { EventShabbatSheet } from "./EventShabbatSheet";

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
  const [isAddAttendeeOpen, setIsAddAttendeeOpen] = React.useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = React.useState(false);
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

  const invalidateParticipants = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["attendeesByEvent", eventId] });
    queryClient.invalidateQueries({ queryKey: ["events"] });
    queryClient.invalidateQueries({ queryKey: ["upcomingEvents"] });
    queryClient.invalidateQueries({ queryKey: ["eventAttendees", eventId] });
    queryClient.invalidateQueries({ queryKey: ["eventAttendees"] });
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  }, [eventId, queryClient]);

  const pairMutation = useMutation({
    mutationFn: ({
      mentorId,
      traineeId,
    }: {
      mentorId: string;
      traineeId: string;
    }) => eventService.createEventPairing(eventId, mentorId, traineeId),
    onSuccess: (updatedParticipants) => {
      queryClient.setQueryData(
        ["attendeesByEvent", eventId],
        updatedParticipants,
      );
      setSelectedMentorId(null);
      setSelectedTraineeId(null);
      invalidateParticipants();
    },
  });

  const deletePairingMutation = useMutation({
    mutationFn: (pairingId: string) =>
      eventService.deleteEventPairing(eventId, pairingId),
    onSuccess: (updatedParticipants) => {
      queryClient.setQueryData(
        ["attendeesByEvent", eventId],
        updatedParticipants,
      );
      invalidateParticipants();
    },
  });

  const deleteAttendeeMutation = useMutation({
    mutationFn: (attendeeId: string) => attendeeService.deleteAttendee(attendeeId),
    onSuccess: () => {
      invalidateParticipants();
    },
  });

  const paired = participants?.paired ?? [];
  const unpairedMentors = participants?.unpairedMentors ?? [];
  const unpairedTrainees = participants?.unpairedTrainees ?? [];
  const branchName =
    availableBranches.find((branch) => branch.id === activeBranch)?.name ?? "";
  const totalCount =
    paired.length * 2 + unpairedMentors.length + unpairedTrainees.length;
  const isMutating =
    pairMutation.isPending ||
    deletePairingMutation.isPending ||
    deleteAttendeeMutation.isPending;

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

  const handleDeleteAttendee = (attendee: IAttendees) => {
    if (!attendee.id || deleteAttendeeMutation.isPending) return;

    deleteAttendeeMutation.mutate(attendee.id);
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
            <Typography className={classes.countBadge}>({totalCount})</Typography>
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
          <IconButton
            aria-label="close"
            onClick={onClose}
            className={classes.closeButton}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box className={classes.dialogContent}>
          <Box className={classes.dialogToolbar}>
            <Button
              className={classes.printSheetButton}
              startIcon={<PrintOutlinedIcon fontSize="small" />}
              onClick={() => setIsPrintPreviewOpen(true)}
              disabled={isFetchingAttendees}
            >
              הכנת דף שבת
            </Button>
          </Box>

          {isFetchingAttendees ? (
            <Box className={classes.loadingState}>
              <CircularProgress sx={{ color: "#9a5188" }} size={36} />
            </Box>
          ) : totalCount === 0 ? (
            <Box className={classes.emptyState}>
              <PeopleOutlineIcon sx={{ fontSize: 48, mb: 1, color: "#ddd" }} />
              <Typography sx={{ fontFamily: "Rubik", color: "#bbb" }}>
                אין משתתפים רשומים
              </Typography>
            </Box>
          ) : (
            <Box className={classes.participantsGrid}>
              <Box className={classes.sectionColumn}>
                <Typography className={classes.sectionTitle}>משובצים</Typography>
                <Box className={classes.sectionBody}>
                  {paired.length === 0 ? (
                    <Typography className={classes.sectionEmpty}>
                      אין שיבוצים
                    </Typography>
                  ) : (
                    paired.map((pair) => (
                      <Box key={pair.id} className={classes.pairRow}>
                        <Box className={classes.pairContent}>
                          <Box className={classes.pairPerson}>
                            <Avatar className={classes.avatar}>
                              {pair.mentor?.name?.[0]?.toUpperCase() ?? "?"}
                            </Avatar>
                            <Typography className={classes.personName}>
                              {pair.mentor?.name ?? "ללא שם"}
                            </Typography>
                          </Box>
                          <Typography className={classes.pairDivider}>
                            ←
                          </Typography>
                          <Box className={classes.pairPerson}>
                            <Typography className={classes.personName}>
                              {pair.trainee?.name ?? "ללא שם"}
                            </Typography>
                            <Avatar className={classes.avatar}>
                              {pair.trainee?.name?.[0]?.toUpperCase() ?? "?"}
                            </Avatar>
                          </Box>
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
                                deletePairingMutation.mutate(pair.id);
                              }}
                              aria-label="הסר שיבוץ"
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Tooltip>
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
                          handleMentorClick(attendee.user?.id ?? attendee.userId),
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
          <Typography className={classes.printPreviewTitle}>הכנת דף שבת</Typography>
          <IconButton
            aria-label="close"
            onClick={() => setIsPrintPreviewOpen(false)}
            className={classes.printPreviewCloseButton}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box className={classes.printDialogContent}>
          <EventShabbatSheet
            classes={classes}
            participants={participants}
            eventName={eventName}
            startDate={startDate}
            endDate={endDate}
            address={address}
            branchName={branchName}
          />
        </Box>

        <DialogActions className={classes.printPreviewActions}>
          <Button
            className={classes.printPrimaryButton}
            startIcon={<PrintOutlinedIcon />}
            onClick={() => window.print()}
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
