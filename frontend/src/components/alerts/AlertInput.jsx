import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React, { useState } from "react";
import SubsectionTech from "../data/SubsectionTech";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import { useSelector } from "react-redux";

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
  // redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);

  return (
      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          marginLeft: CustomDeviceTablet() && isTabSideBar ? "36%" : undefined,

          width:
            CustomDeviceTablet() && isTabSideBar
              ? "60%"
              : CustomLandScape()
              ? "92%"
              : CustomLandscapeWidest()
              ? "97.5%"
              : undefined,
        }}
      >
        <DialogTitle variant="body1">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
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
