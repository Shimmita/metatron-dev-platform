import { Settings, UndoRounded } from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import React, { lazy, Suspense, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { persistor } from "../../../redux/AppStore";
import { showUserProfileDrawer } from "../../../redux/AppUI";
import {
  resetClearCurrentUserRedux,
  resetClearTempUserIDRedux,
} from "../../../redux/CurrentUser";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../../utilities/CustomDeviceSmallest";
import CustomDeviceTablet from "../../utilities/CustomDeviceTablet";
const ProfileUpdate = lazy(() => import("./ProfileUpdate"));
const UserProfileDrawer = lazy(() => import("./UserProfileDrawer"));

export default function ProfileDrawer() {
  // redux states
  const { isOpenDrawerProfile } = useSelector((state) => state.appUI);
  const [temporaryProfileData, setTemporaryProfileData] = useState();
  const [openLogoutAlert, setOpenLogoutAlert] = useState(false);
  const [isProfileUpdate, setIsProfileUpdate] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [erroMessage, setErrorMesssage] = useState("");

  // get redux states
  const { user: nativeLoggedinUser, tempUserProfileID } = useSelector(
    (state) => state.currentUser
  );

  // axios default credentials
  axios.defaults.withCredentials = true;

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
          `http://localhost:5000/metatron/api/v1/users/all/${tempUserProfileID}`,
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
            setErrorMesssage("Network Error");
            return;
          }
          // update the snackbar notification of error from the server
          setErrorMesssage(err?.response.data);
        })
        .finally(() => {
          // set is fetching to false
          setIsFetching(false);
        });
    }
  }, [tempUserProfileID]);

  // handle opening of the logout alert
  const handleOpeningLogout = () => {
    setOpenLogoutAlert((prev) => !prev);
  };

  // handle competion of logging out
  const handleCompleteLogout = async () => {
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

      // close drawer
      dispatch(showUserProfileDrawer());
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // handle showing of profile update
  const handleShowingProfileUpdate = () => {
    setIsProfileUpdate((prev) => !prev);
  };

  return (
    <Drawer anchor={"right"} open={isOpenDrawerProfile} onClose={handleClose}>
      <Box
        width={
          CustomDeviceSmallest()
            ? 275
            : CustomDeviceIsSmall()
            ? 330
            : CustomDeviceTablet()
            ? 450
            : 470
        }
        bgcolor={"background.default"}
      >
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar variant="dense">
              <Typography variant={"body2"} sx={{ flexGrow: 1 }}>
                {temporaryProfileData
                  ? temporaryProfileData?.name
                  : nativeLoggedinUser?.name}
              </Typography>
              {!temporaryProfileData && (
                <Stack direction={"row"} gap={1} alignItems={"center"}>
                  {/* logout */}
                  <Button color="inherit" onClick={handleOpeningLogout}>
                    Logout
                  </Button>
                  {/* divider */}|{/* profile setting */}
                  <IconButton onClick={handleShowingProfileUpdate}>
                    {isProfileUpdate ? (
                      <Tooltip arrow title={"back"}>
                        <UndoRounded sx={{ color: "white" }} />
                      </Tooltip>
                    ) : (
                      <Tooltip arrow title={"settings"}>
                        <Settings sx={{ color: "white" }} />
                      </Tooltip>
                    )}
                  </IconButton>
                </Stack>
              )}
            </Toolbar>
          </AppBar>
        </Box>

        {/* show logout alert */}
        <Box display={"flex"} justifyContent={"center"} p={1} mb={1}>
          {openLogoutAlert && (
            <Collapse in={openLogoutAlert || false}>
              <Alert
                severity="info"
                className="rounded-5"
                action={
                  <Stack direction={"row"} alignItems={"center"} gap={1}>
                    {/* yes btn */}
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={handleCompleteLogout}
                    >
                      <Typography
                        variant="body2"
                        color={"orange"}
                        fontWeight={"bold"}
                      >
                        Yes
                      </Typography>
                    </IconButton>
                    |{/* no btn */}
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={handleOpeningLogout}
                    >
                      <Typography
                        variant="body2"
                        color={"inherit"}
                        fontWeight={"bold"}
                      >
                        No
                      </Typography>
                    </IconButton>
                  </Stack>
                }
              >
                End current session?
              </Alert>
            </Collapse>
          )}
        </Box>

        {/* content */}
        <Box>
          <Suspense
            fallback={
              <Box height={"90vh"} display={"flex"} justifyContent={"center"}>
                <Box display={"flex"} justifyContent={"center"}>
                  <CircularProgress size={20} />
                </Box>
              </Box>
            }
          >
            {/* render user profile component passing current user id no temporary data*/}
            {isFetching ? (
              <Box height={"50vh"}>
                <Stack alignContent={"center"}>
                  <CircularProgress size={25} />
                </Stack>
              </Box>
            ) : (
              <React.Fragment>
                {/* show default profile if is no update setting clicked */}
                {isProfileUpdate ? (
                  <Box height={"91.7vh"}>
                    <ProfileUpdate user={nativeLoggedinUser} />
                  </Box>
                ) : (
                  <Box height={"91.7vh"} p={"5px"}>
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
    </Drawer>
  );
}
