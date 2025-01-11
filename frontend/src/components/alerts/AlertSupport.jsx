import { SupportAgentRounded } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import HelpSupport from "../custom/HelpSupport";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertSupport({
  openSupportAlert,
  setOpenAlertSupport,
}) {
  const handleClose = () => {
    setOpenAlertSupport(false);
  };

  // configuring axios defaults
  axios.defaults.withCredentials = true;

  //   redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);

  return (
    <React.Fragment>
      <Dialog
        open={openSupportAlert}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description-support"
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
        <DialogTitle
          display={"flex"}
          alignItems={"center"}
          variant="body1"
          gap={2}
        >
          <SupportAgentRounded />
          {"Technical Support"}
        </DialogTitle>
        <DialogContent dividers>
          {/* render the support layout */}
          <HelpSupport setOpenAlertSupport={setOpenAlertSupport}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
