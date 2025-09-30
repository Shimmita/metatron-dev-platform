import { Box, CircularProgress } from "@mui/material";
import { lazy, Suspense, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import BasicSpeedDial from "../custom/SpeedDial";

import { handleShowingSpeedDial } from "../../redux/AppUI";
import BottomNav from "../bottom/BottomNav";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomFeedEquidstance from "../utilities/CustomFeedEquidstance";
const EventsContainer =lazy(()=>import("../events/EventsContainer")) ;
const SnackBarPostSuccess =lazy(()=>import("../snackbar/SnackBarPostSuccess")) ;
const CoursesMainContainer =lazy(()=>import("../courses/CoursesMainContainer"));
const CoursesInstrContainer =lazy(()=>import("../courses/CoursesInstrContainer")) ;
const FeedDefaultSearch = lazy(() => import("./FeedDefaultSearch"));
const PostDetailsRouted = lazy(() => import("../post/PostDetailsRouted"));
const AllJobsHiringManager=lazy(()=>import("../jobs/AllJobsHiringManager")) ;
const AllJobsContainer = lazy(() => import("../jobs/AllJobsContainer"));
const PageNotFound = lazy(() => import("../notfound/PageNotFound"));
const PostDetailsContainer = lazy(() => import("../post/PostDetailsContiner"));
const FeedDefaultContent = lazy(() => import("./FeedDefaultContent"));


const Feed = () => {
  // redux states
  const {
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
        <Box
          mr={CustomFeedEquidstance()}
          flex={3}
          p={1}
          mt={1}
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
                  height: "98vh",
                }}
              >
                {/* loader be shown before actual loading of content */}
                <CircularProgress size={"2rem"} />
              </Box>
            }
          >
          
            <Routes>
              <Route path="/" element={<FeedDefaultContent />} />

              {/* events */}
              <Route path="/events" element={<EventsContainer />} />

            
              {/* final selection route for courses */}
              <Route path="/courses/available" element={<CoursesMainContainer />} />
               {/* instructor */}
              <Route path="/courses/instructor" element={<CoursesInstrContainer />} />


              {/* jobseeker pane */}
              <Route path="/jobs" element={<AllJobsContainer />} />

              {/* hiring manager pane */}
              <Route path="/jobs/hiring" element={<AllJobsHiringManager/>}/>

              <Route
                path="/posts/search/results"
                element={<FeedDefaultSearch />}
              />
              <Route
                path="/posts/details/:id"
                element={<PostDetailsRouted />}
              />
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
              <Box>
                {/* decide speed dial being shown or is floating button to refresh posts or  */}
                {isDefaultBottomNav &&
                  isDefaultSpeedDial &&
                  !isPostDetailed && (
                    <Box
                      position={"fixed"}
                      sx={{
                        left: 0,
                        right: CustomDeviceIsSmall()? "39.5%" : CustomDeviceTablet() ? "31%" : "47%",
                        bottom: CustomDeviceIsSmall() ? 30:5,
                      }}
                    >
                      {/* if is post search meaning posts from redux need refresh to default so fab else dial  */}
                      <BasicSpeedDial />
                    </Box>
                  )}
              </Box>
          </Suspense>
        </Box>
      
  );
};

export default Feed;
