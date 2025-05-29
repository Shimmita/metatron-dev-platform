import { Box, CircularProgress } from "@mui/material";
import React, { lazy, Suspense, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import BasicSpeedDial from "../custom/SpeedDial";

import { handleShowingSpeedDial } from "../../redux/AppUI";
import BottomNav from "../bottom/BottomNav";
import SnackBarPostSuccess from "../snackbar/SnackBarPostSuccess";
import CustomFeedEquidstance from "../utilities/CustomFeedEquidstance";
const FeedDefaultSearch = lazy(() => import("./FeedDefaultSearch"));
const PostDetailsRouted = lazy(() => import("../post/PostDetailsRouted"));
const CourseDetailed = lazy(() => import("../courses/layout/CourseDetailed"));

const AllJobsHiringManager=lazy(()=>import("../jobs/AllJobsHiringManager")) ;
const AllJobsContainer = lazy(() => import("../jobs/AllJobsContainer"));

const CoursePaidContainer = lazy(() =>
  import("../courses/CoursePaidContainer")
);
const PageNotFound = lazy(() => import("../notfound/PageNotFound"));

const UserProfile = lazy(() => import("../profile/UserProfile"));
const PostDetailsContainer = lazy(() => import("../post/PostDetailsContiner"));

const LiveAttend = lazy(() => import("../attend/LiveAttendRender"));

const FeedDefaultContent = lazy(() => import("./FeedDefaultContent"));
const EventsLive = lazy(() => import("../events/EventsLive"));
const EventsUpcoming = lazy(() => import("../events/EventsUpcoming"));
const EventsBookMarks = lazy(() => import("../events/EventsBookMarks"));

const Feed = () => {
  // redux states
  const {
    isTabSideBar,
    isDefaultBottomNav,
    isDefaultSpeedDial,
    isLoadingPostLaunch,
    isPostDetailed,
  } = useSelector((state) => state.appUI);
  const { messageSnackPostTech } = useSelector(
    (state) => state.currentSnackBar
  );

  const dispatch = useDispatch();

  // restore default states which could've been bypassed unnecessarily
  useLayoutEffect(() => {
    // restore speed dial it could have been not closed in previous histories
    dispatch(handleShowingSpeedDial(true));
  }, [dispatch]);

  return (
    <React.Fragment>
      {isTabSideBar ? (
        // displayed when sidebar is on when full screen toggle not clicked
        <Box
          marginRight={CustomFeedEquidstance()}
          flex={3}
          p={1}
          color={"text.primary"}
        >
          <Suspense
            fallback={
              <Box
                bgcolor={"background.default"}
                color={"text.primary"}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "95vh",
                }}
              >
                {/* loader be shown before actual loading of content */}
                <CircularProgress size={"2rem"} />
              </Box>
            }
          >
            <Routes>
              <Route path="/" element={<FeedDefaultContent />} />

              {/* <Route path="/account/premium" element={<AccountPremium />} /> */}
              <Route path="/courses/paid" element={<CoursePaidContainer />} />
              <Route
                path="/courses/paid/detailed"
                element={<CourseDetailed />}
              />
              {/* jobseeker pane */}
              <Route path="/jobs" element={<AllJobsContainer />} />

              {/* hiring manager pane */}
              <Route path="/jobs/hiring" element={<AllJobsHiringManager/>}/>

              <Route path="/events/live" element={<EventsLive />} />
              <Route path="/events/bookmarks" element={<EventsBookMarks />} />
              <Route path="/events/upcoming" element={<EventsUpcoming />} />
              <Route path="/events/live-attending" element={<LiveAttend />} />
              <Route
                path="/posts/search/results"
                element={<FeedDefaultSearch />}
              />
              <Route
                path="/posts/details/:id"
                element={<PostDetailsRouted />}
              />
              <Route path="/users/profile/:id" element={<UserProfile />} />
              <Route
                path="/users/profile/posts/details"
                element={<PostDetailsContainer />}
              />
              {/* page not found; no urls matched */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>

            {/* snack bar success shown when tech post uploaded  */}
            {messageSnackPostTech && (
              <SnackBarPostSuccess
                messageSnackPostTech={messageSnackPostTech}
              />
            )}

            {/* decide bottom nav is to be show or not */}
            <Box>
              {isDefaultBottomNav && !isLoadingPostLaunch && <BottomNav />}
            </Box>

            {/* display speed dial in feed section only for mobile and no landscape */}
            {window.screen.availWidth <= 900 && (
              <Box>
                {/* decide speed dial being shown or is floating buton to refresh posts or  */}
                {isDefaultBottomNav &&
                  isDefaultSpeedDial &&
                  !isPostDetailed && (
                    <Box
                      position={"fixed"}
                      sx={{
                        left: 0,
                        right: window.screen.availWidth < 600 ? "40%" : "31%",
                        bottom: 50,
                      }}
                    >
                      {/* if is post search meaning posts from redux need referesh to default so fab else dial  */}

                      <BasicSpeedDial />
                    </Box>
                  )}
              </Box>
            )}
          </Suspense>
        </Box>
      ) : (
        // displayed when sidebar is off when full screen toggle clicked
        <Box
          display={"flex"}
          justifyContent={"center"}
          className="container-lg"
        >
          <Box
            marginRight={CustomFeedEquidstance()}
            flex={3}
            mt={1}
            p={1}
            color={"text.primary"}
          >
            <Suspense
              fallback={
                <Box
                  bgcolor={"background.default"}
                  color={"text.primary"}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "95vh",
                  }}
                >
                  {/* loader be shown before actual loading of content */}
                  <CircularProgress size={"2rem"} />
                </Box>
              }
            >
              <Routes>
                <Route path="/" element={<FeedDefaultContent />} />

                <Route path="/courses/paid" element={<CoursePaidContainer />} />
                <Route
                  path="/courses/paid/detailed"
                  element={<CourseDetailed />}
                />
                {/* jobseeker pane */}
                <Route path="/jobs" element={<AllJobsContainer />} />

                {/* hiring manager pane */}
                <Route path="/jobs/hiring" element={<AllJobsHiringManager/>}/>

                <Route path="/events/live" element={<EventsLive />} />
                <Route path="/events/bookmarks" element={<EventsBookMarks />} />
                <Route path="/events/upcoming" element={<EventsUpcoming />} />
                <Route path="/events/live-attending" element={<LiveAttend />} />
                <Route
                  path="/posts/search/results"
                  element={<FeedDefaultSearch />}
                />
                <Route
                  path="/posts/details/:id"
                  element={<PostDetailsRouted />}
                />
                <Route path="/users/profile/:id" element={<UserProfile />} />
                <Route
                  path="/users/profile/posts/details"
                  element={<PostDetailsContainer />}
                />
                {/* page not found; no urls matched */}
                <Route path="*" element={<PageNotFound />} />
              </Routes>

              {/* snack bar success shown when tech post uploaded  */}
              {messageSnackPostTech && (
                <SnackBarPostSuccess
                  messageSnackPostTech={messageSnackPostTech}
                />
              )}

              {/* decide bottom nav is to be show or not */}
              <Box>
                {isDefaultBottomNav && !isLoadingPostLaunch && <BottomNav />}
              </Box>

              {/* display speed dial in feed section only for mobile and no landscape */}
              {window.screen.availWidth <= 900 && (
                <Box>
                  {/* decide speed dial being shown or not */}
                  {isDefaultBottomNav &&
                    isDefaultSpeedDial &&
                    !isPostDetailed && (
                      <Box
                        position={"fixed"}
                        sx={{
                          left: 0,
                          right: window.screen.availWidth < 600 ? "40%" : "31%",
                          bottom: 50,
                        }}
                      >
                        {/* if is post search meaning posts from redux need refresh to default so fab else dial  */}

                        <BasicSpeedDial />
                      </Box>
                    )}
                </Box>
              )}
            </Suspense>
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
};

export default Feed;
