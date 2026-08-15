import * as React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type {
  IAttendees,
  IEventParticipants,
} from "../../interfaces/event.interface";
import type { IUser } from "../../interfaces/user.interface";
import { formatShirtSize } from "../../constants/user.constants";
import { formatMedicationFrequency } from "../../constants/trainee-medication.constants";
import type { useStyles } from "./EventAtendeeDialog.styles";
import { groupPairingsByTrainee } from "./eventPairing.utils";

type ShabbatSheetClasses = ReturnType<typeof useStyles>;

interface IEventShabbatSheetProps {
  classes: ShabbatSheetClasses;
  participants?: IEventParticipants;
  eventName?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  address?: string;
  branchName?: string;
  printRoot?: boolean;
}

const toDate = (value?: Date | string) => {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value?: Date | string) => {
  const date = toDate(value);
  if (!date) return "-";

  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const formatHebrewDate = (value?: Date | string) => {
  const date = toDate(value);
  if (!date) return "-";

  return new Intl.DateTimeFormat("he-IL-u-ca-hebrew", {
    day: "numeric",
    month: "long",
  }).format(date);
};

const formatTime = (value?: Date | string) => {
  const date = toDate(value);
  if (!date) return "-";

  return new Intl.DateTimeFormat("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getName = (name?: string | null) => name || "-";

const SHIRT_SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

const getShirtSizeSummary = (participants?: IEventParticipants) => {
  const usersById = new Map<string, IUser>();
  const addUser = (user?: IUser) => {
    if (user?.id && !usersById.has(user.id)) {
      usersById.set(user.id, user);
    }
  };

  participants?.paired.forEach((pair) => {
    addUser(pair.mentor);
    addUser(pair.trainee);
  });
  participants?.unpairedMentors.forEach((attendee) => addUser(attendee.user));
  participants?.unpairedTrainees.forEach((attendee) => addUser(attendee.user));

  const counts = new Map<string, { label: string; count: number }>();
  usersById.forEach((user) => {
    if (!user.shirtSize) return;

    const label = formatShirtSize(user.shirtSize, user.customShirtSize).trim();
    if (!label || label === "-") return;

    const key = label.toLocaleUpperCase("he-IL");
    const current = counts.get(key);
    counts.set(key, {
      label: current?.label ?? label,
      count: (current?.count ?? 0) + 1,
    });
  });

  return Array.from(counts.values()).sort((a, b) => {
    const aIndex = SHIRT_SIZE_ORDER.indexOf(a.label.toUpperCase());
    const bIndex = SHIRT_SIZE_ORDER.indexOf(b.label.toUpperCase());
    const aRank = aIndex === -1 ? SHIRT_SIZE_ORDER.length : aIndex;
    const bRank = bIndex === -1 ? SHIRT_SIZE_ORDER.length : bIndex;

    return aRank - bRank || a.label.localeCompare(b.label, "he");
  });
};

const renderParticipant = (
  user: IUser | undefined,
  classes: ShabbatSheetClasses,
  showMedications = false,
) => {
  const allergies = user?.allergies?.trim();
  const shirtSize = user?.shirtSize
    ? formatShirtSize(user.shirtSize, user.customShirtSize)
    : null;
  const activeMedications = showMedications
    ? (user?.traineeMedications ?? []).filter(
        (medication) => medication.isActive,
      )
    : [];

  return (
    <Box className={classes.printParticipantDetails}>
      <Typography className={classes.printParticipantName}>
        {getName(user?.name)}
      </Typography>
      {shirtSize && (
        <Typography className={classes.printParticipantMeta}>
          <Box component="span" className={classes.printParticipantLabel}>
            מידת חולצה:
          </Box>{" "}
          {shirtSize}
        </Typography>
      )}
      {allergies && (
        <Typography className={classes.printParticipantMeta}>
          <Box component="span" className={classes.printParticipantLabel}>
            אלרגיות:
          </Box>{" "}
          {allergies}
        </Typography>
      )}
      {activeMedications.length > 0 && (
        <Box className={classes.printParticipantMeta}>
          <Box component="span" className={classes.printParticipantLabel}>
            תרופות:
          </Box>
          {activeMedications.map((medication) => (
            <Box component="span" display="block" key={medication.id}>
              {[
                medication.medicationName,
                medication.dosage?.trim() || "-",
                formatMedicationFrequency(medication.frequency) || "-",
                medication.schedule?.trim() || "-",
              ].join(" — ")}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

const renderAttendeeNames = (
  attendees: IAttendees[],
  emptyText: string,
  classes: ShabbatSheetClasses,
  showMedications = false,
) => {
  if (attendees.length === 0) {
    return (
      <Typography className={classes.printEmptyText}>{emptyText}</Typography>
    );
  }

  return (
    <Table size="small" className={classes.printTable}>
      <TableBody>
        {attendees.map((attendee) => (
          <TableRow key={attendee.id ?? attendee.userId}>
            <TableCell>
              {renderParticipant(attendee.user, classes, showMedications)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const EventShabbatSheet: React.FC<IEventShabbatSheetProps> = ({
  classes,
  participants,
  eventName,
  startDate,
  endDate,
  address,
  branchName,
  printRoot = false,
}) => {
  const paired = participants?.paired ?? [];
  const pairedGroups = groupPairingsByTrainee(paired);
  const unpairedMentors = participants?.unpairedMentors ?? [];
  const unpairedTrainees = participants?.unpairedTrainees ?? [];
  const shirtSizeSummary = getShirtSizeSummary(participants);

  const eventInfo = [
    { label: "אירוע", value: eventName || "-" },
    { label: "תאריך", value: formatDate(startDate) },
    { label: "תאריך עברי", value: formatHebrewDate(startDate) },
    {
      label: "שעה",
      value: `${formatTime(startDate)} - ${formatTime(endDate)}`,
    },
    { label: "סניף", value: branchName || "-" },
    { label: "מיקום", value: address || "-" },
  ];

  return (
    <Box
      className={`${classes.shabbatSheet}${printRoot ? " shabbat-print-root" : ""}`}
      dir="rtl"
    >
      <Box className={classes.printTitleBlock}>
        <Typography className={classes.printOrgTitle}>עת לעשות</Typography>
        <Typography className={classes.printDocumentTitle}>דף שבת</Typography>
      </Box>

      <Box className={classes.printEventInfoGrid}>
        {eventInfo.map((item) => (
          <Box key={item.label} className={classes.printEventInfoItem}>
            <Typography className={classes.printInfoLabel}>
              {item.label}
            </Typography>
            <Typography className={classes.printInfoValue}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {shirtSizeSummary.length > 0 && (
        <Box className={classes.printShirtSizeSummary}>
          <Typography className={classes.printShirtSizeSummaryTitle}>
            מידות חולצה:
          </Typography>
          <Box className={classes.printShirtSizeSummaryItems}>
            {shirtSizeSummary.map(({ label, count }) => (
              <Typography
                key={label}
                className={classes.printShirtSizeSummaryItem}
              >
                {label} – {count}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      <Box className={classes.printSection}>
        <Typography className={classes.printSectionTitle}>משובצים</Typography>
        {pairedGroups.length === 0 ? (
          <Typography className={classes.printEmptyText}>
            אין משובצים
          </Typography>
        ) : (
          <Table size="small" className={classes.printTable}>
            <TableHead>
              <TableRow>
                <TableCell>חונך</TableCell>
                <TableCell>חניך</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pairedGroups.map((group) => (
                <TableRow key={group.traineeId}>
                  <TableCell>
                    <Box className={classes.printPairedMentors}>
                      {group.pairings.map((pairing) => (
                        <React.Fragment key={pairing.id}>
                          {renderParticipant(pairing.mentor, classes)}
                        </React.Fragment>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {renderParticipant(group.trainee, classes, true)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      <Box className={classes.printSection}>
        <Typography className={classes.printSectionTitle}>
          חונכים ללא חניך
        </Typography>
        {renderAttendeeNames(unpairedMentors, "אין חונכים ללא חניך", classes)}
      </Box>

      <Box className={classes.printSection}>
        <Typography className={classes.printSectionTitle}>
          חניכים ללא חונך
        </Typography>
        {renderAttendeeNames(
          unpairedTrainees,
          "אין חניכים ללא חונך",
          classes,
          true,
        )}
      </Box>
    </Box>
  );
};
