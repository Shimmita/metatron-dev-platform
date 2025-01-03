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
import MobileTabCorousel from "../rightbar/MobileTabCorousel";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
const AlertNoPosts = lazy(() => import("../alerts/AlertNoPosts"));

const FeedDefaultContent = () => {
  // axios default credentials
  axios.defaults.withCredentials = true;
  const [openAlertNoPosts, setOpenAlertNoPosts] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // axios default credentials
  axios.defaults.withCredentials = true;

  // redux states
  const dispatch = useDispatch();
  // redux states access
  const { isSidebarRighbar } = useSelector((state) => state.appUI);
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
      .catch(async (err) => {
        console.log(err);
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
        {/* map through the posts and display them to the user */}
        {posts &&
          posts.map((post, index) => {
            return (
              <Box key={index}>
                <Box className="mb-3">
                  {/* corousel of top pics */}
                  {(CustomDeviceIsSmall() || CustomDeviceTablet()) &&
                  index === 0 ? (
                    <MobileTabCorousel />
                  ) : null}
                </Box>

                <Box>
                  {/* feed card detailed post */}
                  <CardFeed post={post} />
                  {/* show refresh button when the item is last */}
                  {index === posts.length - 1 && (
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      m={2}
                      mb={
                        CustomDeviceTablet() || CustomDeviceIsSmall() ? 16 : 8
                      }
                    >
                      <Button
                        className="rounded-5"
                        size="medium"
                        sx={{ textTransform: "capitalize" }}
                        variant="contained"
                      >
                        Browse
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
      </Box>

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
