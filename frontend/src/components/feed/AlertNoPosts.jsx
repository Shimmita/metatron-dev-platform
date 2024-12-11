import { Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React from "react";
import { useSelector } from "react-redux";
import logo from "../../images/logo_sm.png";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertNoPosts({
  openAlert,
  setOpenAlert,
  isNetwork = false,
  errorMessage = "",
  handleClearing,
}) {
  const handleClose = () => {
    handleClearing();
    // close alert
    setOpenAlert(false);
  };

  // redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);

  // handle retry
  const handleRetry = () => {
    handleClearing();
    window.location.reload();
    setOpenAlert(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-alering"
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
          variant="body1"
          alignItems={"center"}
          gap={1}
        >
          <Avatar alt="" src={logo} sx={{ width: 30, height: 30 }} />
          Posts
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {isNetwork ? (
            <Button sx={{ borderRadius: "20px" }} onClick={handleRetry}>
              retry
            </Button>
          ) : (
            <React.Fragment>
              <Button sx={{ borderRadius: "20px" }} onClick={handleRetry}>
                Ok
              </Button>
            </React.Fragment>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
