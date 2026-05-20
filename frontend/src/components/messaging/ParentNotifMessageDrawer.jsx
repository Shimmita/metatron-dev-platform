import { CircularProgress, styled, Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import React, { lazy, Suspense, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showMessagingDrawer } from "../../redux/AppUI";
import MetatronSnackbar from "../snackbar/MetatronSnackBar";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import NotifAccordionLayout from "./layout/NotifAccordionLayout";

const ConversationContainer = lazy(() => import("./ConversationsContainer"));

// ─── METATRON STYLED TABS ───
const StyledTabs = styled((props) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />
))({
  minHeight: 40,
  background: "rgba(255, 255, 255, 0.03)",
  borderRadius: "12px",
  padding: "4px",
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "rgba(20, 210, 190, 0.15)",
    borderRadius: "8px",
    height: "100%",
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: "uppercase",
  fontWeight: 900,
  fontSize: "0.65rem",
  minHeight: 32,
  minWidth: 100,
  borderRadius: "8px",
  letterSpacing: "0.05rem",
  color: "rgba(255,255,255,0.4)",
  transition: "all 0.2s ease",
  "&.Mui-selected": {
    color: "#14D2BE",
  },
}));

export default function ParentNotifMessageDrawer() {
  const [messageNotifClicked, setMessageNotifClicked] = useState(false);
  const dispatch = useDispatch();

  const { isOpenMessageDrawer, notificationPosition, currentMode } = useSelector((state) => state.appUI);
  const { messageNotification } = useSelector((state) => state.currentSnackBar);
  const { post_reactions } = useSelector((state) => state.currentPostReactions);
  const { connectNotifications } = useSelector((state) => state.currentConnectNotif);
  const { reportedPost } = useSelector((state) => state.currentReportedPost);
  const { profile_views } = useSelector((state) => state.currentProfileView);
  const { job_feedback } = useSelector((state) => state.currentJobFeedBack);

  const isDarkMode = currentMode === 'dark';
  const [value, setValue] = useState(notificationPosition);

  const handleChange = (event, newValue) => setValue(newValue);
  const handleClose = () => {
    dispatch(showMessagingDrawer());
    setMessageNotifClicked(false);
  };

  const drawerWidth = CustomDeviceSmallest() ? 280 : CustomDeviceIsSmall() ? 340 : 400;

  return (
    <React.Fragment>
      <Drawer
        anchor="right"
        open={isOpenMessageDrawer}
        onClose={handleClose}
        PaperProps={{
          sx: {
            background: isDarkMode ? "rgba(10, 15, 25, 0.9)" : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderLeft: "1px solid",
            borderColor: "divider",
            boxShadow: "-10px 0 40px rgba(0,0,0,0.4)",
            overflow: 'hidden'
          }
        }}
      >
        <Box width={drawerWidth} height="100vh" display="flex" flexDirection="column">

          <Box p={2} borderBottom="1px solid" borderColor="divider">

            {!messageNotifClicked && (
              <Box display="flex" justifyContent="center">
                <StyledTabs value={value} onChange={handleChange}>
                  <StyledTab label="Notifications" />
                  <StyledTab label="Messages" />
                </StyledTabs>
              </Box>
            )}
          </Box>

          {/* ─── CONTENT AREA ─── */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 1,
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <Suspense
              fallback={
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                  <CircularProgress size={20} thickness={6} sx={{ color: '#14D2BE' }} />
                </Box>
              }
            >
              <Box>
                {value === 0 ? (
                  <NotifAccordionLayout
                    post_reactions={post_reactions}
                    reportedPost={reportedPost}
                    connectNotifications={connectNotifications}
                    profile_views={profile_views}
                    jobFeedBacks={job_feedback}
                  />
                ) : (
                  <ConversationContainer setMessageNotifClicked={setMessageNotifClicked} />
                )}
              </Box>
            </Suspense>
          </Box>
        </Box>
      </Drawer>

      {messageNotification && <MetatronSnackbar message={messageNotification} />}
    </React.Fragment>
  );
}