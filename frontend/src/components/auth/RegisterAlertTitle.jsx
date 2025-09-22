import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SpecialisationJobs from "../data/SpecialisationJobs";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RegisterAlertTitle({
  openAlert,
  setOpenAlert,
  setSpecialisationTitle,
}) {
  const [customTitle, setCustomTitle] = useState("");

   // redux states
  const { currentMode } = useSelector((state) => state.appUI);
  const isDarkMode=currentMode==='dark'

  // close alert
  const handleClose = () => {
    setOpenAlert(false);
  };

  // handle info entered by the user before closing the modal
  const handleEnterInfo = () => {
    // update the array then set the value of the user before close
    SpecialisationJobs && SpecialisationJobs.push(customTitle);
    setSpecialisationTitle(customTitle);
    handleClose();
  };

  //   handle when user dismissed the dialog
  const handleDismiss = () => {
    setSpecialisationTitle("");
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        maxWidth={500}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle 
        variant="body2"
        sx={{
              background: !isDarkMode && 
              "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
          }}
        >
        Preferred Title
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText 
          variant="body2"
          id="alert-dialog-slide-text">
            Provide your specialisation title that is relevant to the
            IT Industry.
          </DialogContentText>

          <TextField
            autoFocus
            required
            margin="dense"
            id="custom-title"
            name="custom-title"
            label="custom title"
            fullWidth
            onChange={(e) => setCustomTitle(e.target.value)}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDismiss}>Back</Button>
          <Button disabled={!customTitle} onClick={handleEnterInfo}>Enter</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
