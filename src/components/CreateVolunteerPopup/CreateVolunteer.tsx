import {
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";

export const CreateVolunteer = () => {
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={() => {}}>
        Open dialog
      </Button>

      <Dialog
        open={true}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Create Volunteer
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {}}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box sx={{display: "flex", gap: 3}}>
            <Box sx={{display: "flex", flexDirection: "column", gap: 4}}>
              <TextField label={"name"}/>
              <TextField label={"ID"}/>
              <TextField label={"age"}/>
            </Box>
            <Box sx={{display: "flex", flexDirection: "column", gap: 4}}>
              <TextField label={"Phone number"}/>
              <TextField label={"address"}/>
              <TextField label={"Email"}/>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => {}}>
            Create Volunteer
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
