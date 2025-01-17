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
  Divider,
  IconButton,
  Menu,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dev from "../../images/dev.jpeg";
import { updateCurrentPostDetails } from "../../redux/CurrentPosts";
import PostData from "../data/PostData";
import CustomCountryName from "../utilities/CustomCountryName";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceScreenSize from "../utilities/CustomDeviceScreenSize";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import CardFeedMore from "./CardFeedMore";

const renderSkeleton = () => (
  <>
    <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
    <Skeleton animation="wave" height={10} width="80%" />
  </>
);

const CardFeed = ({ post }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [postBelongsCurrentUser, setPostBelongsCurrentUser] = useState(false);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const [isLoadingRequest, setIsLoadingRequest] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFullDescription, setFullDiscription] = useState(false);

  // axios default credentials
  axios.defaults.withCredentials = true;
  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);
  const { user } = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  // extract basic current user details
  const {
    _id,
    avatar,
    name,
    specialisationTitle: title,
    country,
    county: state,
  } = user || {};

  // extract the likes and array of liked usersIDs of this post
  const { clicks: post_clicks } = post.post_liked || {};

  const post_likes = post_clicks;
  const currentUserLiked = post.post_liked.clickers?.some(
    (clickerId) => clickerId === _id
  );

  const details = PostData?.details || "";
  const detailsLong = details.length > 350;

  // handle country length to only two names 
  const handleCountryName = (country) => {
    const parent = country.split(" ");
    const parentName =
      parent.length < 4 ? parent[1] : `${parent[1]} ${parent[2]}`;

    return parentName;
  };
  // current user info
  const userInfo = {
    userId: _id,
    ownerId: post.post_owner.ownerId,
    postId: post._id,
    avatar,
    name,
    title,
    country: handleCountryName(country),
    state,
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingRequest(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (path) => () => navigate(path);

  const handleClickMoreVertPost = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleDetailsLength = () =>
    detailsLong ? details.substring(0, 350) : details;

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
    let minimessage = details.substring(0, 40) + " ...";

    // add the above properties to the userInfo that is being sent to the backend
    userInfo.message = message;
    userInfo.minimessage = minimessage;
    // add users to the liked clickers group and increment the value of clicks
    setIsUploading(true);
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

  return (
    <>
      {isDarkMode && <Divider component="div" className="mb-3" />}
      <Card
        style={{
          border: openMenu && isDarkMode ? "1px solid gray" : undefined,
          opacity: openMenu && !isDarkMode ? "0.8" : undefined,
        }}
        elevation={0}
        className="w-100 shadow mb-4 p-2 rounded"
      >
        <CardHeader
          sx={{ padding: 0, margin: 0 }}
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
                <IconButton onClick={handleNavigate("users/profile")}>
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
              )}
            </React.Fragment>
          }
          action={
            !isLoadingRequest && (
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
                  2d
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
                    ownerId={post.post_owner?.ownerId}
                    currentUserNetwork={user?.network}
                    ownerName={post.post_owner.ownername}
                  />
                </Menu>
              </Box>
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
                    : `${post.post_owner.ownername}`}
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
                    : `${post.post_owner.ownertitle}`}
                </Typography>
                {/* skills */}
                <Typography variant="body2">
                  {post.post_owner.ownerskills[0]} |{" "}
                  {post.post_owner.ownerskills[1]} |{" "}
                  {post.post_owner.ownerskills[2]}
                </Typography>
                {/* location */}
                <Typography variant="body2">
                  {CustomCountryName(post.post_location.country)} |{" "}
                  {post.post_location.state}{" "}
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
                    {post.post_category.main}
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
                  <Typography variant="body2">{post.post_title}</Typography>

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
                <Typography variant={"body2"}>
                  {!isFullDescription && handleDetailsLength()}
                  {detailsLong && !isFullDescription && " ..."}
                  {isFullDescription && details}
                </Typography>
              </CardActionArea>
            </CardContent>
            <Image
              src={PostData.image}
              alt="image"
              style={{
                width: "100%",
                maxHeight: CustomDeviceScreenSize(),
                objectFit: "fill",
                padding: window.screen.availWidth > 1300 ? "5px" : undefined,
                borderRadius: "10px",
                filter: openMenu ? "grayscale(100%)" : undefined,
              }}
            />
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
                icon: <GitHub sx={{ width: 21, height: 21 }} />,
                count: "50k",
                title: "Github",
              },
              {
                icon: <ForumRounded sx={{ width: 21, height: 21 }} />,
                count: "300",
                title: "comment",
                onClick: () => navigate("/posts/details"),
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
        )}
      </Card>
    </>
  );
};

export default CardFeed;
