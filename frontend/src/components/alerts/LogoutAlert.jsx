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
import { handleShowLogout, resetDefaultBottomNav } from "../../redux/AppUI";
import { resetAllSigningStateDetails } from "../../redux/CompleteSigning";
import { resetClearChatBot } from "../../redux/CurrentChatBot";
import { resetClearCurrentConnectTop } from "../../redux/CurrentConnect";
import { resetClearCurrentConnectNotif } from "../../redux/CurrentConnectNotif";
import { resetClearConversations } from "../../redux/CurrentConversations";
import { resetClearCurrentCourses } from "../../redux/CurrentCourses";
import { resetClearCurrentEvents } from "../../redux/CurrentEvents";
import { resetClearCurrentEventsTop } from "../../redux/CurrentEventsTop";
import { resetClearCurrentGlobalSearch } from "../../redux/CurrentGlobalSearch";
import { resetClearCurrentGroupCommunities } from "../../redux/CurrentGroups";
import { resetClearCurrentJobFeedBack } from "../../redux/CurrentJobFeedBack";
import { resetJobSearch } from "../../redux/CurrentJobSearch";
import { resetClearCurrentJobsTop } from "../../redux/CurrentJobsTop";
import { resetClearPeopleData } from "../../redux/CurrentModal";
import { resetClearCurrentNetwork } from "../../redux/CurrentNetwork";
import { resetClearCurrentPostReactions } from "../../redux/CurrentPostReactions";
import { resetClearCurrentReport } from "../../redux/CurrentPostReported";
import { resetClearCurrentPosts } from "../../redux/CurrentPosts";
import { resetClearCurrentPostsTop } from "../../redux/CurrentPostsTop";
import { resetClearCurrentProfileView } from "../../redux/CurrentProfileView";
import { resetClearCurrentSnack } from "../../redux/CurrentSnackBar";
import { resetClearCurrentSuccessRedux } from "../../redux/CurrentSuccess";
import { resetClearCurrentUserRedux, resetClearTempUserIDRedux } from "../../redux/CurrentUser";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LogoutAlert() {
  const[isLoading,setIsLoading]=useState(false)

  //   redux states
  const { isLogoutAlert,currentMode } = useSelector((state) => state.appUI);
  const isDarkMode=currentMode==='dark'

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

      // clear any persisted user data
            dispatch(resetClearCurrentUserRedux())
      
            // temp user Id 
            dispatch(resetClearTempUserIDRedux())
      
            // reset all pending signin details
            dispatch(resetAllSigningStateDetails())
      
            // clear bottom nav details
            dispatch(resetDefaultBottomNav())
      
            // reset chat bot
            dispatch(resetClearChatBot())
      
            //reset connect requests
            dispatch(resetClearCurrentConnectTop()) 
      
            // clear connect Notifications
            dispatch(resetClearCurrentConnectNotif())
      
            // reset clear conversations
            dispatch(resetClearConversations())
      
            // reset courses
            dispatch(resetClearCurrentCourses())
      
            // reset clear events any
            dispatch(resetClearCurrentEvents())
      
            // reset clear top events
            dispatch(resetClearCurrentEventsTop())
      
            // reset clear global search
            dispatch(resetClearCurrentGlobalSearch())
      
            // reset clear communities
            dispatch(resetClearCurrentGroupCommunities())
      
            // reset clear
            dispatch(resetClearCurrentJobFeedBack())
      
            // reset clear jobs
            dispatch(resetClearCurrentJobFeedBack())
      
            // reset clear job search
            dispatch(resetJobSearch())
      
            // clear jobs top
            dispatch(resetClearCurrentJobsTop())
      
            // clear modal people details
            dispatch(resetClearPeopleData())
      
            // clear network of people
            dispatch(resetClearCurrentNetwork())
      
            // clear post reaction
            dispatch(resetClearCurrentPostReactions())
      
            // clear post reports
            dispatch(resetClearCurrentReport())
      
            // clear posts
            dispatch(resetClearCurrentPosts())
      
            // clear posts top insights
            dispatch(resetClearCurrentPostsTop())
      
            // clear profile view
            dispatch(resetClearCurrentProfileView())
      
            // clear snack bars
            dispatch(resetClearCurrentSnack())
            
            // clear success msg any
            dispatch(resetClearCurrentSuccessRedux())

      
    } catch (error) {
      console.error("Error occurred during logout:", error);
    } finally{
      // execute closing of the alert
      handleClose()
    }
  };


  return (
      <Dialog
        open={isLogoutAlert}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          backdropFilter:'blur(5px)',
        }}
      >
        <DialogTitle
          variant="body1"
          display={"flex"}
          alignItems={"center"}
          gap={2}
          sx={{
            background: !isDarkMode && 
            "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
          }}
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
