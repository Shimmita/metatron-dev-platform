import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  Typography,
  Button
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { resetClearCurrentPosts } from "../../../redux/CurrentPosts";
import { updateMessageConnectRequest } from "../../../redux/CurrentSnackBar";

import SnackbarConnect from "../../snackbar/SnackbarConnect";
import UserPostCardDrawer from "./UserPostCardDrawer";

function UserPostContainDrawer({
  userId,
  setPostDetailedData,
  setIsPostEditMode,
  setIsPostDetailedDrawer,
}) {
  const [isFetching, setIsFetching] = useState(true);
  const [postsData, setPostsData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deletePostID, setDeletePostID] = useState();
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useSelector((state) => state.currentUser);
  const { messageConnectRequestSent } = useSelector(
    (state) => state.currentSnackBar
  );

  const dispatch = useDispatch();

  useEffect(() => {
    setIsFetching(true);

    axios
      .get(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/users/all/${userId}`,
        { withCredentials: true }
      )
      .then((res) => setPostsData(res.data || []))
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("Network error. Check connection.");
        } else {
          setErrorMessage(err?.response?.data || "Something went wrong");
        }
      })
      .finally(() => setIsFetching(false));
  }, [userId]);

  const handleClose = () => {
    setShowDeleteAlert(false);
    setDeletePostID(null);
  };

  const handleCompletePostDelete = () => {
    setIsDeleting(true);

    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/delete/${user?._id}/${deletePostID}`,
        { withCredentials: true }
      )
      .then((res) => {
        dispatch(updateMessageConnectRequest(res.data));

        // remove deleted post instantly (better UX)
        setPostsData((prev) =>
          prev.filter((p) => p._id !== deletePostID)
        );

        dispatch(resetClearCurrentPosts());
      })
      .catch((err) => {
        dispatch(
          updateMessageConnectRequest(
            err?.response?.data || "Server unreachable"
          )
        );
      })
      .finally(() => {
        setIsDeleting(false);
        handleClose();
      });
  };

  return (
    <>
      {/* 🔥 DELETE CONFIRMATION */}
      <Box display="flex" justifyContent="center" mt={1}>
        <Collapse in={showDeleteAlert}>
          <Alert
            severity="warning"
            sx={{
              borderRadius: 2,
              alignItems: "center",
            }}
            action={
              <Stack direction="row" gap={1}>
                <Button
                  size="small"
                  color="error"
                  disabled={isDeleting}
                  onClick={handleCompletePostDelete}
                >
                  {isDeleting ? <CircularProgress size={14} /> : "Delete"}
                </Button>

                <Button
                  size="small"
                  disabled={isDeleting}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </Stack>
            }
          >
            {isDeleting ? "Deleting post..." : "Delete this post?"}
          </Alert>
        </Collapse>
      </Box>

      {/* 🔥 MAIN CONTAINER */}
      <Box
        display="flex"
        flexDirection="column"
        gap={1}
        p={1}
      >
        {/* 🔥 ERROR */}
        {errorMessage && (
          <Box textAlign="center" mt={6}>
            <Typography color="text.secondary">
              {errorMessage}
            </Typography>
          </Box>
        )}

        {/* 🔥 LOADING */}
        {isFetching && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt={6}
            gap={1}
          >
            <CircularProgress />
            <Typography variant="caption" color="text.secondary">
              Loading posts...
            </Typography>
          </Box>
        )}

        {/* 🔥 EMPTY STATE */}
        {!isFetching && postsData.length === 0 && !errorMessage && (
          <Box textAlign="center" mt={6}>
            <Typography color="text.secondary">
              No posts available
            </Typography>
          </Box>
        )}

        {/* 🔥 POSTS */}
        {postsData.map((post) => (
          <UserPostCardDrawer
            key={post._id}
            post={post}
            setPostDetailedData={setPostDetailedData}
            setDeletePostID={setDeletePostID}
            setShowDeleteAlert={setShowDeleteAlert}
            setIsPostEditMode={setIsPostEditMode}
            setIsPostDetailedDrawer={setIsPostDetailedDrawer}
          />
        ))}
      </Box>

      {/* 🔥 SNACKBAR */}
      {messageConnectRequestSent && (
        <SnackbarConnect message={messageConnectRequestSent} />
      )}
    </>
  );
}

export default UserPostContainDrawer;