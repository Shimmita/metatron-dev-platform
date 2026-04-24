import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  Button,
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
import UserPostCard from "./UserPostCard";

function UserPostContainer({ userId, setPostDetailedData, setIsPostEditMode }) {
  const [isFetching, setIsFetching] = useState(true);
  const [postsData, setPostsData] = useState([]);
  const [erroMessage, setErrorMesssage] = useState("");

  const [showDeleteALert, setShowDeleteAlert] = useState(false);
  const [deletePostID, setDeletePostID] = useState();
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useSelector((state) => state.currentUser);
  const { messageConnectRequestSent } = useSelector((state) => state.currentSnackBar);
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    setIsFetching(true);
    
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/users/all/${userId}`)
      .then((res) => {
        if (res?.data && isMounted) setPostsData(res.data);
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMesssage(err?.code === "ERR_NETWORK" ? "Metatron Link Failure" : "Access Denied");
      })
      .finally(() => {
        if (isMounted) setIsFetching(false);
      });

    return () => { isMounted = false; };
  }, [userId]);

  const handleCompletePostDelete = () => {
    setIsDeleting(true);
    axios
      .delete(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/delete/${user?._id}/${deletePostID}`)
      .then((res) => {
        if (res?.data) {
          // Filter local state for immediate UI feedback
          setPostsData((prev) => prev.filter(p => p._id !== deletePostID));
          dispatch(updateMessageConnectRequest(res.data));
          dispatch(resetClearCurrentPosts());
        }
      })
      .catch((err) => {
        const msg = err?.code === "ERR_NETWORK" ? "Server unreachable" : "Delete failed";
        dispatch(updateMessageConnectRequest(msg));
      })
      .finally(() => {
        setIsDeleting(false);
        setShowDeleteAlert(false);
        setDeletePostID(null);
      });
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {/* ─── Deletion Confirmation Overlay ─── */}
      <Box display={"flex"} justifyContent={"center"} sx={{ width: "100%", mb: 2 }}>
        <Collapse in={showDeleteALert} sx={{ width: "100%", maxWidth: "500px" }}>
          <Alert
            severity="warning"
            sx={{
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid",
              borderColor: "warning.main",
              backdropFilter: "blur(10px)",
              color: "text.primary",
              borderRadius: "12px",
            }}
            action={
              <Stack direction="row" spacing={1}>
                <Button 
                  size="small" 
                  color="error" 
                  variant="contained"
                  disabled={isDeleting}
                  onClick={handleCompletePostDelete}
                  sx={{ fontWeight: 700, borderRadius: '8px' }}
                >
                  Confirm
                </Button>
                <Button 
                  size="small" 
                  color="inherit" 
                  disabled={isDeleting}
                  onClick={() => setShowDeleteAlert(false)}
                >
                  Abort
                </Button>
              </Stack>
            }
          >
            <Typography variant="body2" fontWeight={600}>
              {isDeleting ? "WIPING DATA..." : "PERMANENTLY DELETE POST?"}
            </Typography>
            {isDeleting && <LinearProgress color="warning" sx={{ mt: 1, height: 2, borderRadius: 1 }} />}
          </Alert>
        </Collapse>
      </Box>

      {/* ─── Main Content Grid ─── */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 2,
          px: 1 
        }}
      >
        {isFetching ? (
          <Box gridColumn="1 / -1" py={10} textAlign="center">
            <CircularProgress size={30} sx={{ color: "primary.main" }} />
            <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", letterSpacing: 2 }}>
              INITIALIZING SECTOR...
            </Typography>
          </Box>
        ) : erroMessage ? (
          <Box gridColumn="1 / -1" py={10} textAlign="center">
            <Typography color="error" variant="body2" fontWeight={700}>
              {erroMessage.toUpperCase()}
            </Typography>
          </Box>
        ) : (
          postsData?.map((post) => (
            <UserPostCard
              key={post?._id}
              post={post}
              setPostDetailedData={setPostDetailedData}
              setDeletePostID={setDeletePostID}
              setShowDeleteAlert={setShowDeleteAlert}
              deletePostID={deletePostID}
              setIsPostEditMode={setIsPostEditMode}
            />
          ))
        )}
      </Box>

      {/* ─── Footer Notifications ─── */}
      {messageConnectRequestSent && (
        <SnackbarConnect message={messageConnectRequestSent} />
      )}
    </Box>
  );
}

export default UserPostContainer;