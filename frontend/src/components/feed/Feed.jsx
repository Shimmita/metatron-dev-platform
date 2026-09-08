import { Box, CircularProgress, Fade } from "@mui/material";
import React, { lazy, Suspense, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import { handleIsJobsGlobalResults, handleShowingSpeedDial, handleSidebarRightbar } from "../../redux/AppUI";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import GuestCheck from "../account/GuestCheck";
import BasicSpeedDial from "../custom/SpeedDial";

// Lazy Components
const EventsContainer = lazy(() => import("../events/EventsContainer"));
const SnackBarPostSuccess = lazy(() => import("../snackbar/SnackBarPostSuccess"));
const CoursesMainContainer = lazy(() => import("../courses/CoursesMainContainer"));
const CoursesInstrContainer = lazy(() => import("../courses/CoursesInstrContainer"));
const FeedDefaultSearch = lazy(() => import("./FeedDefaultSearch"));
const PostDetailsRouted = lazy(() => import("../post/PostDetailsRouted"));
const AllJobsHiringManager = lazy(() => import("../jobs/AllJobsHiringManager"));
const AllJobsContainer = lazy(() => import("../jobs/AllJobsContainer"));
const PageNotFound = lazy(() => import("../notfound/PageNotFound"));
const PostDetailsContainer = lazy(() => import("../post/PostDetailsContiner"));
const FeedDefaultContent = lazy(() => import("./FeedDefaultContent"));
const BottomNav = lazy(() => import("../bottom/BottomNav"));
const AlertGroupCommunity = lazy(() => import("../alerts/AlertGroupCommunity"));
const AlertTutorial = lazy(() => import("../alerts/AlertTutorial"));

const Feed = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = useSelector((state) => state.currentUser);
  const {
    isDefaultBottomNav,
    isDefaultSpeedDial,
    isLoadingPostLaunch,
    isPostDetailed
  } = useSelector((state) => state.appUI);
  const { messageSnackPostTech } = useSelector((state) => state.currentSnackBar);

  const [openCommunity, setOpenCommunity] = React.useState(user?.isGroupTutorial || false);
  const isWorkspaceRoute = [
    "/jobs",
    "/jobs/hiring",
    "/events",
    "/courses/available",
    "/courses/instructor",
  ].some((route) => location.pathname.startsWith(route));

  useLayoutEffect(() => {
    dispatch(handleShowingSpeedDial(true));

    if (location.pathname === "/" || location.pathname === "/explore") {
      dispatch(updateCurrentBottomNav(0));
      dispatch(handleSidebarRightbar(true));
      dispatch(handleIsJobsGlobalResults(false));
    }
  }, [dispatch, location.pathname]); // Reset on route change

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        maxWidth: isWorkspaceRoute ? "100%" : { xs: "100%", lg: 540, xl: 580 },
        minWidth: 0,
        flex: isWorkspaceRoute ? "1 1 100%" : { sm: "1 1 0", lg: "0 0 540px", xl: "0 0 580px" },
        minHeight: { xs: "100vh", lg: 0 },
        height: { lg: "100%" },
        overflowY: { lg: "auto" },
        overflowX: "hidden",
        overscrollBehavior: { lg: "contain" },
        display: "flex",
        flexDirection: "column",
        // Keep the last feed items clear of the floating navigation dock.
        pb: isDefaultBottomNav ? { xs: 14, md: 15, lg: 16 } : 0,
        transition: "padding 0.3s ease",
      }}
    >
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "80vh",
              flexDirection: "column",
              gap: 2
            }}
          >
            <CircularProgress size={40} thickness={4} sx={{ color: "primary.main" }} />
          </Box>
        }
      >
        <Routes>
          <Route path="/explore" element={<GuestCheck><FeedDefaultContent /></GuestCheck>} />
          <Route path="/" element={<GuestCheck><FeedDefaultContent /></GuestCheck>} />
          <Route path="/events" element={<GuestCheck><EventsContainer /></GuestCheck>} />
          <Route path="/courses/available" element={<GuestCheck><CoursesMainContainer /></GuestCheck>} />
          <Route path="/courses/instructor" element={<GuestCheck><CoursesInstrContainer /></GuestCheck>} />
          <Route path="/jobs" element={<GuestCheck><AllJobsContainer /></GuestCheck>} />
          <Route path="/jobs/hiring" element={<GuestCheck><AllJobsHiringManager /></GuestCheck>} />
          <Route path="/posts/search/results" element={<FeedDefaultSearch />} />
          <Route path="/posts/details/:id" element={<GuestCheck><PostDetailsRouted /></GuestCheck>} />
          <Route path="/users/profile/posts/details" element={<GuestCheck><PostDetailsContainer /></GuestCheck>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>

        {/* ─── GLOBAL OVERLAYS ─── */}

        {/* Floating SpeedDial */}
        {isDefaultBottomNav && isDefaultSpeedDial && !isPostDetailed && (
          <Fade in timeout={500}>
            <Box
              sx={{
                position: "fixed",
                right: { xs: 20, md: 32 },
                bottom: { xs: 100, md: 32 },
                zIndex: 1100,
              }}
            >
              <BasicSpeedDial />
            </Box>
          </Fade>
        )}

        {/* Optimized Bottom Navigation */}
        {isDefaultBottomNav && !isLoadingPostLaunch && (
          <Suspense fallback={null}>
            <BottomNav />
          </Suspense>
        )}

        {/* Notifications & Tutorials */}
        {messageSnackPostTech && <SnackBarPostSuccess messageSnackPostTech={messageSnackPostTech} />}
        {user?.isTutorial && <AlertTutorial />}
        {openCommunity && <AlertGroupCommunity openGroup={openCommunity} setOpenGroup={setOpenCommunity} />}
      </Suspense>
    </Box>
  );
};

export default Feed;
