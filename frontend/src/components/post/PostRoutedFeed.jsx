import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  InputBase,
  Stack,
} from "@mui/material";

import { Close, SendOutlined } from "@mui/icons-material";

import axios from "axios";
import React, { lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleShowingSpeedDial } from "../../redux/AppUI";
import CustomCountryName from "../utilities/CustomCountryName";
import PostDetailsFeed from "./PostDetailsFeed";

const CommentContainer = lazy(() => import("./CommentContainer"));
function PostRoutedFeed({ postDetailedData, setPostDetailedData }) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [comment, setComment] = useState("");

  // axios default credentials
  axios.defaults.withCredentials = true;
  // redux states
  const { user } = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  // extract basic current user details
  const { _id, avatar, name, specialisationTitle: title } = user || {};

  const country = CustomCountryName(postDetailedData?.post_location?.country);

  // current user info
  const reactingUserInfo = {
    userId: _id,
    ownerId: postDetailedData.post_owner.ownerId,
    postId: postDetailedData._id,
    avatar,
    name,
    country,
    title,
  };
  // complete sendin of the comment to the backend
  const handleSendCommentNow = () => {
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
        `http://localhost:5000/metatron/api/v1/posts/update/comments`,
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

  // handle clearing of the post data so that the userprofile defaults also restore the speed dial
  const handleClearPostDetailedData = () => {
    setPostDetailedData();
    // restore the speed dial
    dispatch(handleShowingSpeedDial(true));
    // navigate home and show the drawer again where the user was
    navigate("/");
  };

  return (
    <Stack gap={1}>
      {/* close button */}
      <Box display={"flex"} justifyContent={"flex-end"}>
        <IconButton onClick={handleClearPostDetailedData}>
          <Close sx={{ width: 15, height: 15 }} color="primary" />
        </IconButton>
      </Box>

      {/* display error */}
      {errorMessage && (
        <Box p={1} display={"flex"} justifyContent={"center"} gap={2}>
          <Collapse in={errorMessage || false}>
            <Alert
              severity="warning"
              className="rounded-5"
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

      {/* card container */}
      <Box p={2}>
        {/* render post details feed here */}
        <PostDetailsFeed
          postDetailedData={postDetailedData}
          setPostDetailedData={setPostDetailedData}
        />

        {/* all user comments container pass the comments of the post */}
        <Box>
          <CommentContainer
            post_comments={postDetailedData?.post_comments.comments}
          />
        </Box>
      </Box>

      {/* comment input text  */}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
        p={2}
        bgcolor={"background.default"}
      >
        {/* input for comment */}
        <Box width={"100%"}>
          <InputBase
            multiline
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxRows={2}
            disabled={isUploading}
            className="w-100"
            placeholder="comment here..."
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
    </Stack>
  );
}

export default PostRoutedFeed;
