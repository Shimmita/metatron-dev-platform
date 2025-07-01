import { EmailRounded, NotificationsRounded } from "@mui/icons-material";
import {
  AppBar,
  Badge,
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
  const { isOpenMessageDrawer,notificationPosition } = useSelector((state) => state.appUI);
  const { messageNotification } = useSelector((state) => state.currentSnackBar);

  const { post_reactions } = useSelector((state) => state.currentPostReactions);
  const { connectNotifications } = useSelector(
    (state) => state.currentConnectNotif
  );

  const { reportedPost } = useSelector((state) => state.currentReportedPost);

  const { profile_views } = useSelector((state) => state.currentProfileView);

  const { job_feedback } = useSelector((state) => state.currentJobFeedBack);

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
          bgcolor={"background.default"}
          height={"100vh"}
        >
          {/* display when message/notif item not clicked */}
          {!messageNotifClicked && (
            <AppBar position="sticky">
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
                            className={value === 0 && "border-bottom pb-1"}
                            variant="body2"
                            sx={{ color: "white",  width:28, height:28 }}
                          />
                        
                      }
                    />

                    <StyledTab
                      label={
                          <EmailRounded
                            className={value === 1 && "border-bottom pb-1"}
                            variant="body2"
                            sx={{ color: "white", width:25, height:25 }}
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
                    loading...
                  </Box>
                </Box>
              }
            >
             
                <Box
                  height={"92vh"}
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
