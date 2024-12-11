import { Box, Button } from "@mui/material";
import axios from "axios";
import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleSidebarRightbar,
  resetDefaultBottomNav,
} from "../../redux/AppUI";
import { updateCurrentPosts } from "../../redux/CurrentPosts";
import CardFeed from "../custom/CardFeed";
import MobileTabCorousel from "../rightbar/MobileTabCorousel";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
const AlertNoPosts = lazy(() => import("./AlertNoPosts"));

const FeedDefaultContent = () => {
  // for follow/connect people people
  const items = Array.from({ length: 20 });
  // axios default credentials
  axios.defaults.withCredentials = true;
  const [openAlertNoPosts, setOpenAlertNoPosts] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isNetwork, setIsNetwork] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
  }, []);

  // handle showing of default bottom nav
  useEffect(() => {
    dispatch(resetDefaultBottomNav());
  }, []);

  // fetch posts from the backend
  useEffect(() => {
    // set is fetching to true
    setIsFetching(true);
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
          setIsNetwork(true);
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
        setIsFetching(false);
      });
  }, []);

  // handle clearing of isNetwork and error message when the alert shown
  const handleClearing = () => {
    setIsNetwork(false);
    setErrorMessage("");
  };

  return (
    <React.Fragment>
      <Box>
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
        isNetwork={isNetwork}
        errorMessage={errorMessage}
        handleClearing={handleClearing}
      />
    </React.Fragment>
  );
};

export default FeedDefaultContent;
