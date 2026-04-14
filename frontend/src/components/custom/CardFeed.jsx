import {
  CloseRounded,
  DownloadRounded,
  FavoriteRounded,
  ForumRounded,
  GitHub,
  GradeOutlined,
  InfoRounded,
  LockRounded,
  MoreVertRounded,
  RefreshRounded,
  VerifiedRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  Dialog,
  FormHelperText,
  IconButton,
  ListItemAvatar,
  Menu,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleUpdateIsPostDetailed } from "../../redux/AppUI";
import {
  resetClearCurrentPosts,
  updateCurrentPostDetails,
  updateCurrentPosts,
} from "../../redux/CurrentPosts";
import AlertGeneral from "../alerts/AlertGeneral";
import AlertMiniProfileView from "../alerts/AlertMiniProfileView";
import AlertReportPost from "../alerts/AlertReportPost";
import SnackbarConnect from "../snackbar/SnackbarConnect";
import CustomCountryName from "../utilities/CustomCountryName";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceScreenSize from "../utilities/CustomDeviceScreenSize";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import { getElapsedTime } from "../utilities/getElapsedTime";
import { getImageMatch } from "../utilities/getImageMatch";
import CardFeedMore from "./CardFeedMore";

const CardFeed = ({
  post,
  posts,
  setPostDetailedData,
  isLastIndex = false,
  setPageNumber,
  pageNumber,
  errorMessage,
  setErrorMessage,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [postBelongsCurrentUser, setPostBelongsCurrentUser] = useState(false);
  const [isProcessingPost, setIsProcessingPost] = useState(false);
  const [isFullDescription, setIsFullDescription] = useState(false);
  const [openMiniProfileAlert, setOpenMiniProfileAlert] = useState(false);
  const [messageMore, setMessageMore] = useState("");
  const [openAlertReport, setOpenAlertReport] = useState(false);
  const [postWholeReport, setPostWholeReport] = useState("");
  const [openAlertGeneral, setOpenAlertGeneral] = useState(false);
  const [openImagePreview, setOpenImagePreview] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const openMenu = Boolean(anchorEl);
  const handleClickMoreVertPost = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const { currentMode } = useSelector((state) => state.appUI);
  const { user, isGuest } = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDarkMode = currentMode === "dark";
  const panelRadius = `${theme.shape.borderRadius}px`;
  const imageRadius = `${Math.max(theme.shape.borderRadius - 2, 10)}px`;

  const { _id, avatar, name, specialisationTitle: title, country, county } = user || {};
  const { clicks: post_like_cicks } = post.post_liked || {};
  const { clicks: post_github_clicks, link: post_github_link } = post.post_github || {};
  const { count: post_comment_count } = post?.post_comments || {};

  const post_likes = post_like_cicks;
  const max_description = CustomDeviceIsSmall() ? 125 : 250;
  const details = post?.post_body || "";
  const detailsLong = details.length > max_description;

  const userInfo = {
    userId: _id,
    ownerId: post.post_owner.ownerId,
    postId: post._id,
    avatar,
    name,
    title,
    country,
    county,
  };

  const currentUserLiked = post?.post_liked?.clickers?.some(
    (clickerId) => clickerId === _id
  );
  const currentUserClickedGithub = post?.post_github?.clickers?.some(
    (clickerId) => clickerId === _id
  );
  const currentUserCommented = post?.post_comments?.comments?.some(
    (commentors) => commentors.userId === _id
  );

  const categoryTags = [
    post?.post_category?.sub1,
    post?.post_category?.sub2,
    post?.post_category?.sub3,
    post?.post_category?.sub4,
  ].filter((item) => item && !item.toLowerCase().includes("other"));

  const handleDetailsLength = () =>
    detailsLong ? details.substring(0, max_description) : details;

  const handleOccupation = () => {
    const titleParts = post?.post_owner?.ownertitle?.split(" ") || [];
    const first = titleParts[0] || "";
    let second = titleParts[1] || "";

    if (second?.toLowerCase().includes("developer")) {
      second = "Dev";
    }
    if (second?.toLowerCase().includes("engineer")) {
      second = "Eng";
    }

    return [first, second].filter(Boolean).join(" ");
  };

  const handleName = () => {
    const titleParts = post?.post_owner?.ownername?.split(" ") || [];
    const first = titleParts[0] || "";
    const second = titleParts[1] ? titleParts[1].substring(0, 1) : "";

    return [first, second].filter(Boolean).join(" ");
  };

  const ownerNameDisplay = CustomDeviceSmallest()
    ? handleName()
    : `${post?.post_owner?.ownername || ""}`;
  const ownerTitleDisplay = CustomDeviceSmallest()
    ? handleOccupation()
    : `${post?.post_owner?.ownertitle || ""}`;
  const locationLabel = [
    post?.post_location?.state,
    CustomCountryName(post?.post_location?.country),
  ]
    .filter(Boolean)
    .join(" • ");
  const popupMeta = [post?.post_category?.main, locationLabel, getElapsedTime(post?.createdAt)]
    .filter(Boolean);

  useEffect(() => {
    const postID = `${post.post_owner?.ownerId}`;
    const currentUserID = `${user?._id}`;
    setPostBelongsCurrentUser(postID === currentUserID);
  }, [user?._id, post?.post_owner?.ownerId]);

  const handlePostLikes = () => {
    let message = "liked your post";
    let minimessage = `${post?.post_title?.substring(0, 30)}...`;

    userInfo.message = message;
    userInfo.minimessage = minimessage;
    setIsProcessingPost(true);

    axios
      .put(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/update/likes`, userInfo, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.reaction === "liked" || res.data.reaction === "disliked") {
          dispatch(updateCurrentPostDetails(res.data.post));
        }
      })
      .catch((err) => {
        console.log(err);
        setOpenAlertGeneral(true);
        setErrorMessage(err?.response?.data);
      })
      .finally(() => {
        setIsProcessingPost(false);
      });
  };

  const handleGithubClicks = () => {
    let message = "viewed your github link";
    let minimessage = `${post?.post_title?.substring(0, 30)}...`;

    userInfo.message = message;
    userInfo.minimessage = minimessage;
    setIsProcessingPost(true);

    axios
      .put(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/update/github`, userInfo, {
        withCredentials: true,
      })
      .then((res) => {
        dispatch(updateCurrentPostDetails(res.data));
        window.open(post?.post_github?.link, "__blank__");
      })
      .catch((err) => {
        console.log(err);
        setOpenAlertGeneral(true);
        setErrorMessage(err?.response?.data);
      })
      .finally(() => {
        setIsProcessingPost(false);
      });
  };

  const handleFullDescription = () => {
    setIsFullDescription((prev) => !prev);
  };

  const handlePostImagePresent = () => {
    const arrayFreeLogoName = getImageMatch("", true)[0];
    if (arrayFreeLogoName?.includes(post?.post_url)) {
      return getImageMatch(post?.post_url);
    }

    return post?.post_url;
  };

  const handleShowFullPostComments = () => {
    dispatch(handleUpdateIsPostDetailed(true));
    setPostDetailedData(post);
  };

  const handleMiniProfileView = useCallback(() => {
    setOpenMiniProfileAlert(true);
  }, []);

  const handleOpenImagePreview = () => {
    if (postImageSrc) {
      setOpenImagePreview(true);
    }
  };

  const handleCloseImagePreview = () => {
    setOpenImagePreview(false);
  };

  const handleDownloadImage = async () => {
    if (!postImageSrc) {
      return;
    }

    try {
      const response = await fetch(postImageSrc);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const fileName = `${(post?.post_title || "metatron-post-image")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "metatron-post-image"}.jpg`;

      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(postImageSrc, "_blank", "noopener,noreferrer");
    }
  };

  const handleFetchMoreData = () => {
    if (!hasMorePosts) {
      setPageNumber(1);
      dispatch(resetClearCurrentPosts());
    }

    setIsFetching(true);

    axios
      .get(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/all?page=${pageNumber}&limit=10`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res?.data) {
          if (res.data.length > 0) {
            dispatch(updateCurrentPosts([...posts, ...res.data]));
          } else {
            setHasMorePosts(false);
          }
        }

        setPageNumber((prev) => prev + 1);
      })
      .catch((err) => {
        if (err?.response?.data.login) {
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage("server unreachable");
          return;
        }
        setErrorMessage(err?.response?.data);
        setOpenAlertGeneral(true);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const handleMaxTextWidth = () => {
    if (CustomLandscapeWidest()) {
      return "90%";
    }
    if (CustomDeviceTablet()) {
      return "95%";
    }
    if (CustomLandScape()) {
      return "93%";
    }

    return "98%";
  };

  const postImageSrc = handlePostImagePresent();

  const actionItems = [
    {
      key: "like",
      count: post_likes,
      title: "like",
      onClick: handlePostLikes,
      disabled: isProcessingPost || isGuest,
      icon: isProcessingPost ? (
        <CircularProgress size={20} />
      ) : (
        <FavoriteRounded
          sx={{ width: 18, height: 18 }}
          color={currentUserLiked ? "primary" : undefined}
        />
      ),
    },
    {
      key: "github",
      count: post_github_clicks,
      title: "Github",
      onClick: handleGithubClicks,
      disabled: isProcessingPost || isGuest || !post_github_link,
      icon: isProcessingPost ? (
        <CircularProgress size={20} />
      ) : (
        <GitHub
          sx={{ width: 18, height: 18 }}
          color={currentUserClickedGithub ? "primary" : undefined}
        />
      ),
    },
    {
      key: "comment",
      count: post_comment_count,
      title: "comment",
      onClick: handleShowFullPostComments,
      disabled: isProcessingPost || isGuest,
      icon: isProcessingPost ? (
        <CircularProgress size={20} />
      ) : (
        <ForumRounded
          sx={{ width: 18, height: 18 }}
          color={currentUserCommented ? "primary" : undefined}
        />
      ),
    },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        mt: 2,
        mb: isLastIndex ? 10 : 4,
        maxWidth: { xs: "100%", md: "700px", lg: "780px", xl: "860px" },
        width: "100%",
        mx: "auto",
        backgroundColor: theme.palette.background.paper,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 12px 30px rgba(0,0,0,0.24)"
            : "0 18px 45px rgba(15,76,129,0.08)",
        border:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(15,76,129,0.12)",
        borderRadius: panelRadius,
        opacity: openMenu && !isDarkMode ? 0.98 : 1,
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 18px 36px rgba(0,0,0,0.3)"
              : "0 22px 48px rgba(15,76,129,0.14)",
        },
      }}
    >
      <Box px={2} pt={2} pb={1.25}>
        <Box display="flex" justifyContent="space-between" gap={1.5}>
          <Box display="flex" gap={1.5} flex={1} minWidth={0}>
            <ListItemAvatar
              sx={{ minWidth: "auto", mr: 0 }}
              onClick={isGuest ? null : handleMiniProfileView}
            >
              <Tooltip arrow title={isGuest ? "login" : "profile"}>
                <Avatar
                  src={post?.post_owner?.owneravatar}
                  variant="rounded"
                  sx={{
                    width: 52,
                    height: 52,
                    color: "white",
                    borderRadius: imageRadius,
                  }}
                  alt=""
                />
              </Tooltip>
            </ListItemAvatar>

            <Box minWidth={0} flex={1}>
              <Box display="flex" alignItems="center" gap={0.8} flexWrap="wrap">
                <Typography fontWeight={700} variant="body1" lineHeight={1.2}>
                  {ownerNameDisplay}
                </Typography>
                <VerifiedRounded color="primary" sx={{ width: 17, height: 17 }} />
                {post?.post_edited && (
                  <Typography
                    variant="caption"
                    sx={{
                      px: 0.75,
                      py: 0.15,
                      borderRadius: 999,
                      bgcolor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(15,76,129,0.08)",
                      color: "text.secondary",
                    }}
                  >
                    edited
                  </Typography>
                )}
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35 }}>
                {ownerTitleDisplay}
              </Typography>

              {locationLabel && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.4 }}
                >
                  {locationLabel}
                </Typography>
              )}
            </Box>
          </Box>

          <Stack alignItems="flex-end" spacing={0.5}>
            <Box display="flex" alignItems="center">
              <Typography pt={0.5} variant="caption" mr={postBelongsCurrentUser ? 0 : 0.5}>
                {getElapsedTime(post?.createdAt)}
              </Typography>

              {isGuest ? (
                <Box pl={1}>
                  <Tooltip title="login" arrow>
                    <LockRounded color="primary" sx={{ width: 15, height: 15 }} />
                  </Tooltip>
                </Box>
              ) : (
                !postBelongsCurrentUser && (
                  <Tooltip title="more" arrow>
                    <IconButton
                      size="small"
                      aria-label="more"
                      onClick={handleClickMoreVertPost}
                      sx={{ ml: 0.5 }}
                    >
                      <MoreVertRounded color="primary" sx={{ width: 18, height: 17 }} />
                    </IconButton>
                  </Tooltip>
                )
              )}
            </Box>
          </Stack>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          MenuListProps={{ "aria-labelledby": "more-button" }}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <CardFeedMore
            ownerId={post?.post_owner?.ownerId}
            currentUserNetwork={user?.network}
            ownerName={post?.post_owner?.ownername}
            setMessageMore={setMessageMore}
            handleCloseMenu={handleCloseMenu}
            setOpenAlertReport={setOpenAlertReport}
            setPostWhole={setPostWholeReport}
            post={post}
          />
        </Menu>
      </Box>

      <CardContent sx={{ pt: 0.5, pb: postImageSrc ? 2 : 2.5 }}>
        <Box mb={1.75}>
          <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} flexWrap="wrap">
            <Box
              sx={{
                px: 1.1,
                py: 0.45,
                borderRadius: 999,
                bgcolor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(15,76,129,0.08)",
              }}
            >
              <Typography variant="caption" fontWeight={700} color="primary">
                {post?.post_category?.main}
              </Typography>
            </Box>

            {post?.favorite_count > 0 && (
              <FormHelperText sx={{ m: 0, color: "success.main" }}>
                {post?.favorite_count} saved this post
              </FormHelperText>
            )}
          </Box>

          <Box mt={1.25} display="flex" alignItems="flex-start" gap={1}>
            <GradeOutlined
              sx={{
                width: 18,
                height: 18,
                mt: 0.4,
                color: isDarkMode ? "warning.light" : "warning.main",
              }}
            />
            <Box>
              <Typography variant="h6" fontWeight={700} lineHeight={1.3}>
                {post?.post_title}
              </Typography>

              {categoryTags.length > 0 && (
                <Box mt={1} display="flex" gap={0.75} flexWrap="wrap">
                  {categoryTags.map((tag) => (
                    <Box
                      key={tag}
                      sx={{
                        px: 1,
                        py: 0.3,
                        borderRadius: 999,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.default",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        #{tag}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <CardActionArea onClick={handleFullDescription} disabled={!detailsLong} sx={{ borderRadius: imageRadius }}>
          <Box display="flex" justifyContent="center" width="100%" flexDirection="column">
            <Box display="flex" justifyContent="center" width="100%">
              <Typography
                color={isDarkMode ? "text.secondary" : "text.primary"}
                sx={{ fontSize: "0.95rem", lineHeight: 1.8 }}
                variant="body2"
                maxWidth={handleMaxTextWidth()}
              >
                {isFullDescription ? details : handleDetailsLength()}
                {detailsLong && !isFullDescription && (
                  <Box component="span" fontWeight={700} color="primary.main">
                    {" "}
                    more
                  </Box>
                )}
              </Typography>
            </Box>
          </Box>
        </CardActionArea>
      </CardContent>

      {postImageSrc && (
        <Box px={2} pb={2} display="flex" flexDirection="column" justifyContent="center" width="100%">
          <CardActionArea
            onClick={handleOpenImagePreview}
            sx={{
              width: "100%",
              borderRadius: imageRadius,
              overflow: "hidden",
              border: "1px solid",
              borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(15,76,129,0.12)",
              bgcolor: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(15,76,129,0.03)",
            }}
          >
            <Box
              component="img"
              src={postImageSrc}
              loading="lazy"
              alt={post?.post_title || "Post preview"}
              sx={{
                width: "100%",
                minHeight: CustomDeviceScreenSize(),
                maxHeight: { xs: 260, sm: 320, md: 420 },
                objectFit: "cover",
                display: "block",
              }}
            />
          </CardActionArea>
        </Box>
      )}

      <Divider />

      <Box
        display="flex"
        p={1.25}
        justifyContent="space-around"
        alignItems="center"
        sx={{
          bgcolor: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(15,76,129,0.02)",
        }}
      >
        {actionItems.map(({ key, icon, count, title, onClick, disabled }) => (
          <Box key={key} display="flex" alignItems="center" sx={{ px: 0.5, py: 0.2, borderRadius: 999 }}>
            <Tooltip title={title} arrow>
              <Checkbox
                onChange={onClick}
                icon={icon}
                checkedIcon={icon}
                disabled={disabled}
              />
            </Tooltip>
            <Typography fontWeight="bold" variant="body2" color="text.secondary">
              {count}
            </Typography>
          </Box>
        ))}
      </Box>

      {isLastIndex && (
        <Box
          justifyContent={"center"}
          display={"flex"}
          flexDirection={"column"}
          p={1}
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            startIcon={isFetching ? <CircularProgress size={14} /> : <RefreshRounded />}
            size="small"
            className="fw-bold"
            onClick={handleFetchMoreData}
            disabled={isFetching}
          >
            {hasMorePosts ? "Load More" : "Refresh Now"}
          </Button>

          {!hasMorePosts && (
            <Box justifyContent={"center"} display={"flex"}>
              <FormHelperText>no more posts from the backend</FormHelperText>
            </Box>
          )}
        </Box>
      )}

      {errorMessage && (
        <AlertGeneral
          title={"something went wrong!"}
          message={errorMessage}
          isError={true}
          openAlertGeneral={openAlertGeneral}
          setOpenAlertGeneral={setOpenAlertGeneral}
          setErrorMessage={setErrorMessage}
          defaultIcon={<InfoRounded />}
        />
      )}

      {openAlertReport && (
        <AlertReportPost
          openAlertReport={openAlertReport}
          setOpenAlertReport={setOpenAlertReport}
          post={postWholeReport}
          currentUser={user}
        />
      )}

      {messageMore && <SnackbarConnect message={messageMore} />}

      {openMiniProfileAlert && (
        <AlertMiniProfileView
          openAlert={openMiniProfileAlert}
          setOpenAlert={setOpenMiniProfileAlert}
          userId={post.post_owner.ownerId}
        />
      )}

      <Dialog
        open={openImagePreview}
        onClose={handleCloseImagePreview}
        fullScreen
        PaperProps={{
          sx: {
            background: "rgba(7, 16, 30, 0.42)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            backgroundImage: "none",
            boxShadow: "none",
          },
        }}
        sx={{
          "& .MuiBackdrop-root": {
            background: "rgba(5, 12, 24, 0.58)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2, md: 3 },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: { xs: 14, md: 22 },
              left: { xs: 14, md: 22 },
              zIndex: 2,
            }}
          >
            <IconButton
              onClick={handleCloseImagePreview}
              aria-label="Close image preview"
              sx={{
                bgcolor: "rgba(255,255,255,0.14)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.22)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.22)",
                },
              }}
            >
              <CloseRounded />
            </IconButton>
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: { xs: 14, md: 22 },
              right: { xs: 14, md: 22 },
              zIndex: 2,
            }}
          >
            <IconButton
              onClick={handleDownloadImage}
              aria-label="Download image"
              sx={{
                bgcolor: "rgba(255,255,255,0.14)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.22)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.22)",
                },
              }}
            >
              <DownloadRounded />
            </IconButton>
          </Box>

          <Box
            sx={{
              maxWidth: "min(96vw, 1460px)",
              maxHeight: "90vh",
              width: "100%",
              height: "100%",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.35fr) minmax(320px, 420px)" },
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.18)",
              bgcolor: "rgba(255,255,255,0.08)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <Box
              sx={{
                minHeight: { xs: "54vh", lg: "100%" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(0,0,0,0.16)",
                p: { xs: 1.5, md: 2.5 },
                borderRight: { lg: "1px solid rgba(255,255,255,0.12)" },
              }}
            >
              {postImageSrc && (
                <Box
                  component="img"
                  src={postImageSrc}
                  alt={post?.post_title || "Post preview"}
                  sx={{
                    width: "100%",
                    height: "100%",
                    maxHeight: "82vh",
                    objectFit: "contain",
                    display: "block",
                    borderRadius: "18px",
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: { xs: 2, md: 2.5 },
                color: "#F8FAFC",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))",
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    px: 1.2,
                    py: 0.45,
                    borderRadius: 999,
                    bgcolor: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    mb: 1.5,
                  }}
                >
                  <Typography variant="caption" fontWeight={700} sx={{ color: "#BFDBFE" }}>
                    Image preview
                  </Typography>
                </Box>

                <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
                  {post?.post_title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 1.25,
                    color: "rgba(241,245,249,0.82)",
                    lineHeight: 1.8,
                  }}
                >
                  {detailsLong ? `${details.substring(0, 180)}...` : details}
                </Typography>

                {popupMeta.length > 0 && (
                  <Box mt={2} display="flex" gap={0.8} flexWrap="wrap">
                    {popupMeta.map((item) => (
                      <Box
                        key={item}
                        sx={{
                          px: 1,
                          py: 0.45,
                          borderRadius: 999,
                          bgcolor: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        <Typography variant="caption" sx={{ color: "rgba(241,245,249,0.86)" }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <Box mt={3}>
                <Box display="flex" alignItems="center" gap={1.2}>
                  <Avatar
                    src={post?.post_owner?.owneravatar}
                    alt={post?.post_owner?.ownername || "Author"}
                    variant="rounded"
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "14px",
                    }}
                  />
                  <Box>
                    <Box display="flex" alignItems="center" gap={0.7}>
                      <Typography variant="body2" fontWeight={700}>
                        {post?.post_owner?.ownername}
                      </Typography>
                      <VerifiedRounded sx={{ width: 16, height: 16, color: "#93C5FD" }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: "rgba(241,245,249,0.75)" }}>
                      {post?.post_owner?.ownertitle}
                    </Typography>
                  </Box>
                </Box>

                {categoryTags.length > 0 && (
                  <Box mt={2}>
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(241,245,249,0.62)", display: "block", mb: 0.8 }}
                    >
                      Related topics
                    </Typography>
                    <Box display="flex" gap={0.75} flexWrap="wrap">
                      {categoryTags.map((tag) => (
                        <Box
                          key={tag}
                          sx={{
                            px: 1,
                            py: 0.35,
                            borderRadius: 999,
                            bgcolor: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.12)",
                          }}
                        >
                          <Typography variant="caption" sx={{ color: "#E2E8F0" }}>
                            #{tag}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Card>
  );
};

export default CardFeed;
