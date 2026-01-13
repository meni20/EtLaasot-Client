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
import type { IVolunteerDetailsProps } from "./Volunteer.interface";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";

export const VolunteerDetails: React.FC<IVolunteerDetailsProps> = ({
  open,
  onClose,
  volunteerData,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.75,
          background:
            "linear-gradient(135deg, rgba(25,118,210,0.14), rgba(156,39,176,0.10))",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              fontWeight: 900,
              fontFamily: "Rubik",
            }}
          >
            {initials(volunteerData?.name)}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900, fontFamily: "Rubik" }}
              noWrap
            >
              {volunteerData?.name ?? "Volunteer"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontFamily: "Rubik" }}
              noWrap
            >
              ID: {volunteerData?.id ?? "—"} • Age: {volunteerData?.age ?? "—"}
            </Typography>
          </Box>

          <IconButton onClick={onClose} aria-label="close">
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 2 }}>
        <Row
          icon={<BadgeRoundedIcon fontSize="small" />}
          label="ID"
          value={volunteerData?.id}
          onCopy={volunteerData?.id ? () => copy(volunteerData.id) : undefined}
        />
        <Divider />

        <Row
          icon={<CakeRoundedIcon fontSize="small" />}
          label="Age"
          value={volunteerData?.age}
        />
        <Divider />

        <Row
          icon={<EmailRoundedIcon fontSize="small" />}
          label="Email"
          value={volunteerData?.email}
          onCopy={
            volunteerData?.email ? () => copy(volunteerData.email) : undefined
          }
        />
        <Divider />

        <Row
          icon={<PhoneIphoneRoundedIcon fontSize="small" />}
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
          icon={<LocationOnRoundedIcon fontSize="small" />}
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
            sx={{ borderRadius: 3 }}
          >
            Email
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PhoneIphoneRoundedIcon />}
            disabled={!volunteerData?.phoneNumber}
            sx={{ borderRadius: 3 }}
          >
            Call
          </Button>
        </Stack>

        <Button onClick={onClose} fullWidth sx={{ mt: 1.2, borderRadius: 3 }}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};
