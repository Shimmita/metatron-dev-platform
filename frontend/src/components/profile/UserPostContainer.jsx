import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { resetClearCurrentPosts } from "../../redux/CurrentPosts";
import { updateMessageConnectRequest } from "../../redux/CurrentSnackBar";
import SnackbarConnect from "../snackbar/SnackbarConnect";
import "./UserPost.css";
import UserPostCard from "./UserPostCard";

function UserPostContainer({ userId, setPostDetailedData, setIsPostEditMode }) {
  const [isFetching, setIsFetching] = useState(true);
  const [postsData, setPostsData] = useState();
  const [erroMessage, setErrorMesssage] = useState("");

  const [showDeleteALert, setShowDeleteAlert] = useState(false);
  const [deletePostID, setDeletePostID] = useState();
  const [isDeleting, setIsDeleting] = useState(false);

  // redux states
  const { user } = useSelector((state) => state.currentUser);

  const { messageConnectRequestSent } = useSelector(
    (state) => state.currentSnackBar
  );
  // dispatch for redux to emit actions and store update
  const dispatch = useDispatch();

  // axios default credentials
  axios.defaults.withCredentials = true;
  useEffect(() => {
    // fetch details of the liked or reacted user based on their id
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/users/all/${userId}`, {
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

  // complete post deletion, user agreed
  const handleCompletePostDelete = () => {
    setIsDeleting(true);
    // delete the post by passing userId and postdID for further
    // backend validation
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/delete/${user?._id}/${deletePostID}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res?.data) {
          // set post data to null for useEffect will re-render
          setPostsData();

          // update redux snack notfication message
          dispatch(updateMessageConnectRequest(res.data));

          // update the redux of current posts suppose the post is present
          // in the feed.
          dispatch(resetClearCurrentPosts());
        }
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          dispatch(
            updateMessageConnectRequest(
              "server is unreachable check your internet"
            )
          );
          return;
        }
        dispatch(updateMessageConnectRequest(err?.response?.data));
      })
      .finally(() => {
        // set is fetching to false
        setIsDeleting(false);
        //set showing delete alert false

        setShowDeleteAlert(false);
      });
  };

  // handle close aler delete
  const handleClose = () => {
    // close alert
    setShowDeleteAlert(false);
    // clear postID
    setDeletePostID();
  };

  return (
    <React.Fragment>
      {/* display delete confirmation when user owning post inquires deletion */}
      <Box display={"flex"} justifyContent={"center"} p={1} mb={1}>
        {showDeleteALert && (
          <Collapse in={showDeleteALert || false}>
            <Alert
              severity="warning"
              className="rounded-5"
              action={
                <Stack direction={"row"} alignItems={"center"} gap={1}>
                  {/* yes btn */}
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    disabled={isDeleting}
                    size="small"
                    onClick={handleCompletePostDelete}
                  >
                    <Typography
                      variant="body2"
                      color={"error"}
                      fontWeight={"bold"}
                    >
                      Yes
                    </Typography>
                  </IconButton>
                  |{/* no btn */}
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    disabled={isDeleting}
                    onClick={handleClose}
                  >
                    <Typography
                      variant="body2"
                      color={"inherit"}
                      fontWeight={"bold"}
                    >
                      No
                    </Typography>
                  </IconButton>
                </Stack>
              }
            >
              <Box mb={1}>Delete ?</Box>
              {/* show progress when is deleting */}
              {isDeleting && <LinearProgress color="inherit" />}
            </Alert>
          </Collapse>
        )}
      </Box>

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
        { postsData?.map((post) => (
            <Box key={post?.id}>
              <UserPostCard
                post={post}
                setPostDetailedData={setPostDetailedData}
                setDeletePostID={setDeletePostID}
                setShowDeleteAlert={setShowDeleteAlert}
                deletePostID={deletePostID}
                setIsPostEditMode={setIsPostEditMode}
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

      {/* show snack bar of any response of deletion, using snack connect */}
      {messageConnectRequestSent && (
        <SnackbarConnect message={messageConnectRequestSent} />
      )}
    </React.Fragment>
  );
}

export default UserPostContainer;
