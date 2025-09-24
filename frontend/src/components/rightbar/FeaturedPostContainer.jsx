import { BarChart, InfoRounded } from "@mui/icons-material";
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from "@mui/material";
import List from "@mui/material/List";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPostsTop } from "../../redux/CurrentPostsTop";
import AlertGeneral from "../alerts/AlertGeneral";
import FeaturedPost from "./layouts/FeaturedPost";

const screenWidth = window.screen.availWidth;
// get the rightbar expanded appropriately
const rightBarExpanded = () => {
  if (screenWidth > 1300) {
    return 360;
  }

  if (screenWidth > 1250) {
    return 350;
  }

  if (screenWidth > 1400) {
    return 380;
  }
};

export default function FeaturedPostContainer() {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const[openAlertGeneral,setOpenAlertGeneral]=useState(false)
  const theme=useTheme()
  const isMobileTab=useMediaQuery(theme.breakpoints.down('md'))

  const dispatch = useDispatch();

  // redux states
  const { postsTop } = useSelector((state) => state.currentPostsTop);
  // fetch posts from the backend
  useEffect(() => {
    // check if there is no posts then fetch else don't api calls
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
        setOpenAlertGeneral(true)
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

          {/* loading content when not ready */}
          {isFetching ? (
            <CircularProgress size={18}/>
          ):(
            <BarChart color="primary" sx={{width:22, height:22}} />
          )}
        </Box>
      </Box>
      <List
        className="rounded mt-2"
        sx={{
          bgcolor: "background.paper",
          width: rightBarExpanded(),
        }}
      >
        <Box>
          {postsTop?.slice(0,isMobileTab?3:undefined).map((post, index) => (
              <Box key={post?._id}>
                <FeaturedPost 
                isLastIndex={index===postsTop?.length-1}
                post={post} />
              </Box>
            ))}
        </Box>
      </List>

       {/* alert general of the error message */}
        {errorMessage && (
          <AlertGeneral
          title={'something went wrong!'}
          message={errorMessage}
          isError={true}
          openAlertGeneral={openAlertGeneral}
          setOpenAlertGeneral={setOpenAlertGeneral}
          setErrorMessage={setErrorMessage}
          defaultIcon={<InfoRounded/>}
          />
        )}

    </React.Fragment>
  );
}
