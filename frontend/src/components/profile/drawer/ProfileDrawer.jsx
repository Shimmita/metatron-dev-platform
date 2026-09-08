import { CloseRounded, PowerSettingsNewRounded, Settings, UndoRounded } from "@mui/icons-material";
import {
  AppBar,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import axios from "axios";
import { motion } from "framer-motion";
import React, { Suspense, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleShowLogout, showUserProfileDrawer } from "../../../redux/AppUI";
import {
  resetClearTempUserIDRedux
} from "../../../redux/CurrentUser";
import { appColors } from "../../../utils/colors";
import ProfileUpdate from "./ProfileUpdate";
import UserProfileDrawer from "./UserProfileDrawer";

export default function ProfileDrawer() {
  // redux states
  const { isOpenDrawerProfile, currentMode } = useSelector((state) => state.appUI);
  const [temporaryProfileData, setTemporaryProfileData] = useState();
  const [isProfileUpdate, setIsProfileUpdate] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // get redux states
  const { user: nativeLoggedinUser, tempUserProfileID } = useSelector(
    (state) => state.currentUser
  );
  const isDarkMode = currentMode === 'dark'

  // dispatch
  const dispatch = useDispatch();
  //   close the user profile drawer
  const handleClose = () => {
    //clear temp user profile data
    setTemporaryProfileData();
    // clear tempUserProfileID in redux then close
    dispatch(resetClearTempUserIDRedux());
    // close the drawer
    dispatch(showUserProfileDrawer());
  };

  // fetch user details if is tempUserProfileID
  useLayoutEffect(() => {
    if (tempUserProfileID !== null) {
      // fetching true

      setIsFetching(true);

      axios
        .get(
          `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/users/all/${tempUserProfileID}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res?.data) {
            setTemporaryProfileData(res.data);
          }
        })
        .catch((err) => {
          // there is an error
          if (err?.code === "ERR_NETWORK") {
            // update the snackbar notification of the error of connection
            setErrorMessage("Network Error");
            return;
          }
          // update the snackbar notification of error from the server
          setErrorMessage(err?.response.data);
        })
        .finally(() => {
          // set is fetching to false
          setIsFetching(false);
        });
    }
  }, [tempUserProfileID]);

  // handle opening of the logout alert via redux
  const handleShowLogoutAlert = () => {
    // close the drawer
    dispatch(showUserProfileDrawer());
    // show logout alert
    dispatch(handleShowLogout(true))
  };



  // handle showing of profile update
  const handleShowingProfileUpdate = () => {
    setIsProfileUpdate((prev) => !prev);
  };


  return (
    <React.Fragment>
      <Drawer anchor={"right"}
        open={isOpenDrawerProfile} onClose={handleClose}
        sx={{
          backdropFilter: 'blur(3px)'
        }}
        PaperProps={{
          sx: {
            width: { xs: "100vw", sm: 440, md: 500, lg: 520 },
            maxWidth: "100vw",
            overflow: "hidden",
            borderLeft: "1px solid",
            borderColor: appColors.border,
            background: "linear-gradient(180deg, rgba(5,5,5,0.98), rgba(13,13,13,0.98))",
            boxShadow: "-18px 0 54px rgba(0,0,0,0.46)",
          },
        }}
      >
        <motion.div initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
          style={{ height: "100%" }}>
          <Box
            sx={{
              width: "100%",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              bgcolor: "transparent",
            }}
          >
            <Box>
              <AppBar
                position="static"
                elevation={0}
                sx={{
                  background: isDarkMode
                    ? "linear-gradient(135deg, rgba(5,5,5,0.98), rgba(139,111,42,0.22))"
                    : "linear-gradient(135deg, #050505 0%, #8B6F2A 100%)",
                  borderBottom: "1px solid",
                  borderColor: isDarkMode ? appColors.border : "rgba(255,255,255,0.25)",
                }}
              >
                <Toolbar variant="dense" sx={{ gap: 1, minHeight: 58 }}>
                  <Box minWidth={0} flex={1}>
                    <Stack spacing={0.1}>
                      <Box component="span" sx={{ color: "rgba(255,255,255,0.72)", fontSize: 10, fontWeight: 900 }}>
                        PROFILE WORKSPACE
                      </Box>
                      <Box component="span" sx={{ color: "#fff", fontSize: 14, fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {temporaryProfileData?.name || nativeLoggedinUser?.name || "Metatron Profile"}
                      </Box>
                    </Stack>
                  </Box>

                  {!temporaryProfileData && (
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      {/* settings*/}
                      <Button
                        disableElevation
                        startIcon={isProfileUpdate ? <UndoRounded /> : <Settings />}
                        size="small"
                        sx={{
                          borderRadius: '8px',
                          fontSize: 11,
                          fontWeight: 900,
                          color: 'white'
                        }}
                        onClick={handleShowingProfileUpdate}>
                        Settings
                      </Button>

                      {/* logout */}
                      <Button
                        disableElevation
                        startIcon={<PowerSettingsNewRounded />}
                        size="small"
                        sx={{
                          borderRadius: '8px',
                          fontSize: 11,
                          fontWeight: 900,
                          color: 'white'
                        }}
                        onClick={handleShowLogoutAlert}>
                        Logout
                      </Button>
                    </Stack>
                  )}
                  <IconButton onClick={handleClose} sx={{ color: "#fff", borderRadius: "8px" }}>
                    <CloseRounded sx={{ width: 18, height: 18 }} />
                  </IconButton>
                </Toolbar>
              </AppBar>
            </Box>

            {/* content */}
            <Box sx={{ flex: 1, minHeight: 0, bgcolor: "transparent", overflow: "hidden" }}>
              <Suspense
                fallback={
                  <Box height={"100%"} display={"flex"} justifyContent={"center"} alignItems="center">
                    <Box display={"flex"} justifyContent={"center"}>
                      <CircularProgress size={20} />
                    </Box>
                  </Box>
                }
              >
                {/* render user profile component passing current user id no temporary data*/}
                {isFetching ? (
                  <Box height={"100%"} display="flex" alignItems="center" justifyContent="center">
                    <Stack alignContent={"center"}>
                      <CircularProgress size={25} />
                    </Stack>
                  </Box>
                ) : (
                  <React.Fragment>
                    {/* show default profile if is no update setting clicked */}
                    {errorMessage && tempUserProfileID ? (
                      <Box height="100%" display="flex" alignItems="center" justifyContent="center" p={3}>
                        <Box
                          sx={{
                            borderRadius: "8px",
                            border: "1px solid",
                            borderColor: "divider",
                            p: 2,
                            textAlign: "center",
                            bgcolor: "background.paper",
                          }}
                        >
                          <Typography variant="body2" fontWeight={900}>
                            Profile unavailable
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {errorMessage}
                          </Typography>
                        </Box>
                      </Box>
                    ) : isProfileUpdate ? (
                      <Box height="100%">
                        <ProfileUpdate user={nativeLoggedinUser} />
                      </Box>
                    ) : (
                      <Box height="100%" p={0.75}>
                        {temporaryProfileData ? (
                          <UserProfileDrawer profileData={temporaryProfileData} />
                        ) : (
                          <UserProfileDrawer profileData={nativeLoggedinUser} />
                        )}
                      </Box>
                    )}
                  </React.Fragment>
                )}
              </Suspense>
            </Box>
          </Box>
        </motion.div>
      </Drawer>
      {/* other more components */}
    </React.Fragment>
  );
}
