import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React from "react";
import { useSelector } from "react-redux";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertGeneral({
  openAlertGeneral,
  setOpenAlertGenral,
  title,
  message,
  defaultIcon
}) {
  const handleClose = () => {
    // close alert
    setOpenAlertGenral(false);
  };

    //   redux states
    const { isTabSideBar } = useSelector((state) => state.appUI);

  return (
      <Dialog
        open={openAlertGeneral}
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
          <DialogTitle
          display={"flex"}
          alignItems={"center"}
          variant="body1"
          fontWeight={"bold"}
          gap={2}
        >
          {defaultIcon}
          {title}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-slide-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
  );
}
