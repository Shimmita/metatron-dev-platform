import {
  ExpandMoreRounded,
  FavoriteRounded,
  ForumRounded,
  GitHub,
  MoreVertRounded,
  VerifiedRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Checkbox,
  IconButton,
  ListItemAvatar,
  Menu,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { lazy, useCallback, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import dev from "../../images/dev.jpeg";
import { handleUpdateIsPostDetailed } from "../../redux/AppUI";
import { updateCurrentPostDetails } from "../../redux/CurrentPosts";
import AlertReportPost from "../alerts/AlertReportPost";
import PostData from "../data/PostData";
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
const AlertMiniProfileView = lazy(() =>
  import("../alerts/AlertMiniProfileView")
);

const renderSkeleton = () => (
  <>
    <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
    <Skeleton animation="wave" height={10} width="80%" />
  </>
);

const CardFeed = ({ post, setPostDetailedData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [postBelongsCurrentUser, setPostBelongsCurrentUser] = useState(false);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [isFullDescription, setFullDiscription] = useState(false);
  const [openMiniProfileAlert, setOpenMiniProfileAlert] = useState(false);
  const [messageMore, setMessageMore] = useState("");
  const [openAlertReport, setOpenAlertReport] = useState(false);
  const [postWholeReport, setPostWholeReport] = useState("");
  // control more option
  const handleClickMoreVertPost = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // axios default credentials
  axios.defaults.withCredentials = true;
  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);
  const { user } = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  // extract basic current user details
  const { _id, avatar, name, specialisationTitle: title } = user || {};

  // extract the likes and array of liked usersIDs of this post
  const { clicks: post_like_cicks } = post.post_liked || {};

  // extract the counts of github clicks
  const { clicks: post_github_clicks } = post.post_github || {};

  //   extract the counts of comments
  const { count: post_comment_count } = post?.post_comments || {};

  const post_likes = post_like_cicks;

  // for checking if current user  liked the post.
  const currentUserLiked = post?.post_liked?.clickers?.some(
    (clickerId) => clickerId === _id
  );

  // check for if current user cliked github
  const currentUserClickedGithub = post?.post_github?.clickers?.some(
    (clickerId) => clickerId === _id
  );

  // for checking if the current user commented any on the post
  const currentUserCommentented = post?.post_comments?.comments?.some(
    (commentors) => commentors.userId === _id
  );

  // controls the length of description shown for each devices
  const max_description = CustomDeviceIsSmall()
    ? 122
    : CustomLandScape()
    ? 182
    : 219;
  const details = PostData?.details || "";
  const detailsLong = details.length > max_description;

  // current user info
  const userInfo = {
    userId: _id,
    ownerId: post.post_owner.ownerId,
    postId: post._id,
    avatar,
    name,
    title,
  };

  const handleDetailsLength = () =>
    detailsLong ? details.substring(0, max_description) : details;

  // handle the length of owner title for smallest devices
  const handleOccupation = () => {
    const title = post.post_owner.ownertitle.split(" ");
    const first = title[0];
    var second = title[1];

    if (second?.toLowerCase().includes("developer")) {
      second = "Dev";
    }
    if (second?.toLowerCase().includes("engineer")) {
      second = "Eng";
    }

    return first + " " + second;
  };

  // handle the length of owner title for smallest devices
  const handleName = () => {
    const title = post.post_owner.ownername.split(" ");
    const first = title[0];
    var second = title[1].substring(0, 1);

    return first + " " + second;
  };

  // handle scenarios when no profile picture
  const handleNoProfilePicture = () => {
    const title = post.post_owner.ownername.split(" ");
    const first = title[0].substring(0, 1);
    var second = title[1].substring(0, 1);

    return first + "" + second;
  };

  // check if the current userID matches the ownerID of the post
  // means belongs to current user thus no need for options menu
  useEffect(() => {
    const handlePostBelongsCurrentUser = () => {
      const postID = `${post.post_owner?.ownerId}`;
      const currentUserID = `${user._id}`;

      if (postID === currentUserID) {
        setPostBelongsCurrentUser(true);
      } else {
        setPostBelongsCurrentUser(false);
      }
    };

    handlePostBelongsCurrentUser();
  }, [user._id, post.post_owner?.ownerId]);

  // handle user clicking like button
  const handlePostLikes = () => {
    let message = "liked your post";
    let minimessage = post?.post_title?.substring(0, 30) + "...";

    // add the above properties to the userInfo that is being sent to the backend
    userInfo.message = message;
    userInfo.minimessage = minimessage;
    // add users to the liked clickers group and increment the value of clicks
    setIsLoadingRequest(true);
    // performing post request
    axios
      .put(
        `http://localhost:5000/metatron/api/v1/posts/update/likes`,
        userInfo,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the returned post object to reflect in the global redux
        if (res.data.reaction === "liked") {
          dispatch(updateCurrentPostDetails(res.data.post));
        }
        if (res.data.reaction === "disliked") {
          // update the returned post object to reflect in the global redux

          dispatch(updateCurrentPostDetails(res.data.post));
        }
      })
      .catch(async (err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoadingRequest(false);
      });
  };

  // handle github counts updates
  const handleGithubClicks = () => {
    let message = "viewed your github link";
    let minimessage = post?.post_title?.substring(0, 30) + "...";

    // add the above properties to the userInfo that is being sent to the backend
    userInfo.message = message;
    userInfo.minimessage = minimessage;
    // add users to the liked clickers group and increment the value of clicks
    setIsLoadingRequest(true);
    // performing post request
    axios
      .put(
        `http://localhost:5000/metatron/api/v1/posts/update/github`,
        userInfo,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the returned post object to reflect in the global redux
        dispatch(updateCurrentPostDetails(res.data));
      })
      .catch(async (err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoadingRequest(false);
      });
  };

  // handle showing full post description
  const handleFullDiscription = () => {
    setFullDiscription((prev) => !prev);
  };

  // handle the image incorporated in the post for some is free logo
  // other is custom uploaded to the cloud
  const handlePostImagePresent = () => {
    // if the url name of the image present in the logo names use getImage fn
    const arrayFreeLogoName = getImageMatch("", true)[0];
    if (arrayFreeLogoName?.includes(post?.post_url)) {
      // they used free logo images, return the matching image using getImage
      return getImageMatch(post?.post_url);
    }

    // the user possibly uploaded the image to cloud thus return the url incorporated
    return post?.post_url;
  };

  // handle showing post comments layout like full post details plus comments
  const handleShowFullPostComments = () => {
    // true is post details in redux to avoid speed dial show in details view
    dispatch(handleUpdateIsPostDetailed(true));

    // populate with current post for details
    setPostDetailedData(post);
  };

  // handle display of miniprofile
  const handleMiniProfileView = useCallback(() => {
    setOpenMiniProfileAlert(true);
  }, []);

  return (
    <React.Fragment>
      <Box
        mb={2}
        sx={{
          border:
            (CustomDeviceIsSmall() || CustomDeviceTablet()) && isDarkMode
              ? "1px solid"
              : "1px solid",
          borderColor:
            (CustomDeviceIsSmall() || CustomDeviceTablet()) && isDarkMode
              ? "divider"
              : "divider",
          opacity: openMenu && !isDarkMode ? "0.8" : undefined,
        }}
        className={
          CustomDeviceTablet() || CustomDeviceIsSmall()
            ? "shadow p-2 rounded"
            : "rounded p-1"
        }
      >
        <Card elevation={0}>
          <CardHeader
            sx={{ ml: 1, p: 0 }}
            avatar={
              <React.Fragment>
                {isLoadingRequest ? (
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    width={40}
                    height={40}
                  />
                ) : (
                  <ListItemAvatar onClick={handleMiniProfileView}>
                    <Avatar
                      src={dev}
                      variant="rounded"
                      sx={{
                        backgroundColor: isDarkMode ? "#99CEF9" : "#1976D2",
                        width: 50,
                        height: 50,
                      }}
                      alt={post?.post_owner?.ownername?.split(" ")[0]}
                    >
                      {handleNoProfilePicture()}
                    </Avatar>
                  </ListItemAvatar>
                )}
              </React.Fragment>
            }
            action={
              !isLoadingRequest && (
                <Stack>
                  <Box
                    flexDirection={"row"}
                    display={"flex"}
                    mt={1}
                    alignItems={"center"}
                  >
                    <Typography variant="body2" mr={2}>
                      {getElapsedTime(post?.createdAt)}
                    </Typography>

                    {!postBelongsCurrentUser && (
                      <Tooltip title="more" arrow>
                        <IconButton
                          size="small"
                          aria-label="more"
                          onClick={handleClickMoreVertPost}
                        >
                          <MoreVertRounded
                            color="primary"
                            sx={{ width: 20, height: 20 }}
                          />
                        </IconButton>
                      </Tooltip>
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
                        ownerId={post?.post_owner?.ownerId}
                        currentUserNetwork={user?.network}
                        ownerName={post?.post_owner?.ownername}
                        setMessageMore={setMessageMore}
                        handleCloseMenu={handleCloseMenu}
                        setOpenAlertReport={setOpenAlertReport}
                        post={post}
                        setPostWhole={setPostWholeReport}
                      />
                    </Menu>
                  </Box>

                  {/* if post edited */}
                  {post?.post_edited && (
                    <Box display={"flex"} justifyContent={"flex-end"} pr={2}>
                      <Typography color={"text.secondary"} variant="caption">
                        Edited
                      </Typography>
                    </Box>
                  )}
                </Stack>
              )
            }
            title={
              isLoadingRequest ? (
                <Skeleton
                  animation="wave"
                  height={10}
                  width="80%"
                  style={{ marginBottom: 6 }}
                />
              ) : (
                <Box display="flex" alignItems="center" mt={1} gap={1}>
                  <Typography
                    fontWeight="bold"
                    variant={CustomDeviceIsSmall() ? "body2" : "body1"}
                  >
                    {CustomDeviceSmallest()
                      ? handleName()
                      : `${post?.post_owner.ownername}`}
                  </Typography>
                  <VerifiedRounded
                    color="primary"
                    sx={{ width: 18, height: 18 }}
                  />
                </Box>
              )
            }
            subheader={
              isLoadingRequest ? (
                <Skeleton animation="wave" height={10} width="40%" />
              ) : (
                <Box>
                  {/*occupation title */}
                  <Typography variant="body2">
                    {CustomDeviceSmallest()
                      ? handleOccupation()
                      : `${post?.post_owner.ownertitle}`}
                  </Typography>
                  {/* skills */}
                  <Typography
                    variant="body2"
                    display={"flex"}
                    alignItems={"center"}
                  >
                    {post?.post_owner.ownerskills[0]} |{" "}
                    {post?.post_owner.ownerskills[1]} |{" "}
                    {post?.post_owner.ownerskills[2]}
                  </Typography>
                  {/* location */}
                  <Typography
                    variant="body2"
                    display={"flex"}
                    alignItems={"center"}
                  >
                    {CustomCountryName(post?.post_location.country)} |{" "}
                    {post?.post_location.state}{" "}
                  </Typography>
                </Box>
              )
            }
          />

          {isLoadingRequest ? (
            <Box mt={1}>
              <Skeleton
                sx={{ height: 350, borderRadius: "10px" }}
                animation="wave"
                variant="rectangular"
              />
            </Box>
          ) : (
            <Box>
              <CardContent>
                <Box mb={2} width={"100%"}>
                  <Box mb={1}>
                    {/* post specialisation */}
                    <Typography
                      variant="body2"
                      textAlign={"center"}
                      fontWeight={"bold"}
                    >
                      {post?.post_category.main}
                    </Typography>
                  </Box>

                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={2}
                  >
                    {/* title of the post */}
                    <Typography variant="body2" fontWeight={"bold"}>
                      {post?.post_title}
                    </Typography>
                  </Box>
                </Box>
                <CardActionArea
                  onClick={handleFullDiscription}
                  disabled={!detailsLong}
                >
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    width={"100%"}
                  >
                    <Typography
                      variant={"body2"}
                      maxWidth={
                        CustomLandscapeWidest()
                          ? "90%"
                          : CustomDeviceTablet()
                          ? "95%"
                          : CustomLandScape()
                          ? "93%"
                          : "98%"
                      }
                    >
                      {!isFullDescription && handleDetailsLength()}
                      {detailsLong && !isFullDescription && (
                        <Typography
                          variant="body2"
                          component={"span"}
                          fontWeight={"bold"}
                          color={"primary"}
                        >
                          ...{" "}
                          <ExpandMoreRounded sx={{ width: 20, height: 20 }} />
                        </Typography>
                      )}
                      {isFullDescription && details}
                    </Typography>
                  </Box>
                </CardActionArea>
              </CardContent>
              <Box display={"flex"} justifyContent={"center"} width={"100%"}>
                <Box
                  sx={{
                    width: "92%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {/* smart 300,350 */}
                  <LazyLoadImage
                    src={handlePostImagePresent()}
                    alt=""
                    height={CustomDeviceScreenSize()}
                    width={
                      CustomDeviceIsSmall()
                        ? "100%"
                        : CustomDeviceTablet()
                        ? "95%"
                        : "92%"
                    }
                    style={{
                      objectFit: "fill",
                      borderRadius: 10,
                      border: "1px solid",
                      borderColor: "grey",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {isLoadingRequest ? (
            renderSkeleton()
          ) : (
            <Box
              display="flex"
              p={1}
              justifyContent="space-around"
              alignItems="center"
            >
              {[
                {
                  icon: (
                    <FavoriteRounded
                      sx={{ width: 23, height: 23 }}
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
                      sx={{ width: 21, height: 21 }}
                      color={currentUserClickedGithub ? "primary" : undefined}
                    />
                  ),
                  count: post_github_clicks,
                  title: "Github",
                  onClick: handleGithubClicks,
                },
                {
                  icon: (
                    <ForumRounded
                      sx={{ width: 21, height: 21 }}
                      color={currentUserCommentented ? "primary" : undefined}
                    />
                  ),
                  count: post_comment_count,
                  title: "comment",
                  onClick: handleShowFullPostComments,
                },
              ].map(({ icon, count, title, onClick }) => (
                <Box display="flex" alignItems="center" key={title}>
                  <Tooltip title={title} arrow>
                    <Checkbox
                      onChange={onClick}
                      icon={icon}
                      checkedIcon={icon}
                      disabled={isLoadingRequest}
                    />
                  </Tooltip>
                  <Typography
                    fontWeight="bold"
                    variant="body2"
                    color="text.secondary"
                  >
                    {count}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Card>
      </Box>

      {/* show alert report a post  */}
      {openAlertReport && (
        <AlertReportPost
          openAlertReport={openAlertReport}
          setOpenAlertReport={setOpenAlertReport}
          post={postWholeReport}
          currentUser={user}
        />
      )}

      {/* snackbar showing results, specially cardfeed more response */}
      {messageMore && <SnackbarConnect message={messageMore} />}

      {/* alert for showing user miniprofile details by passing the post ownerID */}
      <AlertMiniProfileView
        openAlert={openMiniProfileAlert}
        setOpenAlert={setOpenMiniProfileAlert}
        userId={post.post_owner.ownerId}
      />
    </React.Fragment>
  );
};

export default CardFeed;
