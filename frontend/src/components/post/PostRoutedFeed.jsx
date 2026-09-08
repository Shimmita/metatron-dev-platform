import {
  Alert,
  Badge,
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";

import { ArrowBackRounded, Close, SendOutlined } from "@mui/icons-material";

import axios from "axios";
import React, { lazy, useState } from "react";
import { useSelector } from "react-redux";
import CustomCountryName from "../utilities/CustomCountryName";
import PostDetailsFeed from "./PostDetailsFeed";
import { useNavigate } from "react-router-dom";

const CommentContainer = lazy(() => import("./CommentContainer"));

function PostRoutedFeed({ postDetailedData, setPostDetailedData }) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [comment, setComment] = useState("");
  const navigate=useNavigate()
  // axios default credentials
  axios.defaults.withCredentials = true;
  
  // redux states
  const { user,isGuest } = useSelector((state) => state.currentUser);
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

  const handleBackToFeed=()=>{
      navigate('/explore')
    }


  return (
    <Stack gap={1.25}>

      {/* display error */}
      {errorMessage && (
        <Box p={1} display={"flex"} justifyContent={"center"} gap={2}>
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
              sx={{ mb: 2 }}
            >
              {errorMessage}
            </Alert>
          </Collapse>
        </Box>
      )}

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        sx={{
          p: 1,
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.10)",
          background: "linear-gradient(135deg, rgba(13,13,13,0.94), rgba(214,178,94,0.08))",
        }}
      >
        <Box minWidth={0}>
          <Typography variant="body2" fontWeight={900}>
            Focused Post
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            Opened from notifications
          </Typography>
        </Box>
          <Button
          onClick={handleBackToFeed}
          startIcon={<ArrowBackRounded />} 
          size="small"
          variant="contained"
          sx={{ borderRadius: "8px", flexShrink: 0 }}
        >
            Back to feed
          </Button>
      </Box>

      {/* card container */}
      <Box p={0}>
        {/* render post details feed here */}
        <PostDetailsFeed
          postDetailedData={postDetailedData}
          setPostDetailedData={setPostDetailedData}
        />

        {!isGuest && (
          <React.Fragment>

        {/* all user comments container pass the comments of the post */}
        <Box mt={1}>
          <CommentContainer
            post_comments={postDetailedData?.post_comments.comments}
          />
        </Box>

        {/* comment input text  */}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
        p={2}
        mt={1}
        sx={{
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.055)",
        }}
      >
        {/* input for comment */}
        <Box className='rounded' width={"100%"}>
          <InputBase
            multiline
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxRows={2}
            disabled={isUploading}
            className="w-100 rounded"
            placeholder="Add a clear, useful comment..."
            sx={{
              fontSize: "small",
            }}
          />
        </Box>

        {/* send comment button icon */}
        <Box className=" t rounded ms-1" alignContent={"center"}>
          {isUploading ? (
            <CircularProgress size={17} />
          ) : (
            <Badge badgeContent={`${100 - comment.length}`}>
              <IconButton
                disabled={comment.length > 100}
                onClick={handleSendCommentNow}
              >
                <SendOutlined
                  color={comment.length <= 100 ? "primary" : "inherit"}
                  sx={{ width: 18, height: 18 }}
                />
              </IconButton>
            </Badge>
          )}
        </Box>
      </Box>
          </React.Fragment>
        )}

      </Box>

    </Stack>
  );
}

export default PostRoutedFeed;
