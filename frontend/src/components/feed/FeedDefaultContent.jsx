import { Box, Button, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleLoadingPostLaunch,
  handleSidebarRightbar,
  resetAll,
  resetDefaultBottomNav,
} from "../../redux/AppUI";
import { updateCurrentPosts } from "../../redux/CurrentPosts";
import CardFeed from "../custom/CardFeed";
import PostDetailsContainer from "../post/PostDetailsContiner";
import MobileTabCorousel from "../rightbar/MobileTabCorousel";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
const AlertChatBot = lazy(() => import("../alerts/AlertChatBot"));
const AlertNoPosts = lazy(() => import("../alerts/AlertNoPosts"));

const FeedDefaultContent = () => {
  // axios default credentials
  axios.defaults.withCredentials = true;
  const [openAlertNoPosts, setOpenAlertNoPosts] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // will be used when the post is focused for full details
  const [postDetailedData, setPostDetailedData] = useState();
  // axios default credentials
  axios.defaults.withCredentials = true;

  // redux states
  const dispatch = useDispatch();
  // redux states access
  const { isSidebarRighbar, isDarkMode } = useSelector((state) => state.appUI);
  const { posts } = useSelector((state) => state.currentPosts);

  useEffect(() => {
    // always default sidebar and rightbar showing for larger screens
    if (!isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
    }
  }, [isSidebarRighbar, dispatch]);

  // handle showing of default bottom nav
  useEffect(() => {
    dispatch(resetDefaultBottomNav());
  }, [dispatch]);

  // fetch posts from the backend
  useEffect(() => {
    // set is fetching to true
    setIsFetching(true);
    // dispatch action for updating is loading in the redux
    dispatch(handleLoadingPostLaunch(true));

    // performing post request
    axios
      .get(`http://localhost:5000/metatron/api/v1/posts/all`, {
        withCredentials: true,
      })
      .then((res) => {
        // update the redux of current post
        if (res?.data) {
          dispatch(updateCurrentPosts(res.data));
        } else {
          // no more posts
          setOpenAlertNoPosts(true);
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
          setOpenAlertNoPosts(true);
          return;
        }
        setOpenAlertNoPosts(true);
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
        // reset all the UI states to default which will update isloading in redux
        dispatch(resetAll());
      });
  }, [dispatch]);

  // handle clearing of isNetwork and error message when the alert shown
  const handleClearing = () => {
    setErrorMessage("");
  };

  return (
    <React.Fragment>
      {/* render the post is focused for full viewing and that post detailed
      data is no null */}
      {postDetailedData && postDetailedData ? (
        <Box height={CustomDeviceIsSmall() ? "91.7vh" : "91vh"}>
          <Box
            height={"85vh"}
            className={!CustomDeviceIsSmall() && "shadow rounded p-2"}
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
            <PostDetailsContainer
              postDetailedData={postDetailedData}
              setPostDetailedData={setPostDetailedData}
            />
          </Box>
        </Box>
      ) : (
        <Box height={isFetching ? "91vh" : undefined}>
          {/* show progress loader when is fetching true */}
          {isFetching && (
            <Box
              height={"80vh"}
              width={"100%"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              className="shadow rounded"
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

          {/* display the overview posts on tablets(portratit) and mobiles only */}

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
                    {/* show refresh button when the item is last */}
                    {index === posts.length - 1 && (
                      <Box
                        display={"flex"}
                        justifyContent={"center"}
                        sx={{ border: "1px solid", borderColor: "divider" }}
                        className={"shadow rounded"}
                        p={1}
                        mt={2}
                        mb={
                          CustomDeviceTablet() || CustomDeviceIsSmall() ? 14 : 8
                        }
                      >
                        <Button
                          className="rounded-5"
                          size="medium"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: "bold",
                          }}
                        >
                          Continue Browsing
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
        </Box>
      )}

      {/* display chat bot */}
      <AlertChatBot />
      {/* alert no posts if true */}
      <AlertNoPosts
        openAlert={openAlertNoPosts}
        setOpenAlert={setOpenAlertNoPosts}
        errorMessage={errorMessage}
        handleClearing={handleClearing}
      />
    </React.Fragment>
  );
};

export default FeedDefaultContent;
