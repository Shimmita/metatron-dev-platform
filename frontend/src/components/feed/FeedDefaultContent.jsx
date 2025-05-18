import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleLoadingPostLaunch,
  handleShowingSpeedDial,
  resetAll,
  resetDefaultBottomNav,
} from "../../redux/AppUI";
import {
  resetClearCurrentPosts,
  updateCurrentPosts,
} from "../../redux/CurrentPosts";
import CardFeed from "../custom/CardFeed";
import PostDetailsContainer from "../post/PostDetailsContiner";
import MobileTabCorousel from "../rightbar/MobileTabCorousel";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
const AlertChatBot = lazy(() => import("../alerts/AlertChatBot"));

const FeedDefaultContent = () => {
  // axios default credentials
  axios.defaults.withCredentials = true;
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // will be used when the post is focused for full details
  const [postDetailedData, setPostDetailedData] = useState();
  // axios default credentials
  axios.defaults.withCredentials = true;

  // redux states
  const dispatch = useDispatch();
  // redux states access
  const { posts } = useSelector((state) => state.currentPosts);

  const { isDarkMode, isDefaultSpeedDial } = useSelector(
    (state) => state.appUI
  );

  // show speed dial if ain't visible
  if (!isDefaultSpeedDial) {
    dispatch(handleShowingSpeedDial(true));
  }

  // handle showing of default bottom nav
  useEffect(() => {
    dispatch(resetDefaultBottomNav());
  }, [dispatch]);

  // reset clear any previous posts results specially from search
  useEffect(() => {
    dispatch(resetClearCurrentPosts());
  }, [dispatch]);

  // fetch posts from the backend
  useEffect(() => {
    // if there are posts on refresh don't network request
    if (posts?.length > 0) {
      return;
    }
    // set is fetching to true
    setIsFetching(true);
    // dispatch action for updating is loading in the redux
    dispatch(handleLoadingPostLaunch(true));

    // performing post request
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/all`, {
        withCredentials: true,
      })
      .then((res) => {
        // update the redux of current post
        if (res?.data) {
          dispatch(updateCurrentPosts(res.data));
        } else {
          // no more posts
          //setOpenAlertNoPosts(true);
        }
      })
      .catch((err) => {
        //  user login session expired show logout alert
        if (err?.response?.data.login) {
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "Server is unreachable please try again later to complete your request"
          );
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
        // reset all the UI states to default which will update is_loading in redux
        dispatch(resetAll());
      });
  }, [dispatch, posts]);



  return (
    <Box
      height={
        CustomDeviceTablet()
          ? "92vh"
          : CustomDeviceIsSmall()
          ? "90vh"
          : "85vh"
      }
    >
      {/* render the post is focused for full viewing and that post detailed
      data is no null */}
      {postDetailedData && postDetailedData ? (
        <Box
          height={"85vh"}
          className={
            CustomDeviceTablet() ? "shadow rounded p-2" : "rounded p-2"
          }
          sx={{
            border:
              !CustomDeviceIsSmall() && isDarkMode ? "1px solid" : "1px solid",
            borderColor:
              !CustomDeviceIsSmall() && isDarkMode ? "divider" : "divider",

            overflowX: "auto",
            // Hide scrollbar for Chrome, Safari and Opera
            "&::-webkit-scrollbar": {
              display: "none",
            },
            // Hide scrollbar for IE, Edge and Firefox
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          <PostDetailsContainer
            postDetailedData={postDetailedData}
            setPostDetailedData={setPostDetailedData}
          />
        </Box>
      ) : (
        <Box height={isFetching ? "99vh" : undefined}>
          {/* show progress loader when is fetching true */}
          {isFetching && (
            <Box
              height={"80vh"}
              width={"100%"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Box>
                <Box display={"flex"} justifyContent={"center"}>
                  <CircularProgress size={"30px"} />
                </Box>
                <Typography
                  mt={2}
                  textAlign={"center"}
                  color={"text.secondary"}
                  variant="body2"
                >
                  posts ...
                </Typography>
              </Box>
            </Box>
          )}

          {/* scrollable container for the content */}
          <Box
            height={"80vh"}
            sx={{
              overflowX: "auto",
              // Hide scrollbar for Chrome, Safari and Opera
              "&::-webkit-scrollbar": {
                display: "none",
              },
              // Hide scrollbar for IE, Edge and Firefox
              "-ms-overflow-style": "none",
              "scrollbar-width": "none",
            }}
          >
            {/* display the overview posts on tablets(portrait) and mobiles only */}
            {!isFetching && (
              <React.Fragment>
                {(CustomDeviceIsSmall() || CustomDeviceTablet()) && (
                  <Box
                    className="mb-3 rounded p-1"
                    sx={{
                      border: isDarkMode && "1px solid",
                      borderColor: isDarkMode && "divider",
                    }}
                  >
                    {" "}
                    <MobileTabCorousel />
                  </Box>
                )}
              </React.Fragment>
            )}

            {/* map through the posts and display them to the user */}
            {
              posts?.map((post, index) => {
                return (
                  <Box key={post?._id}>
                    <Box>
                      {/* feed card detailed post */}
                      <CardFeed
                        post={post}
                        setPostDetailedData={setPostDetailedData}
                      />
                    </Box>
                  </Box>
                );
              })}
          </Box>
        </Box>
      )}

      {/* display chat bot */}
      <AlertChatBot />
   
    </Box>
  );
};

export default FeedDefaultContent;
