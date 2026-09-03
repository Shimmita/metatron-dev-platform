import {
  CloseRounded,
  ForumRounded,
  NotificationsRounded,
} from "@mui/icons-material";
import {
  CircularProgress,
  IconButton,
  Stack,
  styled,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import React, { lazy, Suspense, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showMessagingDrawer } from "../../redux/AppUI";
import { appColors } from "../../utils/colors";
import MetatronSnackbar from "../snackbar/MetatronSnackBar";
import { drawerPaperSx, panelSx, scrollAreaSx } from "./communicationStyles";
import NotifAccordionLayout from "./layout/NotifAccordionLayout";

const ConversationContainer = lazy(() => import("./ConversationsContainer"));

// ─── METATRON STYLED TABS ───
const StyledTabs = styled((props) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />
))(({ theme }) => ({
  minHeight: 40,
  background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)",
  border: "1px solid",
  borderColor: theme.palette.mode === "dark" ? appColors.divider : "rgba(15,23,42,0.1)",
  borderRadius: "8px",
  padding: "4px",
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "rgba(20, 210, 190, 0.15)",
    borderRadius: "6px",
    height: "100%",
  },
}));

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 800,
  fontSize: "0.78rem",
  minHeight: 32,
  minWidth: 100,
  borderRadius: "6px",
  color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.5)" : "rgba(15,23,42,0.55)",
  transition: "all 0.2s ease",
  "&.Mui-selected": {
    color: appColors.primary,
  },
}));

export default function ParentNotifMessageDrawer() {
  const [messageNotifClicked, setMessageNotifClicked] = useState(false);
  const dispatch = useDispatch();

  const { isOpenMessageDrawer, notificationPosition } = useSelector((state) => state.appUI);
  const { messageNotification } = useSelector((state) => state.currentSnackBar);
  const { post_reactions } = useSelector((state) => state.currentPostReactions);
  const { connectNotifications } = useSelector((state) => state.currentConnectNotif);
  const { reportedPost } = useSelector((state) => state.currentReportedPost);
  const { profile_views } = useSelector((state) => state.currentProfileView);
  const { job_feedback } = useSelector((state) => state.currentJobFeedBack);
  const { conversations } = useSelector((state) => state.currentConversation);

  const [value, setValue] = useState(notificationPosition);
  const notificationTotal =
    (post_reactions?.length || 0) +
    (reportedPost?.length || 0) +
    (connectNotifications?.length || 0) +
    (profile_views?.length || 0) +
    (job_feedback?.length || 0);
  const messageTotal = conversations?.length || 0;

  const handleChange = (event, newValue) => setValue(newValue);
  const handleClose = () => {
    dispatch(showMessagingDrawer());
    setMessageNotifClicked(false);
  };

  return (
    <React.Fragment>
      <Drawer
        anchor="right"
        open={isOpenMessageDrawer}
        onClose={handleClose}
        PaperProps={{
          sx: drawerPaperSx
        }}
      >
        <Box height="100vh" display="flex" flexDirection="column">
          <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.25}>
              <Box minWidth={0}>
                <Typography variant="caption" color="primary.main" fontWeight={900}>
                  COMMUNICATIONS
                </Typography>
                <Typography variant="body1" fontWeight={900} noWrap>
                  Notifications & Messages
                </Typography>
              </Box>
              <IconButton onClick={handleClose} sx={iconCloseSx}>
                <CloseRounded sx={{ width: 17, height: 17 }} />
              </IconButton>
            </Stack>

            {!messageNotifClicked && (
              <Stack direction="row" spacing={1} mt={1.5}>
                <Box sx={(theme) => ({ ...panelSx(theme), flex: 1, px: 1.2, py: 1 })}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <NotificationsRounded sx={{ width: 17, height: 17, color: appColors.primary }} />
                    <Box minWidth={0}>
                      <Typography variant="caption" color="text.secondary">
                        Signals
                      </Typography>
                      <Typography variant="body2" fontWeight={900}>
                        {notificationTotal}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                <Box sx={(theme) => ({ ...panelSx(theme), flex: 1, px: 1.2, py: 1 })}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ForumRounded sx={{ width: 17, height: 17, color: appColors.secondary }} />
                    <Box minWidth={0}>
                      <Typography variant="caption" color="text.secondary">
                        Threads
                      </Typography>
                      <Typography variant="body2" fontWeight={900}>
                        {messageTotal}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            )}

            {!messageNotifClicked && (
              <Box display="flex" justifyContent="center" mt={1.5}>
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
              p: { xs: 1, sm: 1.25 },
              ...scrollAreaSx,
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

const iconCloseSx = (theme) => ({
  width: 34,
  height: 34,
  borderRadius: "8px",
  border: "1px solid",
  borderColor: theme.palette.mode === "dark" ? appColors.border : "rgba(15,23,42,0.12)",
  background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.75)",
});
