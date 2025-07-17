import {
  Close,
  Edit,
  FavoriteRounded,
  ForumRounded,
  GitHub,
  MoreVertRounded,
  UpdateRounded,
  VerifiedRounded,
  WbIncandescentRounded,
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
  Checkbox,
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
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";
import AlertReportPost from "../alerts/AlertReportPost";
import CardFeedMore from "../custom/CardFeedMore";
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

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
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

  // axios default credentials
  axios.defaults.withCredentials = true;

  // redux states
  const { currentMode } = useSelector(
    (state) => state.appUI
  );
   const isDarkMode=currentMode==='dark'

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
  const currentUserCommented =
    postDetailedData?.post_comments?.comments?.some(
      (commentors) => commentors.userId === _id
    );

    
  // controls the length of description shown for each devices
  const max_description = CustomDeviceIsSmall()? 122: CustomLandScape() ? 182  : 220;
  const details = postDetailedData?.post_body || "";
  const detailsLong = details.length > max_description;

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
    const title = postDetailedData?.post_owner?.ownername?.split(" ");
    const first = title[0];
    let second = title[1][0]

    return first + " " + second;
  };

  // check if the current userID matches the ownerID of the post
  // means belongs to current user thus no need for options menu
  useLayoutEffect(() => {
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

        setMessageResponse(err?.response.data);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  // handle showing full post description
  const handleFullDescription = () => {
    setIsFullDescription((prev) => !prev);
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

        setMessageResponse(err?.response.data);
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
 
  // handle max text width
  const handleMaxTextWidth=()=>{
    if (CustomLandscapeWidest()) {
      return "90%"
    }else if(CustomDeviceTablet()){
      return "95%"
    } else if(CustomLandScape()){
      return "93%"
    }

    return "98%"
  }
  
  // handle image width
    const handleImageWidth=()=>{
      if(CustomDeviceIsSmall()){
        return "100%"
      } else if(CustomDeviceTablet()){
        return "95%"
      }else{
        return "92%"
      } 
    }

  return (
    <React.Fragment>
      {/* display error message */}
      {messageResponse && (
        <Collapse in={messageResponse || false}>
          <Alert
            severity="info"
            onClose={handleClose}
            className="rounded mb-1"
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
      className="rounded"
        style={{
          opacity: openMenu && !isDarkMode ? "0.8" : undefined,
          borderColor:'divider'
        }}
        elevation={0}
      >
        <CardHeader
          sx={{ padding: 0, margin: 0 }}
          avatar={
              <IconButton onClick={() => setOpenMiniProfileAlert(true)}>
                <Avatar
                  // src={post.post_owner.owner-avatar}
                  src={postDetailedData?.post_owner?.owneravatar}
                  variant="rounded"
                  sx={{
                    width: 50,
                    height: 50,
                  }}
                  alt=""
                >
                </Avatar>
              </IconButton>
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
                variant="caption"
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
                      sx={{ width: 18, height: 18 }}
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
                  setOpenAlertReport={setOpenAlertReport}
                  setPostWhole={setPostWholeReport}
                  handleCloseMenu={handleCloseMenu}
                />
              </Menu>
            </Box>
          }
          title={
            <Box display="flex" alignItems="center" mt={1} gap={1}>
              <Typography fontWeight="bold" variant={"body2"}>
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
                {/* post specialization */}
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

            {isPostEditMode ? (
              <Box
                display={"flex"}
                justifyContent={"center"}
                width={"100%"}
                flexDirection={"column"}
              >
                <Search
                  className="rounded"
                  sx={{
                    mr: 2,
                    border: "1px solid",
                    borderColor: "divider",
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
                    variant="text"
                    color="success"
                    sx={{
                      borderRadius: 5,
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                  >
                    complete updating
                  </Button>
                </Box>
              </Box>
            ) : (
              <CardActionArea
                onClick={handleFullDescription}
                disabled={!detailsLong}
              >
                <Box display={"flex"} justifyContent={"center"} width={"100%"}>
                  <Typography
                  color={isDarkMode && 'text.secondary'}
                  sx={{ fontSize:'small' }}
                    variant={"body2"}
                    maxWidth={handleMaxTextWidth()}
                  >
                    {!isFullDescription && handleDetailsLength()}
                    {detailsLong && !isFullDescription && (
                      <Typography
                        variant="body2"
                        component={"span"}
                        fontWeight={"bold"}
                        color={"primary"}
                        sx={{ fontSize:'small' }}
                      >
                        &nbsp; more
                      </Typography>
                    )}
                    {isFullDescription && details}
                  </Typography>
                </Box>
              </CardActionArea>
            )}
          </CardContent>

          {/* display image or log if is not in edit mode */}

          {!isPostEditMode && (
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
                  width={handleImageWidth()}
                  style={{
                    objectFit: "fill",
                    borderRadius: 10,
                    border: "1px solid",
                    borderColor: "grey",
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* when post is not in edit mode display the like,git and comment */}
        {!isPostEditMode && (
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
                  sx={{ width: 18, height: 18 }}
                    color={currentUserLiked ? "primary" : undefined}
                  />
                ),
                count: post_likes,
                title: "like",
                onClick: handlePostLikes,
              },
              {
                icon: <GitHub sx={{ width: 18, height: 18 }} />,
                count: post_github_clicks,
                title: "Github",
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
