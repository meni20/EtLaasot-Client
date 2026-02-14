import {
  Box,
  Stack,
  Button,
  Avatar,
  Dialog,
  Divider,
  Typography,
  IconButton,
  DialogContent,
} from "@mui/material";
import React from "react";
import { Row } from "./Row/RowDetails";
import { copy, initials } from "./utilities/data.util";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import type { IVolunteerDetailsProps } from "./Volunteer.interface";
import { useVolunteerDetailsStyles } from "./VolunteerDetails.styles";

export const VolunteerDetails: React.FC<IVolunteerDetailsProps> = ({
  open,
  onClose,
  volunteerData,
}) => {
  const classes = useVolunteerDetailsStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ className: classes.paper }}
    >
      <Box className={classes.header}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar className={classes.avatar}>
            {initials(volunteerData?.name)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" className={classes.nameText} noWrap>
              {volunteerData?.name ?? "Volunteer"}
            </Typography>
            <Typography variant="body2" className={classes.subText} noWrap>
              ID: {volunteerData?.id ?? "—"} • Age: {volunteerData?.age ?? "—"}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            aria-label="close"
            sx={{ color: "#fff" }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent className={classes.content}>
        <Row
          icon={
            <BadgeRoundedIcon className={classes.rowIcon} fontSize="small" />
          }
          label="ID"
          value={volunteerData?.id}
          onCopy={volunteerData?.id ? () => copy(volunteerData.id) : undefined}
        />
        <Divider />
        <Row
          icon={
            <CakeRoundedIcon className={classes.rowIcon} fontSize="small" />
          }
          label="Age"
          value={volunteerData?.age}
        />
        <Divider />
        <Row
          icon={
            <EmailRoundedIcon className={classes.rowIcon} fontSize="small" />
          }
          label="Email"
          value={volunteerData?.email}
          onCopy={
            volunteerData?.email ? () => copy(volunteerData.email) : undefined
          }
        />
        <Divider />
        <Row
          icon={
            <PhoneIphoneRoundedIcon
              className={classes.rowIcon}
              fontSize="small"
            />
          }
          label="Phone"
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
            <LocationOnRoundedIcon
              className={classes.rowIcon}
              fontSize="small"
            />
          }
          label="Address"
          value={volunteerData?.address}
          onCopy={
            volunteerData?.address
              ? () => copy(volunteerData.address)
              : undefined
          }
        />

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<EmailRoundedIcon />}
            disabled={!volunteerData?.email}
            className={classes.buttonContained}
          >
            Email
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PhoneIphoneRoundedIcon />}
            disabled={!volunteerData?.phoneNumber}
            className={classes.buttonOutlined}
          >
            Call
          </Button>
        </Stack>

        <Button
          onClick={onClose}
          fullWidth
          className={classes.closeButton}
          sx={{ mt: 1.2 }}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};
