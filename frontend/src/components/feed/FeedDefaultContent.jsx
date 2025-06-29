import { ErrorOutline } from "@mui/icons-material";
import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
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
import AlertGeneral from "../alerts/AlertGeneral";
import CardFeed from "../custom/CardFeed";
import PostDetailsContainer from "../post/PostDetailsContiner";
import MobileTabCorousel from "../rightbar/MobileTabCorousel";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

const FeedDefaultContent = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openGeneralAlert,setOpenGeneralAlert]=useState()

  // will be used when the post is focused for full details
  const [postDetailedData, setPostDetailedData] = useState();
  // axios default credentials
  axios.defaults.withCredentials = true;

  // redux states
  const dispatch = useDispatch();
  // redux states access
  const { posts } = useSelector((state) => state.currentPosts);

  const { currentMode, isDefaultSpeedDial } = useSelector(
    (state) => state.appUI
  );
  const isDarkMode=currentMode==='dark'


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
        setOpenGeneralAlert(true)
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
      height={"88.5vh"}
    >
      {/* render the post is focused for full viewing and that post detailed
      data is no null */}
      {postDetailedData ? (
        <Box
          className={
            CustomDeviceTablet() ? "shadow rounded p-2" : "rounded p-2"
          }
          sx={{
            border: "1px solid",
            borderColor:"divider",

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
        <Box >
          {/* show progress loader when is fetching true */}
          {isFetching && (
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"center"}
              height={'95vh'}
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
          maxHeight={'85vh'}
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
                        isLastIndex={index===posts?.length-1}
                        setPostDetailedData={setPostDetailedData}
                      />
                    </Box>
                  </Box>
                );
              })}
          </Box>
        </Box>
      )}

      {/* alert general error */}

      {openGeneralAlert && (
        <AlertGeneral 
        openAlertGeneral={openGeneralAlert}
        setOpenAlertGeneral={setOpenGeneralAlert}
        setErrorMessage={setErrorMessage}
        isError={true}
        title={"Error"}
        message={errorMessage}
        defaultIcon={<ErrorOutline/>}

        />
      )}
    

    </Box>
  );
};

export default FeedDefaultContent;
