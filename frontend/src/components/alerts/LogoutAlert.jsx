import { Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logoApp from "../../images/logo_sm.png";
import { persistor } from "../../redux/AppStore";
import { resetClearCurrentUserRedux } from "../../redux/CurrentUser";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LogoutAlert({ openAlertLogout, setOpenAlertLogout }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClose = () => {
    // close alert
    setOpenAlertLogout(false);
  };

  //   redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);

  // navigate to login page and close alert
  const handleNavigateLoginPage = async () => {
    // close the alert
    setOpenAlertLogout(false);

    // signOut the user and clear all the details, revert redux current
    // user state to default

    try {
      const auth = getAuth();
      const firebaseUser = auth.currentUser; // Check for Firebase authenticated user

      // Sign out from Firebase only if a user is authenticated
      if (firebaseUser) {
        await signOut(auth);
        console.log("User signed out from Firebase.");
      } else {
        console.log("No Firebase user found, skipping Firebase sign-out.");
      }

      // Clear persisted storage
      await persistor.purge();

      // Dispatch Redux action to reset user state
      dispatch(resetClearCurrentUserRedux());

      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error during logout:", error);
    }
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
        <DialogTitle display={"flex"} alignItems={"center"} gap={2}>
          <Avatar src={logoApp}  alt="" />
          {"Account Logout?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You will be logged out and required to login next time.
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
