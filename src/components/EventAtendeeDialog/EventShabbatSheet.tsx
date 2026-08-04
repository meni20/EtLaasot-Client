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
import type { useStyles } from "./EventAtendeeDialog.styles";

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

const renderParticipant = (
  user: IUser | undefined,
  classes: ShabbatSheetClasses,
) => {
  const allergies = user?.allergies?.trim();
  const shirtSize = user?.shirtSize
    ? formatShirtSize(user.shirtSize, user.customShirtSize)
    : null;

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
    </Box>
  );
};

const renderAttendeeNames = (
  attendees: IAttendees[],
  emptyText: string,
  classes: ShabbatSheetClasses,
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
            <TableCell>{renderParticipant(attendee.user, classes)}</TableCell>
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
  const unpairedMentors = participants?.unpairedMentors ?? [];
  const unpairedTrainees = participants?.unpairedTrainees ?? [];

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

      <Box className={classes.printSection}>
        <Typography className={classes.printSectionTitle}>משובצים</Typography>
        {paired.length === 0 ? (
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
              {paired.map((pair) => (
                <TableRow key={pair.id}>
                  <TableCell>
                    {renderParticipant(pair.mentor, classes)}
                  </TableCell>
                  <TableCell>
                    {renderParticipant(pair.trainee, classes)}
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
        {renderAttendeeNames(unpairedTrainees, "אין חניכים ללא חונך", classes)}
      </Box>
    </Box>
  );
};
