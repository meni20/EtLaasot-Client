import {
  Box,
  Stack,
  Button,
  Avatar,
  Chip,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import React from "react";
import { Row } from "./Row/RowDetails";
import { copy, initials } from "./utilities/data.util";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import type { IVolunteerDetailsProps } from "./Volunteer.interface";
import { useVolunteerDetailsStyles } from "./VolunteerDetails.styles";

const formatDate = (value?: Date | string | null) => {
  if (!value) return "לא זמין";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "לא זמין";

  return date.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const VolunteerDetails: React.FC<IVolunteerDetailsProps> = ({
  open,
  onClose,
  volunteerData,
  entityLabel = "מתנדב",
}) => {
  const classes = useVolunteerDetailsStyles();
  const emailHref = volunteerData?.email
    ? `mailto:${volunteerData.email}`
    : undefined;
  const phoneHref = volunteerData?.phoneNumber
    ? `tel:${volunteerData.phoneNumber}`
    : undefined;
  const createdAt = formatDate(volunteerData?.createdAt);
  const updatedAt = formatDate(volunteerData?.updatedAt);

  if (!open) return null;

  return (
    <Box
      className={classes.panel}
      role="complementary"
      aria-label={`פרטי ${entityLabel}`}
    >
      <Box className={classes.header}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar className={classes.avatar}>
            {initials(volunteerData?.name)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" className={classes.nameText} noWrap>
              {volunteerData?.name ?? entityLabel}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              className={classes.headerMeta}
            >
              <Typography variant="body2" className={classes.subText} noWrap>
                ת.ז: {volunteerData?.id ?? "—"}
              </Typography>
              <Chip label="פעיל" size="small" className={classes.statusChip} />
            </Stack>
          </Box>
          <IconButton
            onClick={onClose}
            aria-label={`סגור פרטי ${entityLabel}`}
            className={classes.closeIconButton}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </Box>

      <Box className={classes.content}>
        <Box className={classes.section}>
          <Typography className={classes.sectionTitle}>פרטים אישיים</Typography>
          <Row
            icon={
              <CakeRoundedIcon className={classes.rowIcon} fontSize="small" />
            }
            label="גיל"
            value={volunteerData?.age}
          />
          <Divider />
          <Row
            icon={
              <BadgeRoundedIcon className={classes.rowIcon} fontSize="small" />
            }
            label="תעודת זהות"
            value={volunteerData?.id}
            onCopy={
              volunteerData?.id ? () => copy(volunteerData.id) : undefined
            }
          />
        </Box>

        <Box className={classes.section}>
          <Typography className={classes.sectionTitle}>פרטי קשר</Typography>
          <Row
            icon={
              <PhoneIphoneRoundedIcon
                className={classes.rowIcon}
                fontSize="small"
              />
            }
            label="טלפון"
            value={volunteerData?.phoneNumber}
            onCopy={
              volunteerData?.phoneNumber
                ? () => copy(volunteerData.phoneNumber)
                : undefined
            }
          />
          <Divider />
          <Row
            icon={
              <EmailRoundedIcon className={classes.rowIcon} fontSize="small" />
            }
            label="אימייל"
            value={volunteerData?.email}
            onCopy={
              volunteerData?.email
                ? () => copy(volunteerData.email)
                : undefined
            }
          />
          <Divider />
          <Row
            icon={
              <LocationOnRoundedIcon
                className={classes.rowIcon}
                fontSize="small"
              />
            }
            label="כתובת"
            value={volunteerData?.address}
            onCopy={
              volunteerData?.address
                ? () => copy(volunteerData.address)
                : undefined
            }
          />
        </Box>

        <Box className={classes.section}>
          <Typography className={classes.sectionTitle}>מידע מערכת</Typography>
          <Row
            icon={
              <EventRoundedIcon className={classes.rowIcon} fontSize="small" />
            }
            label="תאריך יצירה"
            value={createdAt}
          />
          <Divider />
          <Row
            icon={
              <UpdateRoundedIcon className={classes.rowIcon} fontSize="small" />
            }
            label="עודכן לאחרונה"
            value={updatedAt}
          />
          {volunteerData?.branchId && (
            <>
              <Divider />
              <Row
                icon={
                  <AccountTreeRoundedIcon
                    className={classes.rowIcon}
                    fontSize="small"
                  />
                }
                label="מזהה סניף"
                value={volunteerData.branchId}
                onCopy={() => copy(volunteerData.branchId)}
              />
            </>
          )}
        </Box>

        <Stack direction="row" spacing={1} className={classes.actionsRow}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<EmailRoundedIcon />}
            disabled={!volunteerData?.email}
            className={classes.buttonContained}
            href={emailHref}
            aria-label={`שליחת אימייל ל${entityLabel}`}
          >
            שליחת אימייל
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PhoneIphoneRoundedIcon />}
            disabled={!volunteerData?.phoneNumber}
            className={classes.buttonOutlined}
            href={phoneHref}
            aria-label={`התקשרות ל${entityLabel}`}
          >
            התקשרות
          </Button>
        </Stack>

        <Button
          onClick={onClose}
          fullWidth
          className={classes.closeButton}
          sx={{ mt: 1.2 }}
        >
          סגור
        </Button>
      </Box>
    </Box>
  );
};
