import {
  CodeRounded,
  Close,
  Edit,
  FavoriteRounded,
  ForumRounded,
  GitHub,
  LockRounded,
  MoreVertRounded,
  OpenInNewRounded,
  UpdateRounded,
  VerifiedRounded
} from "@mui/icons-material";
import {
  Alert,
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  InputBase,
  Menu,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { lazy, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import AlertReportPost from "../alerts/AlertReportPost";
import CardFeedMore from "../custom/CardFeedMore";
import PostDocumentPreview, { getPostDocumentItems } from "../custom/PostDocumentPreview";
import PostMediaCarousel, { getPostMediaItems } from "../custom/PostMediaCarousel";
import CustomCountryName from "../utilities/CustomCountryName";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import { getElapsedTime } from "../utilities/getElapsedTime";
const AlertMiniProfileView = lazy(() =>
  import("../alerts/AlertMiniProfileView")
);

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  height: "20%",
  alignItems: "center",
  justifyContent: "center",
}));

// controls the width of the input text
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
  },
  fontSize:'small'
}));


const PostDetailsFeed = ({
  postDetailedData,
  setPostDetailedData,
  isPostEditMode = false,
  showFullContent = false,
  isFocusedLayout = false,
  onCommentClick,
}) => {


  const [anchorEl, setAnchorEl] = useState(null);
  const [postBelongsCurrentUser, setPostBelongsCurrentUser] = useState(false);
  const openMenu = Boolean(anchorEl);
  const [isUploading, setIsUploading] = useState(false);
  const [messageResponse, setMessageResponse] = useState("");
  const [isFullDescription, setIsFullDescription] = useState(false);
  const [openMiniProfileAlert, setOpenMiniProfileAlert] = useState(false);
  const [openAlertReport, setOpenAlertReport] = useState(false);
  const [postWholeReport, setPostWholeReport] = useState("");
  
  
  const [editedText, setEditedText] = useState(
    `${postDetailedData?.post_body}`
  );


  // redux states
  const { currentMode } = useSelector(
    (state) => state.appUI
  );
   const isDarkMode=currentMode==='dark'

  const { user,isGuest } = useSelector((state) => state.currentUser);
  // extract basic current user details
  const { _id, avatar, name, specialisationTitle: title } = user || {};

  // extract the likes and array of liked usersIDs of this post
  const { clicks: post_clicks } = postDetailedData?.post_liked || {};

  //   extract the counts of comments
  const { count: post_comment_count } = postDetailedData?.post_comments || {};

  // extract the counts of github clicks
  const { clicks: post_github_clicks, link: post_github_link } = postDetailedData.post_github || {};

  const post_likes = post_clicks;

  // for checking if current user  liked the post.
  const currentUserLiked = postDetailedData?.post_liked?.clickers?.some(
    (clickerId) => clickerId === _id
  );

  // for checking if the current user commented any on the post
  const currentUserCommented =
    postDetailedData?.post_comments?.comments?.some(
      (commentors) => commentors.userId === _id
    );

  const currentUserClickedGithub = postDetailedData?.post_github?.clickers?.some(
    (clickerId) => clickerId === _id
  );

    
  // controls the length of description shown for each devices
  const max_description = CustomDeviceIsSmall() ? 122 : 220;
  const details = postDetailedData?.post_body || "";
  const detailsLong = !showFullContent && details.length > max_description;

  // get country name
  const country = CustomCountryName(postDetailedData?.post_location?.country);

  // current user info
  const reactingUserInfo = {
    userId: _id,
    ownerId: postDetailedData?.post_owner?.ownerId,
    postId: postDetailedData?._id,
    avatar,
    name,
    title,
  };

  const handleClickMoreVertPost = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleDetailsLength = () => detailsLong ? details.substring(0, max_description) : details;

  // handle the length of owner title for smallest devices
  const handleOccupation = () => {
    const title = postDetailedData?.post_owner?.ownertitle?.split(" ");
    const first = title[0];
    let second = title[1];

    if (second?.toLowerCase()?.includes("developer")) {
      second = "Dev";
    }
    if (second?.toLowerCase()?.includes("engineer")) {
      second = "Eng";
    }

    return first + " " + second;
  };

  // handle the length of owner title for smallest devices
  const handleName = () => {
    const title = postDetailedData?.post_owner?.ownername?.split(" ") || [];
    return title[0] || "Member";
  };

  // check if the current userID matches the ownerID of the post
  // means belongs to current user thus no need for options menu
  useLayoutEffect(() => {
    const handlePostBelongsCurrentUser = () => {
      const postID = `${postDetailedData?.post_owner?.ownerId}`;
      const currentUserID = `${user?._id}`;

      if (postID === currentUserID) {
        setPostBelongsCurrentUser(true);
      } else {
        setPostBelongsCurrentUser(false);
      }
    };

    handlePostBelongsCurrentUser();
  }, [user?._id, postDetailedData?.post_owner?.ownerId, postDetailedData]);

  // handle user clicking like button
  const handlePostLikes = () => {
    let message = "liked your post";
    let minimessage = postDetailedData?.post_title?.substring(0, 40) + "...";

    // add the above properties to the userInfo that is being sent to the backend
    reactingUserInfo.message = message;
    reactingUserInfo.minimessage = minimessage;
    // add users to the liked clickers group and increment the value of clicks
    setIsUploading(true);
    // performing post request
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/update/likes`,
        reactingUserInfo,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update passedPost with the returned post object
        if (res.data.reaction === "liked") {
          setPostDetailedData(res.data.post);
        }
        if (res.data.reaction === "disliked") {
          // update passedPost with the returned post object
          setPostDetailedData(res.data.post);
        }
      })
      .catch(async (err) => {
        if (err?.code === "ERR_NETWORK") {
          setMessageResponse("Server Unreachable");
          return;
        }

        setMessageResponse(err?.response?.data || "Unable to update reaction.");
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  // handle showing full post description
  const handleFullDescription = () => {
    setIsFullDescription((prev) => !prev);
  };

  const handleGithubClicks = () => {
    if (!post_github_link) return;

    let message = "viewed your github link";
    let minimessage = postDetailedData?.post_title?.substring(0, 40) + "...";

    reactingUserInfo.message = message;
    reactingUserInfo.minimessage = minimessage;
    setIsUploading(true);

    axios
      .put(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/update/github`,
        reactingUserInfo,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setPostDetailedData(res.data);
        window.open(post_github_link, "__blank__");
      })
      .catch(async (err) => {
        if (err?.code === "ERR_NETWORK") {
          setMessageResponse("Server Unreachable");
          return;
        }

        setMessageResponse(err?.response?.data || "Unable to open GitHub link.");
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  // handle updating of the post
  const completePostUpdating = () => {
    // check if post contains added data to update else reject

    // add users to the liked clickers group and increment the value of clicks
    setIsUploading(true);
    // performing post request
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/update/post/${postDetailedData?._id}`,
        { post_body: editedText },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        // update passedPost with the returned post object
        if (res.data.message === "updated successfully") {
          setPostDetailedData(res.data.post);

          setMessageResponse(res.data.message);
        }
      })
      .catch(async (err) => {
        console.log(err);
        if (err?.code === "ERR_NETWORK") {
          setMessageResponse("Server Unreachable");
          return;
        }

        setMessageResponse(err?.response?.data || "Unable to update post.");
      })
      .finally(() => {
        setIsUploading(false);
      });
  };


  // handle close alert delete
  const handleClose = () => {
    // close alert
    setMessageResponse("");
  };

 
  // handle open profile
  const handleOpenMiniProfile=()=>{
      setOpenMiniProfileAlert(true)
      }

  const postMediaItems = getPostMediaItems(postDetailedData);
  const postDocumentItems = getPostDocumentItems(postDetailedData);
  const categoryTags = [
    postDetailedData?.post_category?.sub1,
    postDetailedData?.post_category?.sub2,
    postDetailedData?.post_category?.sub3,
    postDetailedData?.post_category?.sub4,
  ].filter((item) => item && !item.toLowerCase().includes("other"));
  const locationLabel = [country, postDetailedData?.post_location?.state]
    .filter(Boolean)
    .join(" • ");
  const ownerNameDisplay = handleName();
  const ownerTitleDisplay = CustomDeviceSmallest()
    ? handleOccupation()
    : `${postDetailedData.post_owner.ownertitle}`;
  const postedAtLabel = getElapsedTime(postDetailedData?.createdAt);
  const primaryMeta = [
    postDetailedData?.post_category?.main,
    locationLabel,
    postedAtLabel,
  ].filter(Boolean);
  const actionLabel = (value) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
  const actionItems = [
    {
      icon: (
        <FavoriteRounded
          sx={{ width: 18, height: 18 }}
          color={currentUserLiked ? "primary" : undefined}
        />
      ),
      count: post_likes,
      title: "like",
      onClick: handlePostLikes,
    },
    {
      icon: (
        <GitHub
          sx={{ width: 18, height: 18 }}
          color={currentUserClickedGithub ? "primary" : undefined}
        />
      ),
      count: post_github_clicks,
      title: "Github",
      onClick: handleGithubClicks,
      disabled: !post_github_link,
    },
    {
      icon: (
        <ForumRounded
          sx={{ width: 18, height: 18 }}
          color={currentUserCommented ? "primary" : undefined}
        />
      ),
      count: post_comment_count,
      title: "comment",
      onClick: onCommentClick,
    },
  ];

  return (
    <React.Fragment>
      {/* display error message */}
      {messageResponse && (
        <Collapse in={messageResponse || false}>
          <Alert
            severity="info"
            onClose={handleClose}
            sx={{
              mb: 1,
              borderRadius: "8px",
              border: "1px solid rgba(214,178,94,0.24)",
              background: "rgba(214,178,94,0.08)",
              color: "text.primary",
            }}
            action={
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                {/* yes btn */}
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={handleClose}
                >
                  <Close sx={{ width: 15, height: 15 }} />
                </IconButton>
              </Stack>
            }
          >
            {messageResponse}
          </Alert>
        </Collapse>
      )}

      <Card
        elevation={0}
        sx={{
          opacity: openMenu && !isDarkMode ? 0.88 : 1,
          borderRadius: "8px",
          border: isFocusedLayout ? "1px solid rgba(214,178,94,0.18)" : "1px solid rgba(255,255,255,0.10)",
          background: isDarkMode
            ? isFocusedLayout
              ? "linear-gradient(180deg, rgba(18,18,18,0.82), rgba(6,6,6,0.94))"
              : "linear-gradient(180deg, rgba(18,18,18,0.96), rgba(5,5,5,0.98))"
            : "rgba(255,255,255,0.96)",
          boxShadow: isFocusedLayout
            ? "none"
            : isDarkMode
              ? "0 18px 48px rgba(0,0,0,0.28)"
              : "0 14px 34px rgba(139,111,42,0.08)",
          overflow: "hidden",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {!isFocusedLayout && (
          <Box
            sx={{
              height: 3,
              background: "linear-gradient(90deg, #8B6F2A, #D6B25E, rgba(255,242,194,0.86))",
            }}
          />
        )}
        <CardHeader
          sx={{
            px: { xs: 1.25, sm: 1.75, md: isFocusedLayout ? 2 : 1.75 },
            py: { xs: 1.25, sm: 1.5 },
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            "& .MuiCardHeader-content": { minWidth: 0 },
            "& .MuiCardHeader-action": {
              alignSelf: "flex-start",
              mt: 0,
              mr: 0,
            },
          }}
          avatar={
              <IconButton onClick={isGuest ? null:handleOpenMiniProfile} sx={{ p: 0 }}>
              <Tooltip arrow title={isGuest? 'login':'profile'}>
                <Avatar
                  src={postDetailedData?.post_owner?.owneravatar}
                  variant="rounded"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "8px",
                    border: "1px solid rgba(214,178,94,0.28)",
                    boxShadow: "0 0 20px rgba(214,178,94,0.14)",
                  }}
                  alt=""
                >
                </Avatar>
                </Tooltip>
              </IconButton>
          }
          action={
            <Box flexDirection={"row"} display={"flex"} alignItems={"center"} gap={0.5}>
              {!isFocusedLayout && (
                <Typography
                  className={postBelongsCurrentUser && "me-3"}
                  variant="caption"
                  color="text.secondary"
                >
                  {postedAtLabel}
                </Typography>
              )}

              {isGuest ? (
                <Box px={2}>
                  <Tooltip 
                  title="login" 
                  arrow>
                  <LockRounded
                    color="primary"
                    sx={{ width: 15, height: 15 }}
                  />
                  </Tooltip>
                  </Box>
              ):(
                <React.Fragment>
                {!postBelongsCurrentUser && (
                <Tooltip title="more" arrow>
                  <IconButton
                    size="small"
                    aria-label="more"
                    onClick={handleClickMoreVertPost}
                  >
                    <MoreVertRounded color="primary" sx={{ width: 18, height: 18 }} />
                  </IconButton>
                </Tooltip>
              )}
                </React.Fragment>
              )}
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
                MenuListProps={{ "aria-labelledby": "more-button" }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <CardFeedMore
                  ownerId={postDetailedData.post_owner?.ownerId}
                  currentUserNetwork={user?.network}
                  ownerName={postDetailedData.post_owner.ownername}
                  setOpenAlertReport={setOpenAlertReport}
                  setPostWhole={setPostWholeReport}
                  handleCloseMenu={handleCloseMenu}
                />
              </Menu>
            </Box>
          }
          title={
            <Box display="flex" alignItems="center" gap={1} minWidth={0}>
              <Typography fontWeight={900} variant={"body2"} noWrap>
                {ownerNameDisplay}
              </Typography>
              <VerifiedRounded color="primary" sx={{ width: 18, height: 18 }} />
            </Box>
          }
          subheader={
            <Box minWidth={0}>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ display: "block" }}
              >
                {ownerTitleDisplay}
              </Typography>
              {isFocusedLayout && primaryMeta.length > 0 && (
                <Stack
                  direction="row"
                  spacing={0.75}
                  useFlexGap
                  flexWrap="wrap"
                  mt={0.7}
                >
                  {primaryMeta.map((item) => (
                    <Box
                      key={item}
                      sx={{
                        px: 0.85,
                        py: 0.25,
                        borderRadius: "8px",
                        background: isDarkMode
                          ? "rgba(255,255,255,0.045)"
                          : "rgba(139,111,42,0.055)",
                        border: "1px solid rgba(214,178,94,0.14)",
                        maxWidth: "100%",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          }
        />

        <Box>
          <CardContent
            sx={{
              px: { xs: 1.25, sm: 2, md: isFocusedLayout ? 2.25 : 2 },
              py: { xs: 1.5, sm: 2 },
            }}
          >
            <Stack spacing={isFocusedLayout ? 1.35 : 1.25} width="100%">
              {!isFocusedLayout && (
                <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                {postDetailedData?.post_category?.main && (
                  <Box
                    sx={{
                      px: 1.1,
                      py: 0.4,
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, rgba(214,178,94,0.14), rgba(255,255,255,0.035))",
                      border: "1px solid rgba(214,178,94,0.25)",
                    }}
                  >
                    <Typography variant="caption" color="primary.main" fontWeight={900}>
                      {postDetailedData.post_category.main}
                    </Typography>
                  </Box>
                )}
                {locationLabel && (
                  <Box
                    sx={{
                      px: 1,
                      py: 0.35,
                      borderRadius: "8px",
                      background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(139,111,42,0.05)",
                      border: "1px solid rgba(214,178,94,0.14)",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {locationLabel}
                    </Typography>
                  </Box>
                )}
                </Stack>
              )}
              <Box
                display={"flex"}
                justifyContent={"flex-start"}
                alignItems={"flex-start"}
                gap={1}
                minWidth={0}
              >
                <CodeRounded sx={{ color: "primary.main", fontSize: 20, mt: 0.35 }} />
                {/* title of the post */}
                <Typography
                  component="h2"
                  variant={isFocusedLayout ? "h5" : "h6"}
                  fontWeight={900}
                  lineHeight={1.25}
                  sx={{
                    overflowWrap: "anywhere",
                    letterSpacing: 0,
                  }}
                >
                  {postDetailedData.post_title}
                </Typography>
              </Box>
              {!isPostEditMode && categoryTags.length > 0 && (
                <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                  {categoryTags.map((tag) => (
                    <Box
                      key={tag}
                      sx={{
                        px: 1,
                        py: 0.3,
                        borderRadius: "8px",
                        background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(139,111,42,0.06)",
                        border: "1px solid rgba(214,178,94,0.16)",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        #{tag}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}

            {isPostEditMode ? (
              <Box
                display={"flex"}
                justifyContent={"center"}
                width={"100%"}
                flexDirection={"column"}
              >
                <Search
                  sx={{
                    width:'100%'
                  }}
                >
                  <SearchIconWrapper>
                    <Edit sx={{ width: 15, height: 15 }} color="primary" />
                  </SearchIconWrapper>
                  <StyledInputBase
                    inputProps={{ "aria-label": "search" }}
                    multiline
                    minRows={10}
                    maxRows={20}
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    required
                    fullWidth
                  />
                </Search>
                {/* send button */}
                <Box mt={2} display={"flex"} justifyContent={"center"}>
                  <Button
                    startIcon={<UpdateRounded />}
                    disableElevation
                    disabled={
                      isUploading ||
                      editedText?.trim()?.length ===
                        postDetailedData?.post_body?.trim()?.length
                    }
                    onClick={completePostUpdating}
                    variant="contained"
                    sx={{
                      borderRadius: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    Complete Update
                  </Button>
                </Box>
              </Box>
            ) : (
              <CardActionArea
                onClick={handleFullDescription}
                disabled={!detailsLong}
              >
                <Box
                  display={"flex"}
                  justifyContent={"flex-start"}
                  width={"100%"}
                  sx={{
                    borderRadius: "8px",
                    border: isFocusedLayout
                      ? "1px solid rgba(214,178,94,0.16)"
                      : "1px solid rgba(255,255,255,0.07)",
                    background: isFocusedLayout
                      ? isDarkMode
                        ? "rgba(255,255,255,0.045)"
                        : "rgba(139,111,42,0.045)"
                      : isDarkMode
                        ? "rgba(255,255,255,0.035)"
                        : "rgba(139,111,42,0.035)",
                    px: { xs: 1.25, sm: 1.5, md: isFocusedLayout ? 1.75 : 1.5 },
                    py: { xs: 1.35, sm: isFocusedLayout ? 1.65 : 1.35 },
                  }}
                >
                  <Typography
                    color={isDarkMode ? 'text.secondary' : "text.primary"}
                    sx={{
                      fontSize: isFocusedLayout ? "0.875rem" : "0.825rem",
                      lineHeight: isFocusedLayout ? 1.85 : 1.8,
                      whiteSpace: "pre-line",
                      overflowWrap: "anywhere",
                      letterSpacing: 0,
                    }}
                    variant={"body2"}
                    maxWidth="100%"
                  >
                    {showFullContent || isFullDescription ? details : handleDetailsLength()}
                    {detailsLong && !isFullDescription && !showFullContent && (
                      <Typography
                        variant="body2"
                        component={"span"}
                        fontWeight={"bold"}
                        color={"primary"}
                        sx={{ fontSize:'small' }}
                      >
                        &nbsp; Read more
                      </Typography>
                    )}
                  </Typography>
                </Box>
              </CardActionArea>
            )}
            </Stack>
          </CardContent>

          {/* display image or log if is not in edit mode */}

          {!isPostEditMode && (
            <React.Fragment>
              <PostMediaCarousel
                items={postMediaItems}
                title={postDetailedData?.post_title}
                isFocusedLayout={isFocusedLayout}
              />
              <PostDocumentPreview
                documents={postDocumentItems}
                postId={postDetailedData?._id}
                isFocusedLayout={isFocusedLayout}
              />
            </React.Fragment>
          )}
        </Box>

        {/* when post is not in edit mode display the like,git and comment */}
        {!isPostEditMode && (
          <Box
            display="flex"
            px={1.25}
            py={1}
            justifyContent="space-around"
            alignItems="center"
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="center" width="100%">
              {actionItems.map(({ icon, count, title, onClick, disabled }) => (
                <Tooltip key={title} title={title} arrow>
                  <span>
                    <Button
                      onClick={onClick}
                      type="button"
                      disabled={isUploading || isGuest || disabled}
                      onMouseDown={(event) => event.stopPropagation()}
                      variant="text"
                      startIcon={icon}
                      endIcon={title === "Github" ? <OpenInNewRounded sx={{ width: 14, height: 14 }} /> : undefined}
                      sx={{
                        minWidth: { xs: 78, sm: 118 },
                        flex: { xs: "1 1 calc(33.333% - 8px)", sm: "0 0 auto" },
                        px: { xs: 1, sm: 1.5 },
                        py: 0.6,
                        borderRadius: "8px",
                        color: "text.secondary",
                        background: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(139,111,42,0.035)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        "&:hover": {
                          background: "rgba(214,178,94,0.08)",
                          borderColor: "rgba(214,178,94,0.4)",
                          color: "primary.main",
                        },
                      }}
                    >
                      <Box
                        component="span"
                        sx={{ display: { xs: "none", sm: "inline" } }}
                      >
                        {actionLabel(title)}{" "}
                      </Box>
                      {count || 0}
                    </Button>
                  </span>
                </Tooltip>
              ))}
            </Stack>
          </Box>
        )}
      </Card>

      {/* show alert report a post  */}
        {openAlertReport && (
          <AlertReportPost
            openAlertReport={openAlertReport}
            setOpenAlertReport={setOpenAlertReport}
            post={postWholeReport}
            currentUser={user}
          />
        )}

      {/* alert for showing user mini-profile details by passing the post ownerID */}
      <AlertMiniProfileView
        openAlert={openMiniProfileAlert}
        setOpenAlert={setOpenMiniProfileAlert}
        userId={postDetailedData.post_owner.ownerId}
      />
    </React.Fragment>
  );
};

export default PostDetailsFeed;
