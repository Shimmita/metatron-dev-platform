import { Box, CircularProgress } from "@mui/material";
import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import BasicSpeedDial from "../custom/SpeedDial";
import useScrolledDown from "../hooks/useScrolledDown";

import BottomNav from "../custom/BottomNav";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomFeedEquidstance from "../utilities/CustomFeedEquidstance";
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
const BottomJobs = lazy(() => import("../more/bottom/BottomJobs"));
const FeedDefaultContent = lazy(() => import("./FeedDefaultContent"));
const EventsLive = lazy(() => import("../events/EventsLive"));
const EventsUpcoming = lazy(() => import("../events/EventsUpcoming"));
const EventsBookMarks = lazy(() => import("../events/EventsBookMarks"));

const Feed = () => {
  // backdrop state
  const { isScrolledDown, isTabSideBar } = useSelector((state) => state.appUI);

  // run the listening component hook
  useScrolledDown();

  return (
    <React.Fragment>
      {isTabSideBar ? (
        // displayed when sidebar is on when full screen toggle not clicked

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
                  height: "91vh",
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
              <Route path="/account/premium" element={<AccountPremium />} />

              <Route path="/about" element={<AboutPage />} />
              <Route path="/jobs" element={<BottomJobs />} />
              <Route path="/events/live" element={<EventsLive />} />
              <Route path="/events/bookmarks" element={<EventsBookMarks />} />
              <Route path="/events/upcoming" element={<EventsUpcoming />} />
              <Route path="/events/live-attending" element={<LiveAttend />} />
              <Route path="/posts/details" element={<PostDetailsContainer />} />
              <Route path="/users/profile" element={<UserProfile />} />
              <Route
                path="/users/profile/posts/details"
                element={<PostDetailsContainer />}
              />
              {/* page not found; no urls matched */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>

            {/* if scrolled down dont show bottom nav */}
            <Box>{!isScrolledDown && <BottomNav />}</Box>

            {/* display speed dial in feed section only for mobile and no landscape */}
            {window.screen.availWidth <= 900 && (
              <Box>
                {/* show speed dial if not scrolling down */}
                {!isScrolledDown && (
                  <>
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
                  </>
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
                    height: "91vh",
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

                <Route path="/about" element={<AboutPage />} />
                <Route path="/jobs" element={<BottomJobs />} />
                <Route path="/events/live" element={<EventsLive />} />
                <Route path="/events/bookmarks" element={<EventsBookMarks />} />
                <Route path="/events/upcoming" element={<EventsUpcoming />} />
                <Route path="/events/live-attending" element={<LiveAttend />} />
                <Route
                  path="/posts/details"
                  element={<PostDetailsContainer />}
                />
                <Route path="/users/profile" element={<UserProfile />} />
                <Route
                  path="/users/profile/posts/details"
                  element={<PostDetailsContainer />}
                />
                {/* page not found; no urls matched */}
                <Route path="*" element={<PageNotFound />} />
              </Routes>

              {/* if scrolled down dont show bottom nav */}
              <Box>{!isScrolledDown && <BottomNav />}</Box>

              {/* display speed dial in feed section only for mobile and no landscape */}
              {window.screen.availWidth <= 900 && (
                <Box>
                  {/* show speed dial if not scrolling down */}
                  {!isScrolledDown && (
                    <>
                      <Box
                        position={"fixed"}
                        sx={{
                          left: 0,
                          right: CustomDeviceIsSmall()
                            ? "40%"
                            : CustomDeviceTablet() && isTabSideBar
                            ? "31%"
                            : "45%",
                          bottom: 50,
                        }}
                      >
                        <BasicSpeedDial />
                      </Box>
                    </>
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
