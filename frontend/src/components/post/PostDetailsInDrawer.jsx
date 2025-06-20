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
  handleShowingPostDetailedModal,
  handleShowingSpeedDial,
  handleUpdateIsPostDetailed,
  showUserProfileDrawer
} from "../../redux/AppUI";
import { resetClearCurrentPostReactions } from "../../redux/CurrentPostReactions";
import CustomCountryName from "../utilities/CustomCountryName";
import PostDetailsFeed from "./PostDetailsFeed";

const MAX_TEXT_LENGTH=100

const CommentContainer = lazy(() => import("./CommentContainer"));
function PostDetailsInDrawer({
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

  // axios default credentials
  axios.defaults.withCredentials = true;
  // redux states
  const { user } = useSelector((state) => state.currentUser);

  const dispatch = useDispatch();
  // extract basic current user details
  const { _id, avatar, name, county, specialisationTitle: title } = user || {};

  // complete sending of the comment to the backend
  const handleSendCommentNow = () => {
    // current user info
    const reactingUserInfo = {
      userId: _id,
      ownerId: postDetailedData?.post_owner?.ownerId,
      postId: postDetailedData?._id,
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
    // performing post request
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

    // update the redux ui state for post detailed modal true
    dispatch(handleShowingPostDetailedModal(true))
    
    // update the Id of the post detailed data, is same edit modal
    // since is the same post being focused on
    dispatch(handleSetPostEditIdModal(postDetailedData?._id))

    // close drawer profile
    dispatch(showUserProfileDrawer())

  }

  return (
    <Stack 
    gap={1} 
    >
      
    <Box display={"flex"} justifyContent={"flex-end"} alignItems={'center'}>
      <Tooltip arrow title={"wide"}>
        {/* full screen toggle, close drawer show modal */}
        <IconButton onClick={handleShowPostDetailedNoDrawer}>
        <FullscreenOutlined sx={{ width: 15, height: 15 }} color="primary" />
        </IconButton>
    </Tooltip>

    {/* close button */}
    <IconButton onClick={handleClearPostDetailedData}>
        <Close sx={{ width: 15, height: 15 }} color="primary" />
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
    <Box p={isDrawerFocused ? 0 : 2}>
    {/* render post details feed here */}
    <PostDetailsFeed
        postDetailedData={postDetailedData}
        setPostDetailedData={setPostDetailedData}
    />

    {/* all user comments container pass the comments of the post */}
    <Box>
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
        mb={5}
        bgcolor={"background.default"}
        className={'rounded'}
        sx={{ border:'1px solid', borderColor:'divider' }}
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
    </Stack>
  );
}

export default PostDetailsInDrawer;
