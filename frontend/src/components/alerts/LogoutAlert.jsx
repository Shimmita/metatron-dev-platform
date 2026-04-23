import {
  Box,
  Button,
  Dialog,
  Typography,
  Fade,
  Backdrop,
  Avatar,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logoApp from "../../images/logo_sm.png";

import {
  handleShowLogout,
  resetDefaultBottomNav,
} from "../../redux/AppUI";

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

export default function LogoutAlert() {
  const [isLoading, setIsLoading] = useState(false);

  const { isLogoutAlert } = useSelector((state) => state.appUI);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ─── CLOSE ─── */
  const handleClose = () => {
    setIsLoading(false);
    dispatch(handleShowLogout(false));
  };

  const handleClearReduxData = () => {
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
  };
  
  /* ─── LOGOUT ─── */
  const handleNavigateLoginPage = async () => {
    setIsLoading(true);

    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/signout`
      );

      if (result.status === 200) {
        handleClearReduxData();
        handleClose();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isLogoutAlert}
      onClose={handleClose}
      closeAfterTransition
      TransitionComponent={Fade}
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
          sx: {
            backdropFilter: "blur(8px)",
            background: "rgba(6,13,24,0.7)",
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "18px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
          width: { xs: "90vw", sm: 380 },
          overflow: "hidden",
        },
      }}
    >
      {/* HEADER */}
      <Box
        display="flex"
        alignItems="center"
        gap={1.5}
        px={2}
        py={1.5}
        sx={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Avatar
          src={logoApp}
          sx={{
            width: 34,
            height: 34,
            borderRadius: "10px",
          }}
        />

        <Typography fontSize={14} fontWeight={600} color="#F0F4FA">
          Confirm Logout
        </Typography>
      </Box>

      {/* CONTENT */}
      <Box px={2} py={2}>
        <Typography
          fontSize={13}
          sx={{
            color: "rgba(240,244,250,0.7)",
            lineHeight: 1.6,
          }}
        >
          You will be signed out of your account. You’ll need to log in again to
          continue using Metatron.
        </Typography>
      </Box>

      {/* ACTIONS */}
      <Box display="flex" justifyContent="flex-end" gap={1.2} px={2} pb={2}>
        {/* CANCEL */}
        <Button
          onClick={handleClose}
          disabled={isLoading}
          sx={{
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)",

            "&:hover": {
              background: "rgba(255,255,255,0.05)",
            },
          }}
        >
          Cancel
        </Button>

        {/* LOGOUT */}
        <Button
          onClick={handleNavigateLoginPage}
          disabled={isLoading}
          sx={{
            borderRadius: "10px",
            background: "linear-gradient(135deg,#EF4444,#FF6D3A)",
            color: "#fff",
            px: 2,

            "&:hover": {
              background: "linear-gradient(135deg,#DC2626,#FF6D3A)",
            },
          }}
        >
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </Box>
    </Dialog>
  );
}