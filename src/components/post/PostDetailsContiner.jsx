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
  Typography
} from "@mui/material";

import {
  ArrowBackRounded,
  ArticleRounded,
  Close,
  ForumRounded,
  FullscreenOutlined,
  SendOutlined,
} from "@mui/icons-material";

import axios from "axios";
import React, { lazy, useRef, useState } from "react";
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

const MAX_TEXT_LENGTH = 100

const CommentContainer = lazy(() => import("./CommentContainer"));
function PostDetailsContainer({
  postDetailedData,
  setPostDetailedData,
  isDrawerFocused = false,
  isPostEditMode = false,
  setIsPostEditMode,
  isFullPageFocused = false,
}) {

  // hold temporarily the post param, could mutate its values
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [comment, setComment] = useState("");
  const commentComposerRef = useRef(null);
  const commentInputRef = useRef(null);
  
  // redux states
  const { user } = useSelector((state) => state.currentUser);

  const dispatch = useDispatch();
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

        setErrorMessage(err?.response?.data || "Unable to send comment.");
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
        height: isDrawerFocused
          ? "100%"
          : isFullPageFocused
            ? { xs: "auto", lg: "calc(100dvh - 24px)" }
            : "auto",
        maxHeight: isDrawerFocused
          ? "100%"
          : isFullPageFocused
            ? { xs: "none", lg: "calc(100dvh - 24px)" }
            : "calc(100dvh - 118px)",
        minHeight: 0,
        overflow: "hidden",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.10)",
        background: "linear-gradient(180deg, rgba(13,13,13,0.98), rgba(5,5,5,0.96))",
        p: { xs: 1, sm: 1.25 },
        pb: { xs: 1, lg: 1.25 },
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {isPostEditMode ? (
        <React.Fragment>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={'center'}
            gap={2}
            p={1}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <ArticleRounded sx={{ color: "primary.main", fontSize: 18 }} />
              <Box minWidth={0}>
                <Typography fontWeight={900} fontSize={14}>
                  Post Editor
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {postDetailedData?.post_title || "Focused post"}
                </Typography>
              </Box>
            </Box>
            {/* full screen */}
          {isDrawerFocused && (
              <Tooltip arrow title={"wide"}>
              <IconButton 
              onClick={handleShowPostDetailedNoDrawer}>
                <FullscreenOutlined 
                sx={{ width: 18, height: 18 }} 
                color="primary" />
              </IconButton>
            </Tooltip>
          )}

            {/* close  the post */}
            <Tooltip arrow title={"close"}>
              <IconButton 
          
              onClick={handleClearPostDetailedData}>
                <Close 
                sx={{ width: 15, height: 15 }}
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
          <Box
            p={isDrawerFocused ? 0 : 1}
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overscrollBehavior: "contain",
              pr: { xs: 0, sm: 0.5 },
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(148,163,184,0.28)",
                borderRadius: 999,
              },
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(148,163,184,0.28) transparent",
            }}
          >
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
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={'center'}
            sx={{
              px: 1,
              py: 1,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              background: "linear-gradient(135deg, rgba(214,178,94,0.12), rgba(255,255,255,0.035))",
            }}
          >
            <Box display="flex" alignItems="center" gap={1} minWidth={0}>
              <ForumRounded sx={{ color: "primary.main", fontSize: 18 }} />
              <Box minWidth={0}>
                <Typography fontWeight={900} fontSize={14}>
                  Focused Post
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {postDetailedData?.post_comments?.count || 0} comments in discussion
                </Typography>
              </Box>
            </Box>

            <Tooltip arrow title="Back to feed">
              <Button
                size="small"
                startIcon={<ArrowBackRounded sx={{ width: 17, height: 17 }} />}
                sx={{
                  borderRadius: "8px",
                  minWidth: { xs: 36, sm: 108 },
                  px: { xs: 1, sm: 1.25 },
                  background: "rgba(255,255,255,0.04)",
                  color: "primary.main",
                  fontWeight: 900,
                  "&:hover": {
                    background: "rgba(214,178,94,0.10)",
                  },
                }}
                onClick={handleClearPostDetailedData}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Feed
                </Box>
              </Button>
            </Tooltip>
          </Box>

          {/* display error */}
          {errorMessage && (
            <Box p={1} display={"flex"} justifyContent={"center"}>
              <Collapse in={errorMessage || false}>
                <Alert
                  severity="info"
                  onClick={() => setErrorMessage("")}
                  sx={{
                    borderRadius: "8px",
                    border: "1px solid rgba(214,178,94,0.24)",
                    background: "rgba(214,178,94,0.08)",
                    color: "text.primary",
                  }}
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
              pr: { xs: 0, sm: 0.5, lg: 0 },
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(148,163,184,0.28)",
                borderRadius: 999,
              },
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(148,163,184,0.28) transparent",
            }}
          >
            {/* render post details feed here */}
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

              {/* comment input text  */}
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
                {/* input for comment */}
                <Box width={"100%"} mx={1}>
                  <InputBase
                    inputRef={commentInputRef}
                    multiline
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxRows={2}
                    disabled={isUploading}
                    className="w-100"
                    placeholder="Add a clear, useful comment..."
                    sx={{
                      fontSize: "small",
                      color: "text.primary",
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
            </Box>
          </Box>

        </React.Fragment>
      )}
    </Stack>
  );
}

export default PostDetailsContainer;
