import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetClearCurrentPosts } from "../../../redux/CurrentPosts";
import { updateMessageConnectRequest } from "../../../redux/CurrentSnackBar";
import SnackbarConnect from "../../snackbar/SnackbarConnect";
import "../UserPost.css";
import UserPostCardDrawer from "./UserPostCardDrawer";

function UserPostFavoriteContainer({
  userId,
  setPostDetailedData,
  setIsPostEditMode,
  setIsPostDetailedDrawer,
}) {
  const [isFetching, setIsFetching] = useState(true);
  const [postsData, setPostsData] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deletePostID, setDeletePostID] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  // controls pagination
  const [pageNumber,setPageNumber]=useState(1)
  const [hasMorePosts,setHasMorePosts]=useState(true)


  // redux states
  const { user } = useSelector((state) => state.currentUser);

  const { messageConnectRequestSent } = useSelector(
    (state) => state.currentSnackBar
  );
  // dispatch for redux to emit actions and store update
  const dispatch = useDispatch();

  // use Effect for favorites
  useEffect(()=>{
  
    // track progress
    setIsFetching(true)
      // user requests favorite posts
      axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/favorite/all/${userId}?page=${pageNumber}&limit=10`, {
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
          setErrorMessage("Network Error");
          return;
        }
        // update the snackbar notification of error from the server
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
    
  },[userId])

  // handle close alert delete
  const handleClose = () => {
    // close alert
    setShowDeleteAlert(false);

    // clear postID
    setDeletePostID();
  };

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

          // update redux snack notification message
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
              "server unreachable"
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


  // handle fetching of all favorite posts
    const handleFetchFavorites=()=>{
      // track progress
       setIsFetching(true)
       // user requests favorite posts
        axios
        .get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/favorite/all/${user?._id }?page=${pageNumber}&limit=10`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res?.data) {
            const data=res.data
            if (data.length>0) {
              const filteredData=data?.filter((post)=>{
                for (const postData of postsData) {
                  return postData?._id!==post._id
                }
              })
              setPostsData([...postsData,...filteredData]);   
            }else{
              setHasMorePosts(false)
            }
          }

        // update the page number for the next fetch
        setPageNumber((prev)=>prev+1)
        })
        .catch((err) => {
          // there is an error
          if (err?.code === "ERR_NETWORK") {
            // update the snackbar notification of the error of connection
            setErrorMessage("Network Error");
            return;
          }
          // update the snackbar notification of error from the server
          setErrorMessage(err?.response.data);
        })
        .finally(() => {
          // set is fetching to false
          setIsFetching(false);
        });
    }


  return (
    <React.Fragment>
      {/* display delete confirmation when user owning post inquires deletion */}
      <Box 
      display={"flex"}
      justifyContent={"center"}
      m={1}>
        {showDeleteAlert && (
          <Collapse in={showDeleteAlert || false}>
            <Alert
              severity="info"
              className="rounded"
              action={
                <Stack direction={"row"} alignItems={"center"} gap={1}>
                  {/* yes btn */}
                  <IconButton
                    aria-label="close"
                    color="warning"
                    disabled={isDeleting}
                    size="small"
                    onClick={handleCompletePostDelete}
                  >
                   {isDeleting ? <CircularProgress size={15}/>: <Typography
                      variant="body2"
                      fontWeight={"bold"}
                    >
                      Yes
                    </Typography>}
                  </IconButton>
                  |{/* no btn */}
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    disabled={isDeleting}
                    onClick={handleClose}
                  >
                    {isDeleting ? <CircularProgress size={15}/>:<Typography
                      variant="body2"
                      color={"inherit"}
                      fontWeight={"bold"}
                    >
                      No
                    </Typography>}
                  </IconButton>
                </Stack>
              }
            >
              <Box mb={1}>{isDeleting ? "deleting...":"delete post ?"}</Box>
            </Alert>
          </Collapse>
        )}
      </Box>
      <Box className="post-card-container">
        {/* displayed when there is an error of request */}
        {errorMessage && (
          <Box width={"100%"}>
            <Typography
              mt={"8rem"}
              textAlign={"center"}
              fontWeight={"bold"}
              color={"text.secondary"}
              variant="body2"
            >
              {errorMessage}
            </Typography>
          </Box>
        )}

        {/* displayed when fetching process is ongoing */}
        {isFetching && (
          <Box width={"100%"}>
            <Box 
            mt={8} 
            display={"flex"} 
            justifyContent={"center"}
            alignItems={'center'}
            gap={2}
            >
              {/* progressbar */}
              <CircularProgress size={15} />
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
        {postsData?.map((post,index) => (
            <Box key={post?._id}>
              <UserPostCardDrawer
                post={post}
                setPostDetailedData={setPostDetailedData}
                setDeletePostID={setDeletePostID}
                setShowDeleteAlert={setShowDeleteAlert}
                setIsPostEditMode={setIsPostEditMode}
                setIsPostDetailedDrawer={setIsPostDetailedDrawer}
                isFavorite={true}
                setIsDeleting={setIsDeleting}
                handleFetchFavorites={handleFetchFavorites}
                hasMorePosts={hasMorePosts}
                isFetching={isFetching}
                isLastIndex={index===postsData?.length-1}

              
              />
            </Box>
          ))}

  
      </Box>

      {/* show snack bar of any response of deletion, using snack connect */}
      {messageConnectRequestSent && (
        <SnackbarConnect message={messageConnectRequestSent} />
      )}
    </React.Fragment>
  );
}

export default UserPostFavoriteContainer;
