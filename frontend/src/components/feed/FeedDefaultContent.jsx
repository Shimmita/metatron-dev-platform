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
  const [pageNumber, setPageNumber] = useState(1);

  const { posts } = useSelector((state) => state.currentPosts);
  const { currentMode, isDefaultSpeedDial } = useSelector(
    (state) => state.appUI
  );
  const { user } = useSelector((state) => state.currentUser);

  const [postDetailedData, setPostDetailedData] = useState();

  const dispatch = useDispatch();
  const theme = useTheme();

  const isDarkMode = currentMode === "dark";

  // ensure speed dial is visible
  if (!isDefaultSpeedDial) {
    dispatch(handleShowingSpeedDial(true));
  }

  useEffect(() => {
    dispatch(resetDefaultBottomNav());
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetClearCurrentPosts());
  }, [dispatch]);

  // FETCH POSTS
  useEffect(() => {
    if (posts?.length > 0) return;

    setIsFetching(true);
    dispatch(handleLoadingPostLaunch(true));

    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/all`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.data) {
          dispatch(updateCurrentPosts(res.data));
          setPageNumber((prev) => prev + 1);
        }
      })
      .catch((err) => {
        if (err?.response?.data?.login) {
          window.location.reload();
        }

        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("Server unreachable. Try again later.");
          return;
        }

        setErrorMessage(err?.response?.data);
      })
      .finally(() => {
        setIsFetching(false);
        dispatch(resetAll());
      });
  }, [dispatch, posts]);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 120px)",
        px: { xs: 1, sm: 2 },
        maxWidth: "700px",
        mx: "auto",
      }}
    >
      {/* 🔥 POST DETAIL VIEW */}
      {postDetailedData ? (
        <Box
          sx={{
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            p: 1,
            mt: 1,
          }}
        >
          <PostDetailsContainer
            postDetailedData={postDetailedData}
            setPostDetailedData={setPostDetailedData}
          />
        </Box>
      ) : (
        <>
          {/* 🔥 LOADER */}
          {isFetching && (
            <Stack alignItems="center" mt={6} spacing={1}>
              <RotatingLines width={32} strokeColor="#14D2BE" />
              <Typography variant="caption" color="text.secondary">
                Loading your feed...
              </Typography>
            </Stack>
          )}

          {/* 🔥 ERROR */}
          {errorMessage && (
            <Box textAlign="center" mt={4}>
              <Typography color="error" variant="body2">
                {errorMessage}
              </Typography>
            </Box>
          )}

          {/* 🔥 EMPTY STATE */}
          {!isFetching && posts?.length === 0 && !errorMessage && (
            <Box textAlign="center" mt={6}>
              <Typography color="text.secondary">
                No posts yet
              </Typography>
            </Box>
          )}

          {/* 🔥 FEED */}
          {!isFetching && posts?.length > 0 && (
            <Stack spacing={2} mt={2}>
              {/* MOBILE OVERVIEW */}
              {(CustomDeviceIsSmall() || CustomDeviceTablet()) && (
                <Box
                  sx={{
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    p: 1,
                  }}
                >
                  <MobileTabCorousel />
                </Box>
              )}

              {/* POSTS */}
              {posts.map((post, index) => (
                <CardFeed
                  key={index}
                  post={post}
                  posts={posts}
                  isLastIndex={index === posts.length - 1}
                  setPostDetailedData={setPostDetailedData}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                />
              ))}
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};

export default FeedDefaultContent;