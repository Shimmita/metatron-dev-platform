import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LogoutAlert({ openAlertLogout, setOpenAlertLogout }) {
  const navigate = useNavigate();
  const handleClose = () => {
    // close alert
    setOpenAlertLogout(false);
  };

  //   redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);

  // navigate to login page and close alert
  const handleNavigateLoginPage = () => {
    // close the alert
    setOpenAlertLogout(false);
    // navigate to login page
    navigate("/auth/login");
  };

  return (
    <React.Fragment>
      <Dialog
        open={openAlertLogout}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          marginLeft:
            CustomDeviceTablet() && isTabSideBar
              ? "-72%"
              : CustomLandscapeWidest()
              ? "-3%"
              : undefined,
          bottom: CustomDeviceTablet() && isTabSideBar ? "-62%" : undefined,
        }}
      >
        <DialogTitle>{"Account Logout?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You will be logged out
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleNavigateLoginPage}>Agree</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
