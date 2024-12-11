import { Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import logoApp from "../../images/logo_sm.png";
import { persistor } from "../../redux/AppStore";
import { resetClearCurrentUserRedux } from "../../redux/CurrentUser";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LogoutAlert({
  openAlertLogout,
  setOpenAlertLogout,
  title,
  body,
}) {
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpenAlertLogout(false);
  };

  // configuring axios defaults
  axios.defaults.withCredentials = true;

  //   redux states
  const { isTabSideBar } = useSelector((state) => state.appUI);

  // navigate to login page and close alert
  const handleNavigateLoginPage = async () => {
    // close the alert
    setOpenAlertLogout(false);

    try {
      // send a post request to the backend to clear all cookie sessions if any
      await axios.post(`http://localhost:5000/metatron/api/v1/signout`);

      // clear any firebase authentication details
      const auth = getAuth();
      const firebaseUser = auth?.currentUser;
      if (firebaseUser) {
        await signOut(auth);
      }

      // Clear persisted storage and redux
      await persistor.purge();

      // Dispatch Redux action to reset user state
      dispatch(resetClearCurrentUserRedux());
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
          variant="body1"
          display={"flex"}
          alignItems={"center"}
          gap={2}
        >
          <Avatar src={logoApp} alt="" />
          {title ? title : "Account Logout?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {body
              ? body
              : "You will be logged out and required to login next time."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {!title && <Button onClick={handleClose}>Disagree</Button>}
          <Button onClick={handleNavigateLoginPage}>Agree</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
