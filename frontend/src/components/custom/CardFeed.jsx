import {
  CodeRounded,
  FavoriteRounded,
  ForumRounded,
  GitHub,
  InfoRounded,
  LockRounded,
  MoreVertRounded,
  OpenInNewRounded,
  VerifiedRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  ListItemAvatar,
  Menu,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleUpdateIsPostDetailed } from "../../redux/AppUI";
import {
  updateCurrentPostDetails,
  updateCurrentPosts,
} from "../../redux/CurrentPosts";
import AlertGeneral from "../alerts/AlertGeneral";
import AlertMiniProfileView from "../alerts/AlertMiniProfileView";
import AlertReportPost from "../alerts/AlertReportPost";
import SnackbarConnect from "../snackbar/SnackbarConnect";
import CustomCountryName from "../utilities/CustomCountryName";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import { getElapsedTime } from "../utilities/getElapsedTime";
import CardFeedMore from "./CardFeedMore";
import PostDocumentPreview, { getPostDocumentItems } from "./PostDocumentPreview";
import PostImagePreviewDialog from "./PostImagePreviewDialog";
import PostMediaCarousel, { getPostMediaItems } from "./PostMediaCarousel";

const POST_PAGE_SIZE = 12;
const appendUniqueById = (current = [], incoming = []) => {
  const seen = new Set(current.map((item) => item?._id).filter(Boolean));
  return [
    ...current,
    ...incoming.filter((item) => {
      if (!item?._id || seen.has(item._id)) return false;
      seen.add(item._id);
      return true;
    }),
  ];
};

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
  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const infiniteScrollRef = useRef(null);
  const lastRequestedPageRef = useRef(0);

  const openMenu = Boolean(anchorEl);
  const handleClickMoreVertPost = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const { currentMode } = useSelector((state) => state.appUI);
  const { user, isGuest } = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDarkMode = currentMode === "dark";
  const panelRadius = `${theme.shape.borderRadius}px`;
  const imageRadius = panelRadius;

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
    return first;
  };

  const ownerNameDisplay = handleName() || "Member";
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
  const actionLabel = (value) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

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

  const handleShowFullPostComments = () => {
    dispatch(handleUpdateIsPostDetailed(true));
    setPostDetailedData(post);
  };

  const handleMiniProfileView = useCallback(() => {
    setOpenMiniProfileAlert(true);
  }, []);

  const handleOpenImagePreview = (item) => {
    if (item?.src || postImageSrc) {
      setSelectedImageSrc(item?.src || postImageSrc);
      setOpenImagePreview(true);
    }
  };

  const handleCloseImagePreview = () => {
    setOpenImagePreview(false);
  };

  const handleDownloadImage = async () => {
    const imageSrc = selectedImageSrc || postImageSrc;
    if (!imageSrc) {
      return;
    }

    try {
      const response = await fetch(imageSrc);
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
      window.open(imageSrc, "_blank", "noopener,noreferrer");
    }
  };

  const handleFetchMoreData = useCallback(() => {
    if (!hasMorePosts || isFetching || isGuest) return;
    if (lastRequestedPageRef.current === pageNumber) return;

    lastRequestedPageRef.current = pageNumber;
    setIsFetching(true);

    axios
      .get(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/all?page=${pageNumber}&limit=${POST_PAGE_SIZE}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res?.data) {
          if (res.data.length > 0) {
            dispatch(updateCurrentPosts(appendUniqueById(posts, res.data)));
            if (res.data.length < POST_PAGE_SIZE) {
              setHasMorePosts(false);
            }
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
  }, [dispatch, hasMorePosts, isFetching, isGuest, pageNumber, posts, setErrorMessage, setPageNumber]);

  useEffect(() => {
    if (!isLastIndex || !hasMorePosts || isFetching || isGuest) return undefined;
    const target = infiniteScrollRef.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleFetchMoreData();
        }
      },
      { root: null, rootMargin: "420px 0px", threshold: 0.01 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [handleFetchMoreData, hasMorePosts, isFetching, isGuest, isLastIndex]);

  const postMediaItems = getPostMediaItems(post);
  const postDocumentItems = getPostDocumentItems(post);
  const postImageSrc = postMediaItems[0]?.src || "";

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
          sx={{
            width: 18,
            height: 18,
            color: currentUserLiked ? "#D6B25E" : "rgba(255,255,255,0.6)"
          }}
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
        mb: isLastIndex ? { xs: 18, md: 22, lg: 24 } : 4,
        scrollMarginBottom: isLastIndex ? { xs: "150px", md: "160px", lg: "170px" } : undefined,
        width: "100%",
        maxWidth: "100%",
        mx: "auto",
        position: "relative",
        background: isDarkMode
          ? "linear-gradient(180deg, rgba(18,18,18,0.96), rgba(5,5,5,0.98))"
          : "rgba(255,255,255,0.96)",
        backdropFilter: "blur(25px)",
        border:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(139,111,42,0.12)",
        borderRadius: panelRadius,
        boxShadow: isDarkMode
          ? "0 18px 48px rgba(0,0,0,0.42)"
          : "0 14px 34px rgba(139,111,42,0.08)",
        opacity: openMenu && !isDarkMode ? 0.98 : 1,
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: isDarkMode
            ? "0 26px 70px rgba(0,0,0,0.56)"
            : "0 22px 50px rgba(139,111,42,0.14)",
        }
      }}
    >
      <Box
        sx={{
          height: 3,
          background: "linear-gradient(90deg, #8B6F2A, #D6B25E, rgba(255,242,194,0.86))",
        }}
      />
      <Box px={1.5} pt={1.5} pb={1}>
        <Box display="flex" justifyContent="space-between" gap={1.2}>
          <Box display="flex" gap={1.2} flex={1} minWidth={0}>
            <ListItemAvatar
              sx={{ minWidth: "auto", mr: 0 }}
              onClick={isGuest ? null : handleMiniProfileView}
            >
              <Tooltip arrow title={isGuest ? "login" : "profile"}>
                <Avatar
                  src={post?.post_owner?.owneravatar}
                  variant="rounded"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "8px",
                    border: "1px solid rgba(214,178,94,0.28)",
                    boxShadow: "0 0 12px rgba(214,178,94,0.18)",
                  }}
                  alt=""
                />
              </Tooltip>
            </ListItemAvatar>

            <Box minWidth={0} flex={1}>
              <Box display="flex" alignItems="center" gap={0.8} flexWrap="wrap">
                <Typography variant="body1" fontWeight={900} lineHeight={1.2}>
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
                      bgcolor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(139,111,42,0.08)",
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
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.2 }}>
                {getElapsedTime(post?.createdAt)}
              </Typography>
            </Box>
          </Box>

          <Stack alignItems="flex-end" spacing={0.5}>
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
                {post?.post_category?.main}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
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
        <Box mb={1.2}>
          <Box display="flex" alignItems="center" gap={0.75} flexWrap="wrap">
            <Box display="flex" gap={0.75} flexWrap="wrap">
              {locationLabel && (
                <Box
                  sx={{
                    px: 1,
                    py: 0.35,
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {locationLabel}
                  </Typography>
                </Box>
              )}
              {post?.favorite_count > 0 && (
                <Box
                  sx={{
                    px: 1,
                    py: 0.35,
                    borderRadius: 999,
                    bgcolor: isDarkMode ? "rgba(214,178,94,0.1)" : "rgba(214,178,94,0.08)",
                    border: "1px solid rgba(214,178,94,0.18)",
                  }}
                >
                  <Typography variant="caption" color="primary.main" fontWeight={800}>
                    {post?.favorite_count} saved
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box mt={1.25} display="flex" alignItems="flex-start" gap={1}>
            <CodeRounded
              sx={{
                width: 18,
                height: 18,
                mt: 0.4,
                color: "primary.main",
              }}
            />
            <Box minWidth={0}>
              <Typography variant="h6" fontWeight={900} lineHeight={1.24}>
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
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <CardActionArea onClick={handleFullDescription} disabled={!detailsLong} sx={{ borderRadius: imageRadius }}>
          <Box
            sx={{
              borderRadius: "8px",
              background: isDarkMode ? "rgba(255,255,255,0.035)" : "rgba(139,111,42,0.035)",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(139,111,42,0.08)",
              px: { xs: 1.25, sm: 1.5 },
              py: 1.35,
            }}
          >
            <Typography
              color={isDarkMode ? "text.secondary" : "text.primary"}
              sx={{
                lineHeight: 1.7,
                letterSpacing: 0,
                whiteSpace: "pre-line",
              }}
              variant="body2"
              maxWidth="100%"
            >
              {isFullDescription ? details : handleDetailsLength()}
              {detailsLong && !isFullDescription && (
                <Box component="span" color="primary.main" fontWeight={900}>
                  {" "}
                  Read more
                </Box>
              )}
            </Typography>

          </Box>
        </CardActionArea>
      </CardContent>

      <PostMediaCarousel
        items={postMediaItems}
        title={post?.post_title}
        onImageClick={handleOpenImagePreview}
      />

      <PostDocumentPreview documents={postDocumentItems} postId={post?._id} />

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <Box
        display="flex"
        p={1.1}
        justifyContent="center"
        alignItems="center"
        sx={{
          bgcolor: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(139,111,42,0.02)",
        }}
      >
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="center" width="100%">
          {actionItems.map(({ key, icon, count, title, onClick, disabled }) => (
            <Tooltip key={key} title={title} arrow>
              <span>
                <Button
                  onClick={onClick}
                  disabled={disabled}
                  variant="text"
                  startIcon={icon}
                  endIcon={key === "github" && post_github_link ? <OpenInNewRounded sx={{ width: 14, height: 14 }} /> : undefined}
                  sx={{
                    minWidth: { xs: "31%", sm: 120 },
                    px: 1.5,
                    py: 0.6,
                    justifyContent: "center",
                    borderRadius: "8px",
                    color: "text.secondary",
                    background: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(139,111,42,0.035)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    transition: "all 0.25s ease",

                    "&:hover": {
                      background: "rgba(214,178,94,0.08)",
                      borderColor: "rgba(214,178,94,0.4)",
                      color: "#D6B25E",
                      transform: "translateY(-1px)",
                    }
                  }}
                >
                  {actionLabel(title)} {count || 0}
                </Button>
              </span>
            </Tooltip>
          ))}
        </Stack>
      </Box>

      {isLastIndex && (
        <Box
          ref={infiniteScrollRef}
          justifyContent={"center"}
          display={"flex"}
          flexDirection={"column"}
          sx={{
            px: 1,
            pt: 1,
            pb: { xs: 2, lg: 2.5 },
            borderTop: "1px solid",
            borderColor: "rgba(255,255,255,0.12)",
            background: "linear-gradient(135deg, rgba(214,178,94,0.13), rgba(255,255,255,0.035))",
          }}
        >
          {isGuest ? (
            <Typography variant="caption" color="text.secondary" textAlign="center" fontWeight={700}>
              Sign in to keep exploring more posts.
            </Typography>
          ) : isFetching ? (
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <CircularProgress size={14} />
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                Loading more posts...
              </Typography>
            </Stack>
          ) : !hasMorePosts && (
            <Typography variant="caption" color="text.secondary" textAlign="center" fontWeight={700}>
              no more posts available at the moment
            </Typography>
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

      <PostImagePreviewDialog
        details={details}
        postTitle={post?.post_title}
        postImageSrc={selectedImageSrc || postImageSrc}
        open={openImagePreview}
        onClose={handleCloseImagePreview}
        onDownload={handleDownloadImage}
        detailsLong={detailsLong}
        handleCloseImagePreview={handleCloseImagePreview}
        post={post}
        handleDownloadImage={handleDownloadImage}
        openImagePreview={openImagePreview}
        categoryTags={categoryTags}
        popupMeta={popupMeta}
      />
    </Card>
  );
};

export default CardFeed;
