import { Settings, UndoRounded } from "@mui/icons-material";
import {
  AppBar,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import axios from "axios";
import React, { lazy, Suspense, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleShowLogout, showUserProfileDrawer } from "../../../redux/AppUI";
import {
  resetClearTempUserIDRedux
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
  const [isProfileUpdate, setIsProfileUpdate] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // get redux states
  const { user: nativeLoggedinUser, tempUserProfileID } = useSelector(
    (state) => state.currentUser
  );

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

  // handle the width of the drawer
  const handleDrawerWidth=()=>{
    if (CustomDeviceSmallest()) {
      return 275
    }else if(CustomDeviceIsSmall()){
      return 330
    }else if (CustomDeviceTablet()) {
      return 450
    }

    return 400
  }

  return (
    <Drawer anchor={"right"} 
    open={isOpenDrawerProfile} onClose={handleClose}>
      <Box
        width={
         handleDrawerWidth()
        }
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
                  <Button color="inherit" onClick={handleShowLogoutAlert}>
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
 
        {/* content */}
        <Box>
          <Suspense
            fallback={
              <Box height={"89vh"} display={"flex"} justifyContent={"center"}>
                <Box display={"flex"} justifyContent={"center"}>
                  <CircularProgress size={20} />
                </Box>
              </Box>
            }
          >
            {/* render user profile component passing current user id no temporary data*/}
            {isFetching ? (
              <Box height={"89vh"}>
                <Stack alignContent={"center"}>
                  <CircularProgress size={25} />
                </Stack>
              </Box>
            ) : (
              <React.Fragment>
                {/* show default profile if is no update setting clicked */}
                {isProfileUpdate ? (
                  <Box height={CustomDeviceTablet()||CustomDeviceIsSmall() ? "94vh":"88.8vh"}>
                    <ProfileUpdate user={nativeLoggedinUser} />
                  </Box>
                ) : (
                  <Box height={CustomDeviceTablet()||CustomDeviceIsSmall() ? "94vh":"88.8vh"} p={"5px"}>
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
