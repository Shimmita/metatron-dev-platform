import { InfoRounded } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertFeedbackApplicants() {
  const [openAlert, setOpenAlert] = useState(true);
  const handleClose = () => {
    // close alert
    setOpenAlert(false);
  };

  // redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);

  return (
    <React.Fragment>
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
        <DialogTitle display={"flex"} alignItems={"center"} gap={1}>
          {/* delete icon */}
          <InfoRounded />
          {/* title */}
          Applicants Feedback
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            variant="body2"
            id="alert-dialog-slide-description"
          >
            Dear recruter, Metatron highly recommends that you should provide a
            feedback mechanism to the job applicants. You can facilitate this by
            marking proceed or reject once done viewing the documents of the
            applicants.{" "}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{ borderRadius: "20px" }} onClick={handleClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
