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
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logoApp from "../../images/logo_sm.png";
import { persistor } from "../../redux/AppStore";
import { handleShowLogout } from "../../redux/AppUI";
import { resetClearCurrentUserRedux } from "../../redux/CurrentUser";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LogoutAlert() {
  const[isLoading,setIsLoading]=useState(false)

  //   redux states
  const { isTabSideBar,isLogoutAlert } = useSelector((state) => state.appUI);

  const dispatch = useDispatch();

  // handles alert close
  const handleClose = async() => {

    // set is loading false
    setIsLoading(false)

    // close the alert
    dispatch(handleShowLogout(false))
  };

  // navigate to login page and close alert
  const handleNavigateLoginPage = async () => {
    // is loading true
    setIsLoading(true)

    try {
      // send a post request to the backend to clear all cookie sessions if any
      await axios.post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/signout`);

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
      console.error("Error occurred during logout:", error);
    } finally{
      // execute closing of the alert
      handleClose()
    }
  };

 // handle width of the alert
    const handleWidthAlert=()=>{
      if (CustomDeviceTablet() && isTabSideBar) {
        return "60%"
      } else if(CustomLandScape()){
        return "92%"
      } else if(CustomLandscapeWidest()){
        return "97.5%"
      }
    }

      const handleAlertGenWidth=()=>{
        if (CustomDeviceTablet() && isTabSideBar) {
          return "36%"
        } else if(CustomLandScape()){
          return "-1%"
        } else if(CustomLandscapeWidest()){
          return "0%"
        }
      }


  return (
      <Dialog
        open={isLogoutAlert}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          backdropFilter:'blur(3px)',
          marginLeft: handleAlertGenWidth()
        }}
      >
        <DialogTitle
          variant="body1"
          display={"flex"}
          alignItems={"center"}
          gap={2}
        >
          <Avatar src={logoApp} alt="" />
          Account Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You will be logged out and required to login next time.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>Disagree</Button>
          <Button onClick={handleNavigateLoginPage} disabled={isLoading}>Agree</Button>
        </DialogActions>
      </Dialog>
  );
}
