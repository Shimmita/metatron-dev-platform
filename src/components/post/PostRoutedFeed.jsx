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
  Tooltip,
  Typography,
} from "@mui/material";

import { ArrowBackRounded, Close, ForumRounded, SendOutlined } from "@mui/icons-material";

import axios from "axios";
import React, { lazy, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CustomCountryName from "../utilities/CustomCountryName";
import PostDetailsFeed from "./PostDetailsFeed";
import { useNavigate } from "react-router-dom";

const CommentContainer = lazy(() => import("./CommentContainer"));
const MAX_TEXT_LENGTH = 100;

function PostRoutedFeed({ postDetailedData, setPostDetailedData }) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [comment, setComment] = useState("");
  const commentComposerRef = useRef(null);
  const commentInputRef = useRef(null);
  const navigate=useNavigate()
  // axios default credentials
  axios.defaults.withCredentials = true;
  
  // redux states
  const { user,isGuest } = useSelector((state) => state.currentUser);
  // extract basic current user details
  const { _id, avatar, name,county, specialisationTitle: title } = user || {};


  // complete sending of the comment to the backend
  const handleSendCommentNow = () => {
    if (comment.trim().length < 1 || comment.length > MAX_TEXT_LENGTH) return;
    
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
    reactingUserInfo.minimessage = comment.trim();
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

  const handleFocusCommentComposer = () => {
    commentComposerRef.current?.scrollIntoView?.({
      behavior: "smooth",
      block: "nearest",
    });
    window.setTimeout(() => {
      commentInputRef.current?.focus?.();
    }, 120);
  };


  return (
    <Stack
      gap={1.25}
      sx={{
        height: { xs: "auto", lg: "100%" },
        minHeight: 0,
        overflow: { xs: "visible", lg: "hidden" },
      }}
    >

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
        <Box display="flex" alignItems="center" gap={1} minWidth={0}>
          <ForumRounded sx={{ color: "primary.main", fontSize: 18 }} />
          <Box minWidth={0}>
            <Typography variant="body2" fontWeight={900}>
              Focused Post
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {postDetailedData?.post_comments?.count || 0} comments in discussion
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Back to feed" arrow>
          <Button
          onClick={handleBackToFeed}
          startIcon={<ArrowBackRounded />} 
          size="small"
          variant="contained"
          sx={{ borderRadius: "8px", flexShrink: 0, fontWeight: 900 }}
        >
            Back to feed
          </Button>
        </Tooltip>
      </Box>

      {/* card container */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1fr) minmax(340px, 0.9fr)",
          },
          gap: { xs: 1.25, lg: 1.25 },
          alignItems: "stretch",
          overflowY: { xs: "auto", lg: "hidden" },
          overflowX: "hidden",
          overscrollBehavior: "contain",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(148,163,184,0.28)",
            borderRadius: 999,
          },
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(148,163,184,0.28) transparent",
        }}
      >
        <Box
          sx={{
            minHeight: 0,
            overflowY: { xs: "visible", lg: "auto" },
            overscrollBehavior: "contain",
            pr: { lg: 0.5 },
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(148,163,184,0.28)",
              borderRadius: 999,
            },
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(148,163,184,0.28) transparent",
          }}
        >
          <PostDetailsFeed
            postDetailedData={postDetailedData}
            setPostDetailedData={setPostDetailedData}
            showFullContent
            isFocusedLayout
            onCommentClick={handleFocusCommentComposer}
          />
        </Box>

        <Box
          sx={{
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            overflow: { xs: "visible", lg: "hidden" },
          }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: { xs: "visible", lg: "auto" },
              overscrollBehavior: "contain",
              pr: { lg: 0.5 },
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(148,163,184,0.28)",
                borderRadius: 999,
              },
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(148,163,184,0.28) transparent",
            }}
          >
            <CommentContainer
              post_comments={postDetailedData?.post_comments?.comments}
              postId={postDetailedData?._id}
              setPostDetailedData={setPostDetailedData}
            />
          </Box>

          {!isGuest && (
            <Box
              ref={commentComposerRef}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              width={"100%"}
              p={1}
              sx={{
                zIndex: 2,
                flexShrink: 0,
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.10)",
                background: "linear-gradient(135deg, rgba(13,13,13,0.96), rgba(214,178,94,0.08))",
                backdropFilter: "blur(18px)",
                boxShadow: "none",
              }}
            >
              <Box className='rounded' width={"100%"} mx={1}>
                <InputBase
                  inputRef={commentInputRef}
                  multiline
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxRows={2}
                  disabled={isUploading}
                  className="w-100 rounded"
                  placeholder="Add a clear, useful comment..."
                  sx={{
                    fontSize: "small",
                    color: "text.primary",
                  }}
                />
              </Box>

              <Box className=" t rounded ms-1" alignContent={"center"}>
                {isUploading ? (
                  <CircularProgress size={17} />
                ) : (
                  <Badge badgeContent={`${MAX_TEXT_LENGTH - comment.length}`}>
                    <IconButton
                      disabled={comment.length > MAX_TEXT_LENGTH || comment.trim().length < 1}
                      onClick={handleSendCommentNow}
                    >
                      <SendOutlined
                        color={comment.length <= MAX_TEXT_LENGTH && comment.trim().length > 0 ? "primary" : "inherit"}
                        sx={{ width: 18, height: 18 }}
                      />
                    </IconButton>
                  </Badge>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

    </Stack>
  );
}

export default PostRoutedFeed;
