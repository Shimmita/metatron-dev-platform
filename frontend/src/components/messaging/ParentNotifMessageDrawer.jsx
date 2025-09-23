import { EmailRounded, NotificationsRounded } from "@mui/icons-material";
import {
  AppBar,
  CircularProgress,
  styled,
  Tab,
  Tabs,
  Toolbar
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import React, { lazy, Suspense, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showMessagingDrawer } from "../../redux/AppUI";
import SnackBarNotifications from "../snackbar/SnackBarNotifications";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import NotifAccordionLayout from "./layout/NotifAccordionLayout";
const ConversationContainer = lazy(() => import("./ConversationsContainer"));

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 20,
    width: "100%",
    backgroundColor: "transparent",
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    fontWeight: theme.typography.caption,
    fontSize: theme.typography.pxToRem(13),
    padding: theme.typography.pxToRem(0),
    color: "gray",
    "&.Mui-focusVisible": {
      backgroundColor: "rgba(100, 95, 228, 0.32)",
    },
  })
);

export default function ParentNotifMessageDrawer() {
  
  // this will define display of inbox and notif bars appropriately
  const [messageNotifClicked, setMessageNotifClicked] = useState(false);

  // redux states
  const { isOpenMessageDrawer,notificationPosition,currentMode } = useSelector((state) => state.appUI);
  const { messageNotification } = useSelector((state) => state.currentSnackBar);

  const { post_reactions } = useSelector((state) => state.currentPostReactions);
  const { connectNotifications } = useSelector(
    (state) => state.currentConnectNotif
  );

  const { reportedPost } = useSelector((state) => state.currentReportedPost);

  const { profile_views } = useSelector((state) => state.currentProfileView);

  const { job_feedback } = useSelector((state) => state.currentJobFeedBack);
  const isDarkMode=currentMode==='dark'

  const [value, setValue] = useState(notificationPosition);
  
  const dispatch = useDispatch();

 const handleChange = (event, newValue) => {
    setValue(newValue);

  };
  
  const handleClose = () => {
    dispatch(showMessagingDrawer());

    // restore message and notification states to default
    setMessageNotifClicked((prev) => (prev === true ? false : false));
  };

  return (
    <React.Fragment>
      <Drawer 
      anchor={"right"} 
      open={isOpenMessageDrawer} 
      onClose={handleClose}
      sx={{ 
        backdropFilter:'blur(3px)'
       }}
      >
        <Box
          width={
            CustomDeviceSmallest()
              ? 270
              : CustomDeviceIsSmall()
              ? 330
              :400
          }
          bgcolor={isDarkMode ?"background.default":"#E6F7FF"}
          height={"100vh"}
        >
          {/* display when message/notif item not clicked */}
          {!messageNotifClicked && (
            <AppBar 
            position="sticky" 
            elevation={0}>
              <Toolbar
                variant="dense"
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <StyledTabs
                    value={value}
                    onChange={handleChange}
                    aria-label="styled tabs"
                  >
                    <StyledTab
                      label={
                          <NotificationsRounded
                            variant="body2"
                            sx={{  
                            color:'white',
                            width:30,
                            height:30,
                            borderBottom:value===0 && '1px solid',
                            borderColor:'white'
                             }}
                          />
                        
                      }
                    />

                    <StyledTab
                      label={
                          <EmailRounded
                            variant="body2"
                            sx={{
                            width:27, 
                            height:27,
                            color:'white',
                            borderBottom:value===1 && '1px solid',
                            borderColor:'white'
                             }}
                          />
                          
                      }
                    />
                  </StyledTabs>
                </Box>
              </Toolbar>
            </AppBar>
          )}

          <Box>
            <Suspense
              fallback={
                <Box height={"90vh"}>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <CircularProgress className="mt-2" size={25}/>
                  </Box>
                </Box>
              }
            >
             
                <Box
                  height={"92vh"}
                  p={0.4}
                  borderRadius={5}
                  sx={{
                    overflow: "auto",
                    // Hide scrollbar for Chrome, Safari and Opera
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                    // Hide scrollbar for IE, Edge and Firefox
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                  }}
                >
                 {value===0 ? (
                  <React.Fragment>
                  {/* display account notification */}
                  <NotifAccordionLayout
                  post_reactions={post_reactions}
                  reportedPost={reportedPost}
                  connectNotifications={connectNotifications}
                  profile_views={profile_views}
                  jobFeedBacks={job_feedback}
                  />
                  </React.Fragment>
                  ):(
                  <React.Fragment>
                  {/* display messages content and passing props */}
                  <ConversationContainer
                  setMessageNotifClicked={setMessageNotifClicked}
                />
                  </React.Fragment>
                 )}
                </Box>

            </Suspense>
          </Box>
        </Box>
      </Drawer>

      {/* show snackbar for notifications for info */}
      {messageNotification && (
        <SnackBarNotifications message={messageNotification} />
      )}
    </React.Fragment>
  );
}
