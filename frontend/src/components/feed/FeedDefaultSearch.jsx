import { Box } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleShowingSpeedDial } from "../../redux/AppUI";
import CardFeed from "../custom/CardFeed";
import PostDetailsContainer from "../post/PostDetailsContiner";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

const FeedDefaultSearch = () => {
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

  // show speed dial if aint visible
  if (isDefaultSpeedDial) {
    dispatch(handleShowingSpeedDial(false));
  }

  return (
    <Box height={CustomDeviceIsSmall() ? "91.7vh" : "91vh"}>
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
        <Box
          height={"85vh"}
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
          {/* map through the posts and display them to the user */}
          {posts &&
            posts.map((post, index) => {
              return (
                <Box key={index}>
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
      )}
    </Box>
  );
};

export default FeedDefaultSearch;
