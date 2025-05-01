import { GradeRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import List from "@mui/material/List";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPostsTop } from "../../redux/CurrentPostsTop";
import FeaturedPost from "./layouts/FeaturedPost";

const screenWidth = window.screen.availWidth;
// get the rightbar expanded appropritately
const rightBarExpaned = () => {
  if (screenWidth > 1300) {
    return 360;
  }

  if (screenWidth > 1250) {
    return 350;
  }

  if (screenWidth > 1400) {
    return 380;
  }
  return;
};

export default function FeaturedPostContainer() {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();

  // redux states
  const { postsTop } = useSelector((state) => state.currentPostsTop);
  // fetch posts from the backend
  useEffect(() => {
    // check if there is no posts then fetch else dont api calls
    if (postsTop) {
      return;
    }
    // set is fetching to true
    setIsFetching(true);

    // performing post request
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/top`, {
        withCredentials: true,
      })
      .then((res) => {
        // update the redux of current post
        if (res?.data && res.data) {
          dispatch(updateCurrentPostsTop(res.data));
        }
      })
      .catch(async (err) => {
        console.log(err);

        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "Server is unreachable check your internet connection"
          );
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [dispatch, postsTop]);

  return (
    <React.Fragment>
      <Box alignItems={"center"} display={"flex"} justifyContent={"center"}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={2}
          pt={2}
        >
          <Typography fontWeight={"bold"} color={"primary"}>
            FEATURED POST
          </Typography>
          <GradeRounded color="primary" />
        </Box>
      </Box>
      <List
        className="rounded mt-1"
        sx={{
          bgcolor: "background.paper",
          width: rightBarExpaned(),
        }}
      >
        <Box>
          {postsTop &&
            postsTop.map((post, index) => (
              <Box key={index}>
                <FeaturedPost post={post} />
              </Box>
            ))}
        </Box>
      </List>
    </React.Fragment>
  );
}
