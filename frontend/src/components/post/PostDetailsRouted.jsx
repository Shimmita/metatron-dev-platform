import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { handleShowingSpeedDial } from "../../redux/AppUI";
import PageNotFound from "../notfound/PageNotFound";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import PostRoutedFeed from "./PostRoutedFeed";

function PostDetailsRouted() {
  const [postDetailedData, setPostDetailedData] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const [isError, setIsError] = useState();
  //   getting the id of the post route using useParams hook
  const { id: postId } = useParams();
  // axios default credentials
  axios.defaults.withCredentials = true;
  // use layout effect to prefetch the data of the post before being renderd component
  useLayoutEffect(() => {
    // close the showing of the speed dial
    dispatch(handleShowingSpeedDial(false));

    // set is fetching to true
    setIsUploading(true);

    // performing post request
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/all/${postId}`, {
        withCredentials: true,
      })
      .then((res) => {
        // update the post details
        setPostDetailedData(res.data);
      })
      .catch((err) => {
        console.log(err);
        // set is error true for display page not found
        setIsError(true);

        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("server is unreachable");
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsUploading(false);
      });
  }, [postId, dispatch]);

  return (
    <Box
      height={CustomDeviceIsSmall() ? "91.7vh" : "91vh"}
      color={"text.primary"}
    >
      <Box
        height={"85vh"}
        className={
          CustomDeviceIsSmall() || CustomDeviceTablet()
            ? "shadow rounded p-2"
            : "rounded"
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
        {/* displayed when fetching */}
        {isUploading && (
          <Box display={"flex"} justifyContent={"center"} height={"30vh"}>
            <Box display={"flex"} justifyContent={"center"}>
              <CircularProgress size={20} />
            </Box>
          </Box>
        )}
        {/* feed here */}
        {postDetailedData && (
          <PostRoutedFeed
            postDetailedData={postDetailedData}
            setPostDetailedData={setPostDetailedData}
          />
        )}

        {/* display  page not found component */}
        {isError && (
          <Box>
            <PageNotFound mesage={errorMessage} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default PostDetailsRouted;
