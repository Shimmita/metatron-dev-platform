import {
  FavoriteRounded,
  ForumRounded,
  GitHub,
  MoreVertRounded,
  VerifiedRounded,
  WbIncandescentRounded,
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
  Menu,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { lazy, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";
import dev from "../../images/dev.jpeg";
import CardFeedMore from "../custom/CardFeedMore";
import PostData from "../data/PostData";
import CustomCountryName from "../utilities/CustomCountryName";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceScreenSize from "../utilities/CustomDeviceScreenSize";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import { getElapsedTime } from "../utilities/getElapsedTime";
import { getImageMatch } from "../utilities/getImageMatch";
const AlertMiniProfileView = lazy(() =>
  import("../alerts/AlertMiniProfileView")
);

const PostDetailsFeed = ({ postDetailedData, setPostDetailedData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [postBelongsCurrentUser, setPostBelongsCurrentUser] = useState(false);
  const openMenu = Boolean(anchorEl);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFullDescription, setFullDiscription] = useState(false);
  const [openMiniProfileAlert, setOpenMiniProfileAlert] = useState(false);

  // axios default credentials
  axios.defaults.withCredentials = true;
  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);
  const { user } = useSelector((state) => state.currentUser);
  // extract basic current user details
  const { _id, avatar, name, specialisationTitle: title } = user || {};

  // extract the likes and array of liked usersIDs of this post
  const { clicks: post_clicks } = postDetailedData?.post_liked || {};

  //   extract the counts of comments
  const { count: post_comment_count } = postDetailedData?.post_comments || {};

  // extract the counts of github clicks
  const { clicks: post_github_clicks } = postDetailedData.post_github || {};

  const post_likes = post_clicks;

  // for checking if current user  liked the post.
  const currentUserLiked = postDetailedData?.post_liked?.clickers?.some(
    (clickerId) => clickerId === _id
  );

  // for checking if the current user commented any on the post
  const currentUserCommentented =
    postDetailedData?.post_comments?.comments?.some(
      (commentors) => commentors.userId === _id
    );

  // controls the length of description shown for each devices
  const max_description = CustomDeviceIsSmall()
    ? 122
    : CustomLandScape()
    ? 182
    : 220;
  const details = PostData?.details || "";
  const detailsLong = details.length > max_description;

  // get coduntry name
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

  const handleDetailsLength = () =>
    detailsLong ? details.substring(0, max_description) : details;

  // handle the length of owner title for smallest devices
  const handleOccupation = () => {
    const title = postDetailedData?.post_owner?.ownertitle?.split(" ");
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
    const title = postDetailedData?.post_owner?.ownername?.split(" ");
    const first = title[0];
    var second = title[1].substring(0, 1);

    return first + " " + second;
  };

  // handle scenarios when no profile picture
  const handleNoProfilePicture = () => {
    const title = postDetailedData?.post_owner?.ownername?.split(" ");
    const first = title[0].substring(0, 1);
    var second = title[1].substring(0, 1);

    return first + "" + second;
  };

  // check if the current userID matches the ownerID of the post
  // means belongs to current user thus no need for options menu
  useEffect(() => {
    const handlePostBelongsCurrentUser = () => {
      const postID = `${postDetailedData?.post_owner?.ownerId}`;
      const currentUserID = `${user._id}`;

      if (postID === currentUserID) {
        setPostBelongsCurrentUser(true);
      } else {
        setPostBelongsCurrentUser(false);
      }
    };

    handlePostBelongsCurrentUser();
  }, [user._id, postDetailedData?.post_owner?.ownerId, postDetailedData]);

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
        `http://localhost:5000/metatron/api/v1/posts/update/likes`,
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
          setErrorMessage("Server Unreachable");
          return;
        }

        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        setIsUploading(false);
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
    if (arrayFreeLogoName?.includes(postDetailedData?.post_url)) {
      // they used free logo images, return the matching image using getImage
      return getImageMatch(postDetailedData?.post_url);
    }

    // the user possibly uploaded the image to cloud thus return the url incorporated
    return postDetailedData?.post_url;
  };

  return (
    <React.Fragment>
      <Card
        style={{
          border: openMenu && isDarkMode ? "1px solid gray" : undefined,
          opacity: openMenu && !isDarkMode ? "0.8" : undefined,
        }}
        elevation={0}
      >
        <CardHeader
          sx={{ padding: 0, margin: 0 }}
          avatar={
            <React.Fragment>
              <IconButton onClick={() => setOpenMiniProfileAlert(true)}>
                <Avatar
                  // src={post.post_owner.owneravatar}
                  src={dev}
                  variant="rounded"
                  sx={{
                    backgroundColor: isDarkMode ? "#99CEF9" : "#1976D2",
                    width: 50,
                    height: 50,
                  }}
                  alt=""
                >
                  {handleNoProfilePicture()}
                </Avatar>
              </IconButton>
            </React.Fragment>
          }
          action={
            <Box
              flexDirection={"row"}
              display={"flex"}
              mt={1}
              alignItems={"center"}
            >
              <Typography
                className={postBelongsCurrentUser && "me-3"}
                variant="body2"
              >
                {getElapsedTime(postDetailedData?.createdAt)}
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
                  ownerId={postDetailedData.post_owner?.ownerId}
                  currentUserNetwork={user?.network}
                  ownerName={postDetailedData.post_owner.ownername}
                />
              </Menu>
            </Box>
          }
          title={
            <Box display="flex" alignItems="center" mt={1} gap={1}>
              <Typography fontWeight="bold" variant={"body1"}>
                {CustomDeviceSmallest()
                  ? handleName()
                  : `${postDetailedData.post_owner.ownername}`}
              </Typography>
              <VerifiedRounded color="primary" sx={{ width: 18, height: 18 }} />
            </Box>
          }
          subheader={
            <Box>
              {/*occupation title */}
              <Typography variant="body2">
                {CustomDeviceSmallest()
                  ? handleOccupation()
                  : `${postDetailedData.post_owner.ownertitle}`}
              </Typography>
              {/* skills */}
              <Typography variant="body2">
                {postDetailedData.post_owner.ownerskills[0]} |{" "}
                {postDetailedData.post_owner.ownerskills[1]} |{" "}
                {postDetailedData.post_owner.ownerskills[2]}
              </Typography>
              {/* location */}
              <Typography variant="body2">
                {country} | {postDetailedData.post_location.state}{" "}
              </Typography>
            </Box>
          }
        />

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
                  {postDetailedData.post_category.main}
                </Typography>
              </Box>

              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={2}
              >
                <WbIncandescentRounded
                  sx={{
                    width: 18,
                    height: 18,
                    color: isDarkMode ? "yellow" : "orange",
                  }}
                />
                {/* title of the post */}
                <Typography variant="body2">
                  {postDetailedData.post_title}
                </Typography>

                <WbIncandescentRounded
                  sx={{
                    width: 18,
                    height: 18,
                    color: isDarkMode ? "yellow" : "orange",
                  }}
                />
              </Box>
            </Box>
            <CardActionArea
              onClick={handleFullDiscription}
              disabled={!detailsLong}
            >
              <Box display={"flex"} justifyContent={"center"} width={"100%"}>
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
                      &nbsp; more
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
                    ? "95%"
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
              icon: <GitHub sx={{ width: 21, height: 21 }} />,
              count: post_github_clicks,
              title: "Github",
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
            },
          ].map(({ icon, count, title, onClick }) => (
            <Box display="flex" alignItems="center" key={title}>
              <Tooltip title={title} arrow>
                <Checkbox
                  onChange={onClick}
                  icon={icon}
                  checkedIcon={icon}
                  disabled={isUploading}
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
      </Card>

      {/* alert for showing user miniprofile details by passing the post ownerID */}
      <AlertMiniProfileView
        openAlert={openMiniProfileAlert}
        setOpenAlert={setOpenMiniProfileAlert}
        userId={postDetailedData.post_owner.ownerId}
      />
    </React.Fragment>
  );
};

export default PostDetailsFeed;
