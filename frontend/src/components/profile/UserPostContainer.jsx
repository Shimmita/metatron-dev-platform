import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./UserPost.css";
import UserPostCard from "./UserPostCard";

function UserPostContainer({ userId, setPostDetailedData }) {
  const [isFetching, setIsFetching] = useState(true);
  const [postsData, setPostsData] = useState();
  const [erroMessage, setErrorMesssage] = useState("");

  // axios default credentials
  axios.defaults.withCredentials = true;
  useEffect(() => {
    // fetch details of the liked or reacted user based on their id
    axios
      .get(`http://localhost:5000/metatron/api/v1/posts/users/all/${userId}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.data) {
          setPostsData(res.data);
        }
      })
      .catch((err) => {
        // there is an error
        if (err?.code === "ERR_NETWORK") {
          // update the snackbar notification of the error of connection
          setErrorMesssage("Network Error");
          return;
        }
        // update the snackbar notification of error from the server
        setErrorMesssage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }, [userId]);

  return (
    <Box className="post-card-container">
      {/* displayed when there is an error of request */}
      {erroMessage && (
        <Box width={"100%"}>
          <Typography
            mt={"8rem"}
            textAlign={"center"}
            fontWeight={"bold"}
            color={"text.secondary"}
            variant="body2"
          >
            {erroMessage}
          </Typography>
        </Box>
      )}
      {/* displayed when fetching process is ongoing */}
      {isFetching && (
        <Box width={"100%"}>
          <Box mt={8} display={"flex"} justifyContent={"center"}>
            {/* progressbar */}
            <CircularProgress size={"20px"} />
            <Typography
              mt={1}
              textAlign={"center"}
              fontWeight={"bold"}
              color={"text.secondary"}
              variant="body2"
            >
              loading
            </Typography>
          </Box>
        </Box>
      )}
      {/* rendered when there is data only */}
      {postsData &&
        postsData?.map((post, index) => (
          <Box key={index}>
            <UserPostCard
              post={post}
              setPostDetailedData={setPostDetailedData}
            />
          </Box>
        ))}

      {/* displayed when no post and no fetching request on progress */}
      {!(postsData && isFetching && erroMessage) && (
        <Box width={"100%"}>
          <Typography
            mt={"8rem"}
            textAlign={"center"}
            fontWeight={"bold"}
            color={"text.secondary"}
            variant="body2"
          >
            No Post Yet
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default UserPostContainer;
