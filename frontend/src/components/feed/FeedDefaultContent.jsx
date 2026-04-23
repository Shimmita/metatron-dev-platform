import { Box, Stack, Typography, useTheme } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
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

const FeedDefaultContent = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageNumber, setPageNumber] = useState(1)
  const [messageBody, setMessageBody] = useState("")
  const [title, setTitle] = useState("")

  // redux states access
  const { posts } = useSelector((state) => state.currentPosts);
  const { connectTop } = useSelector((state) => state.currentConnectRequest);

  const { currentMode, isDefaultSpeedDial } = useSelector(
    (state) => state.appUI
  );

  const { user, isGuest } = useSelector((state) => state.currentUser);

  // will be used when the post is focused for full details
  const [postDetailedData, setPostDetailedData] = useState();


  // for about tutorial
  const isAboutShowTutorial = user?.isTutorial || false

  // will trigger alert for groups and community by default from
  // redux state of the user.
  const [openGroup, setOpenGroup] = useState(user?.isGroupTutorial || false)

  const dispatch = useDispatch();
  const theme = useTheme();

  const isDarkMode = currentMode === 'dark'

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

    // performing get all posts request
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/all`, {
        withCredentials: true,
      })
      .then((res) => {
        // update the redux of current post
        if (res?.data) {
          dispatch(updateCurrentPosts(res.data));
          // update the page number for the next fetch
          setPageNumber((prev) => prev + 1)
        }
      })
      .catch((err) => {
        //  user login session expired show logout alert
        if (err?.response?.data.login) {
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "Server is unreachable please try again later."
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
      sx={{
        minHeight: "calc(100vh - 120px)",
        px: { xs: 1, sm: 2 },
      }}
    > {/* render the post is focused for full viewing and that post detailed
      data is no null */}
      {postDetailedData ? (
        <Box
          sx={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(25px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            overflowX: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
            mt: 1
          }}
        >
          <PostDetailsContainer
            postDetailedData={postDetailedData}
            setPostDetailedData={setPostDetailedData}
          />
        </Box>
      ) : (
        <Box >
          {/* show progress loader when is fetching true */}
          {isFetching && (
            <Box
              width="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="70vh"
            >
              <Box
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  textAlign: "center",
                }}
              >
                <RotatingLines width={36} strokeColor="#14D2BE" />

                <Typography
                  mt={2}
                  fontSize={13}
                  sx={{ color: "rgba(240,244,250,0.65)" }}
                >
                  Fetching intelligence feed...
                </Typography>
              </Box>
            </Box>
          )}

          {/* scrollable container for the content */}
          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              "-ms-overflow-style": "none",
              "scrollbar-width": "none",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gap: 2,
                alignContent: "start",
              }}
            >


              <Stack
                spacing={2}
              >
                {/* display the overview posts on tablets(portrait) and mobiles only */}
                {!isFetching && (
                  <React.Fragment>
                    {(CustomDeviceIsSmall() || CustomDeviceTablet()) && (
                      <Box
                        sx={{
                          borderRadius: "12px",
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          backdropFilter: "blur(10px)",
                          p: 1,
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
                      <CardFeed
                        key={index}
                        post={post}
                        posts={posts}
                        isLastIndex={index === posts?.length - 1}
                        setPostDetailedData={setPostDetailedData}
                        pageNumber={pageNumber}
                        setPageNumber={setPageNumber}
                        errorMessage={errorMessage}
                        setErrorMessage={setErrorMessage}
                      />
                    );
                  })}
              </Stack>
            </Box>
          </Box>
        </Box>
      )}


    </Box>
  );
};

export default FeedDefaultContent;
