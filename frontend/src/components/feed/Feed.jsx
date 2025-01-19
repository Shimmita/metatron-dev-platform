import { Box, CircularProgress } from "@mui/material";
import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import BasicSpeedDial from "../custom/SpeedDial";

import BottomNav from "../custom/BottomNav";
import SnackBarPostSuccess from "../snackbar/SnackBarPostSuccess";
import CustomFeedEquidstance from "../utilities/CustomFeedEquidstance";
const CourseDetailed = lazy(() => import("../courses/layout/CourseDetailed"));
const AllApplicantsContainer = lazy(() =>
  import("../jobs/AllApplicantsContainer")
);
const JobsAppliedContainer = lazy(() => import("../jobs/JobsAppliedContainer"));
const AllJobsContainer = lazy(() => import("../jobs/AllJobsContainer"));

const CoursePaidContainer = lazy(() =>
  import("../courses/CoursePaidContainer")
);
const PageNotFound = lazy(() => import("../notfound/PageNotFound"));
const MyPostCardEdit = lazy(() =>
  import("../more/account/post/MyPostCardEdit")
);
const MyPostDetailed = lazy(() =>
  import("../more/account/post/MyPostDetailed")
);
const UserProfile = lazy(() => import("../profile/UserProfile"));
const PostDetailsContainer = lazy(() => import("../post/PostDetailsContiner"));

const AccountPremium = lazy(() => import("../more/account/AccountPremium"));
const AccountFriends = lazy(() => import("../more/account/AccountFriends"));
const AccountPosts = lazy(() => import("../more/account/AccountPosts"));
const LiveAttend = lazy(() => import("../attend/LiveAttendRender"));
const AccountSettingsTabs = lazy(() =>
  import("../more/account/AccountSettings")
);

const AboutPage = lazy(() => import("../more/about/About"));
const FeedDefaultContent = lazy(() => import("./FeedDefaultContent"));
const EventsLive = lazy(() => import("../events/EventsLive"));
const EventsUpcoming = lazy(() => import("../events/EventsUpcoming"));
const EventsBookMarks = lazy(() => import("../events/EventsBookMarks"));

const Feed = () => {
  // redux states
  const { isTabSideBar, isDefaultBottomNav, isLoadingPostLaunch } = useSelector(
    (state) => state.appUI
  );
  const { messageSnackPostTech } = useSelector(
    (state) => state.currentSnackBar
  );

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
              <Route
                path="/account/settings"
                element={<AccountSettingsTabs />}
              />
              <Route path="/account/posts" element={<AccountPosts />} />
              <Route
                path="/account/posts/details"
                element={<MyPostDetailed />}
              />
              <Route path="/account/posts/edit" element={<MyPostCardEdit />} />
              <Route path="/account/people" element={<AccountFriends />} />
              {/* <Route path="/account/premium" element={<AccountPremium />} /> */}
              <Route path="/courses/paid" element={<CoursePaidContainer />} />
              <Route
                path="/courses/paid/detailed"
                element={<CourseDetailed />}
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/jobs" element={<AllJobsContainer />} />
              <Route path="/jobs/applied" element={<JobsAppliedContainer />} />
              <Route
                path="/jobs/applicants"
                element={<AllApplicantsContainer />}
              />
              <Route path="/events/live" element={<EventsLive />} />
              <Route path="/events/bookmarks" element={<EventsBookMarks />} />
              <Route path="/events/upcoming" element={<EventsUpcoming />} />
              <Route path="/events/live-attending" element={<LiveAttend />} />
              <Route path="/posts/details" element={<PostDetailsContainer />} />
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
                {isDefaultBottomNav && (
                  <Box
                    position={"fixed"}
                    sx={{
                      left: 0,
                      right: window.screen.availWidth < 600 ? "40%" : "31%",
                      bottom: 50,
                    }}
                  >
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
                <Route
                  path="/account/settings"
                  element={<AccountSettingsTabs />}
                />
                <Route path="/account/posts" element={<AccountPosts />} />
                <Route
                  path="/account/posts/details"
                  element={<MyPostDetailed />}
                />
                <Route
                  path="/account/posts/edit"
                  element={<MyPostCardEdit />}
                />
                <Route path="/account/people" element={<AccountFriends />} />
                <Route path="/account/premium" element={<AccountPremium />} />
                <Route path="/courses/paid" element={<CoursePaidContainer />} />
                <Route
                  path="/courses/paid/detailed"
                  element={<CourseDetailed />}
                />

                <Route path="/about" element={<AboutPage />} />
                <Route path="/jobs" element={<AllJobsContainer />} />
                <Route
                  path="/jobs/applied"
                  element={<JobsAppliedContainer />}
                />
                <Route
                  path="/jobs/applicants"
                  element={<AllApplicantsContainer />}
                />

                <Route path="/events/live" element={<EventsLive />} />
                <Route path="/events/bookmarks" element={<EventsBookMarks />} />
                <Route path="/events/upcoming" element={<EventsUpcoming />} />
                <Route path="/events/live-attending" element={<LiveAttend />} />
                <Route
                  path="/posts/details"
                  element={<PostDetailsContainer />}
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
                  {isDefaultBottomNav && (
                    <Box
                      position={"fixed"}
                      sx={{
                        left: 0,
                        right: window.screen.availWidth < 600 ? "40%" : "31%",
                        bottom: 50,
                      }}
                    >
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
