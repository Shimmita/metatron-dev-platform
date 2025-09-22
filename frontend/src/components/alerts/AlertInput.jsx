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
import SubsectionTech from "../data/SubsectionTech";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertInput({
  openAlert,
  setOpenAlert,
  setCustomArea,
  body = "",
  title = "",
}) {
  // redux states
  const {currentMode } = useSelector((state) => state.appUI);
  const isDarkMode=currentMode==='dark'
  
  const [customTitle, setCustomTitle] = useState("");

  const handleClose = () => {
    // close alert
    setOpenAlert(false);
  };

  // handle info entered by the user before closing the modal
  const handleEnterInfo = () => {
    // update the array then set the value of the user before close
    if (SubsectionTech?.MachineLearning?.includes(customTitle)) {
      return;
    } else {
      SubsectionTech.MachineLearning.push(customTitle);
      setCustomArea(customTitle);
      handleClose();
    }
  };

  //   handle when user dismissed the dialog
  const handleDismiss = () => {
    setCustomArea("");
    handleClose();
  };



  return (
      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        maxWidth={400}
        aria-describedby="alert-dialog-slide-input"
        sx={{
          backdropFilter:'blur(5px)'
        }}
      >
        <DialogTitle
         variant="body2"
          sx={{
              background: !isDarkMode && 
              "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
          }}
         >
         {title}
         </DialogTitle>
        <DialogContent>
          <DialogContentText 
          variant="body2"
           id="alert-dialog-slide-input">
            {body}
          </DialogContentText>

          <TextField
            autoFocus
            required
            margin="dense"
            id="custom_area"
            label={"preferred area"}
            fullWidth
            onChange={(e) => setCustomTitle(e.target.value)}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDismiss}>Back</Button>
          <Button
            disabled={customTitle.trim() === ""}
            onClick={handleEnterInfo}
          >
            Enter
          </Button>
        </DialogActions>
      </Dialog>
  );
}
