import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  InputBase,
  Stack,
  Tooltip,
} from "@mui/material";

import { Close, FullscreenOutlined, SendOutlined } from "@mui/icons-material";

import axios from "axios";
import React, { lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleSetPostEditIdModal,
  handleShowingSpeedDial,
  handleShowPostEditModal,
  handleUpdateIsPostDetailed,
  showUserProfileDrawer,
} from "../../redux/AppUI";
import CustomCountryName from "../utilities/CustomCountryName";
import PostDetailsFeed from "./PostDetailsFeed";

const MAX_TEXT_LENGTH=100

const CommentContainer = lazy(() => import("./CommentContainer"));
function PostDetailsContainer({
  postDetailedData,
  setPostDetailedData,
  isDrawerFocused = false,
  isPostEditMode = false,
  setIsPostEditMode,
}) {

  // hold temporarily the post param, could mutate its values
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [comment, setComment] = useState("");
  
  // redux states
  const { user } = useSelector((state) => state.currentUser);

  const dispatch = useDispatch();
  // extract basic current user details
  const { _id, avatar, name,county, specialisationTitle: title } = user || {};


  // complete sending of the comment to the backend
  const handleSendCommentNow = () => {
     // current user info
      const reactingUserInfo = {
        userId: _id,
        ownerId: postDetailedData.post_owner.ownerId,
        postId: postDetailedData._id,
        avatar,
        name,
        country:CustomCountryName(user?.country),
        county,
        title,
      };
      
    // sending the post tile embed in message and will split for separation backend
    let message = `commented on your post.${postDetailedData?.post_title?.substring(
      0,
      25
    )}`;
    // add the above properties to the userInfo that is being sent to the backend
    reactingUserInfo.message = message;
    reactingUserInfo.minimessage = comment;
    // add users to the liked clickers group and increment the value of clicks
    setIsUploading(true);
    // performing put request
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/update/comments`,
        reactingUserInfo,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        
        // update passedPost with the returned post object
        setPostDetailedData(res.data);

        // come up with redux update strategy in the navbar for
        // fetching latest notifications
        
      })
      .catch(async (err) => {
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("Server Unreachable");
          return;
        }

        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        setIsUploading(false);
        // set comment to empty
        setComment("");
      });
  };

  // handle clearing of the post data so that the userprofile defaults also restore the speed dial
  const handleClearPostDetailedData = () => {
    // set is post editing mode false if its true only
    if (isPostEditMode) {
      setIsPostEditMode(false);
    }

    // set post detailed data to empty or null
    setPostDetailedData();

    // restore the speed dial for editing mode
    dispatch(handleShowingSpeedDial(true));

    // restore speed dial in focus mode
    dispatch(handleUpdateIsPostDetailed(false));
  };

  // handle showing of the post details outside drawer panel.
  const handleShowPostDetailedNoDrawer=()=>{

    // update the redux ui state for post edit mode true
    dispatch(handleShowPostEditModal(true))
    
    // update the Id of the post detailed data
    dispatch(handleSetPostEditIdModal(postDetailedData?._id))

    // close drawer profile
    dispatch(showUserProfileDrawer())

  }

  return (
  
    <Stack 
    gap={1} 
    maxHeight={'80vh'}
    sx={{
      overflow: "auto",
      // Hide scrollbar for Chrome, Safari and Opera
      "&::-webkit-scrollbar": {
        display: "none",
      },
      // Hide scrollbar for IE, Edge and Firefox
      msOverflowStyle: "none",
      scrollbarWidth: "none",
    }}
    >
      {isPostEditMode ? (
        <React.Fragment>
          <Box 
          display={"flex"} 
          justifyContent={"flex-end"} 
          alignItems={'center'} 
          p={1}>
            {/* full screen */}
          {isDrawerFocused && (
             <Tooltip arrow title={"wide"}>
             <IconButton 
             onClick={handleShowPostDetailedNoDrawer}>
               <FullscreenOutlined 
               sx={{ width: 15, height: 15 }} 
               color="primary" />
             </IconButton>
           </Tooltip>
          )}

            {/* close  the post */}
            <Tooltip arrow title={"close"}>
              <IconButton 
              sx={{ 
              border:'1px solid',
              borderColor:'divider'
             }}
              onClick={handleClearPostDetailedData}>
                <Close 
                sx={{ width: 10, height: 10 }}
                 color="primary" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* display error */}
          {errorMessage && (
            <Box p={1} display={"flex"} justifyContent={"center"}>
              <Collapse in={errorMessage || false}>
                <Alert
                  severity="info"
                  className="rounded"
                  onClick={() => setErrorMessage("")}
                  action={
                    <IconButton aria-label="close" color="inherit" size="small">
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {errorMessage}
                </Alert>
              </Collapse>
            </Box>
          )}

          {/* card container */}
          <Box p={isDrawerFocused ? 0 : 1}>
            {/* render post details feed here */}
            <PostDetailsFeed
              postDetailedData={postDetailedData}
              setPostDetailedData={setPostDetailedData}
              isPostEditMode={isPostEditMode}
            />
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box display={"flex"} justifyContent={"flex-end"} alignItems={'center'}>
           
          {/* close button */}
            <IconButton 
            sx={{ 
              border:'1px solid',
              borderColor:'divider'
             }}
            onClick={handleClearPostDetailedData}>
              <Close 
              sx={{ width: 10, height: 10 }} 
              color="primary" />
            </IconButton>
          </Box>

          {/* display error */}
          {errorMessage && (
            <Box p={1} display={"flex"} justifyContent={"center"}>
              <Collapse in={errorMessage || false}>
                <Alert
                  severity="info"
                  className="rounded"
                  onClick={() => setErrorMessage("")}
                  action={
                    <IconButton aria-label="close" color="inherit" size="small">
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {errorMessage}
                </Alert>
              </Collapse>
            </Box>
          )}

          {/* card container */}
          <Box >
            {/* render post details feed here */}
            <PostDetailsFeed
              postDetailedData={postDetailedData}
              setPostDetailedData={setPostDetailedData}
            />

            {/* all user comments container pass the comments of the post */}
            <Box mt={1}>
              <CommentContainer
                post_comments={postDetailedData?.post_comments?.comments}
                postId={postDetailedData?._id}
                setPostDetailedData={setPostDetailedData}
              />
            </Box>
          </Box>

          {/* comment input text  */}
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
            p={1}
            mb={2}
            bgcolor={"background.default"}
            className={'rounded'}
          >
            {/* input for comment */}
            <Box width={"100%"} mx={1}>
              <InputBase
                multiline
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxRows={2}
                disabled={isUploading}
                className="w-100"
                placeholder="write new comment ..."
                sx={{
                  fontSize: "small",
                }}
              />
            </Box>

            {/* send comment button icon */}
            <Box className=" rounded ms-1 pe-1" alignContent={"center"}>
              {isUploading ? (
                <CircularProgress size={17} />
              ) : (
                <Badge badgeContent={`${MAX_TEXT_LENGTH - comment.length}`}>
                  <IconButton
                    disabled={comment.length > MAX_TEXT_LENGTH || comment.length<1}
                    onClick={handleSendCommentNow}
                  >
                    <SendOutlined
                      color={comment.length <= MAX_TEXT_LENGTH ? "primary" : "inherit"}
                      sx={{ width: 18, height: 18 }}
                    />
                  </IconButton>
                </Badge>
              )}
            </Box>
          </Box>
        </React.Fragment>
      )}
    </Stack>
  );
}

export default PostDetailsContainer;
