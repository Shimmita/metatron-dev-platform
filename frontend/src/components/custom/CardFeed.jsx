import {
  FavoriteRounded,
  ForumRounded,
  GitHub,
  GradeOutlined,
  InfoRounded,
  MoreVertRounded,
  RefreshRounded,
  VerifiedRounded
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  FormHelperText,
  IconButton,
  ListItemAvatar,
  Menu,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import { handleUpdateIsPostDetailed } from "../../redux/AppUI";
import { resetClearCurrentPosts, updateCurrentPostDetails, updateCurrentPosts } from "../../redux/CurrentPosts";
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
   isLastIndex=false,
   setPageNumber,
   pageNumber,
   errorMessage, 
   setErrorMessage
  }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [postBelongsCurrentUser, setPostBelongsCurrentUser] = useState(false);
  const [isProcessingPost, setIsProcessingPost] = useState(false);
  const [isFullDescription, setIsFullDescription] = useState(false);
  const [openMiniProfileAlert, setOpenMiniProfileAlert] = useState(false);
  const [messageMore, setMessageMore] = useState("");
  const [openAlertReport, setOpenAlertReport] = useState(false);
  const [postWholeReport, setPostWholeReport] = useState("");
  const[openAlertGeneral,setOpenAlertGeneral]=useState(false)
  // control more option
  const handleClickMoreVertPost = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // track progress of fetching more data
  const [isFetching,setIsFetching]=useState(false)
  const [hasMorePosts,setHasMorePosts]=useState(true)


  // redux states
  const { currentMode } = useSelector((state) => state.appUI);
  // update is dark const
  const isDarkMode=currentMode==='dark'
  const { user } = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  // extract basic current user details
  const { _id, avatar, name, specialisationTitle: title, country, county } = user || {};

  // extract the likes and array of liked usersIDs of this post
  const { clicks: post_like_cicks } = post.post_liked || {};

  // extract the counts of github clicks
  const { clicks: post_github_clicks, link:post_github_link } = post.post_github || {};

  //   extract the counts of comments
  const { count: post_comment_count } = post?.post_comments || {};

  const post_likes = post_like_cicks;

  // for checking if current user  liked the post.
  const currentUserLiked = post?.post_liked?.clickers?.some(
    (clickerId) => clickerId === _id
  );

  // check for if current user clicked github
  const currentUserClickedGithub = post?.post_github?.clickers?.some(
    (clickerId) => clickerId === _id
  );

  // for checking if the current user commented any on the post
  const currentUserCommented = post?.post_comments?.comments?.some(
    (commentors) => commentors.userId === _id
  );

  // controls the length of description shown for each devices
  const max_description = CustomDeviceIsSmall() ?  125 : 250;

  const details = post?.post_body || "";
  const detailsLong = details.length > max_description;

  // current user info
  const userInfo = {
    userId: _id,
    ownerId: post.post_owner.ownerId,
    postId: post._id,
    avatar,
    name,
    title,
    country,
    county
  };

  const handleDetailsLength = () =>
    detailsLong ? details.substring(0, max_description) : details;

  // handle the length of owner title for smallest devices
  const handleOccupation = () => {
    const title = post.post_owner.ownertitle.split(" ");
    const first = title[0];
    let second = title[1];

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
    let second = title[1].substring(0, 1);

    return first + " " + second;
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
    setIsProcessingPost(true);
    // performing post request
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/update/likes`,
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
        setOpenAlertGeneral(true)
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        setIsProcessingPost(false);
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
    setIsProcessingPost(true);
    // performing post request
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/update/github`,
        userInfo,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // update the returned post object to reflect in the global redux
        dispatch(updateCurrentPostDetails(res.data));

        // navigate to github page
      })
      .catch(async (err) => {
        console.log(err);
        setOpenAlertGeneral(true)
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        setIsProcessingPost(false);
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


  // handle fetching of more data when load more button clicked
  const handleFetchMoreData=()=>{
    // if are no more posts, reset to page 1 and refresh content
    if (!hasMorePosts) {
      setPageNumber(1)
      dispatch(resetClearCurrentPosts())
    }
    // fetching to true
    setIsFetching(true)
    // axios api call to fetch more data
    axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/all?page=${pageNumber}&limit=10`, {
        withCredentials: true,
      })
      .then((res) => {
        // update the redux of current post
        if (res?.data) {
          // more data update redux
          if (res.data.length>0) {
          dispatch(updateCurrentPosts([...posts,...res.data]));  
          }else{
            // are no more posts from the backend
            setHasMorePosts(false)
          }
        } 

        // update the page number for the next fetch
        setPageNumber((prev)=>prev+1)
        
      })
      .catch((err) => {
        //  user login session expired show logout alert
        if (err?.response?.data.login) {
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "server unreachable"
          );
          return;
        }
        setErrorMessage(err?.response.data);
        setOpenAlertGeneral(true)
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
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

  return (
    <React.Fragment>
      <Box
      className="rounded"
        mb={isLastIndex ? 10 :3}
        sx={{
          border:isDarkMode && "1px solid",
          borderColor: "divider",
          opacity: openMenu && !isDarkMode ? "0.8" : undefined,
        }}
      >
        <Card elevation={0} className="rounded">
          <CardHeader
            sx={{ ml: 1, p: 0 }}
            avatar={
            <ListItemAvatar onClick={handleMiniProfileView}>
            <Tooltip arrow title='profile'>
              <Avatar
                src={post?.post_owner?.owneravatar}
                variant="rounded"
                sx={{
                  width: 50,
                  height: 50,
                  color: "white",
                }}
                alt={''}
              >
              </Avatar>
              </Tooltip>
            </ListItemAvatar>
            }
            action={
              <Stack>
                <Box
                  flexDirection={"row"}
                  display={"flex"}
                  mt={1}
                  alignItems={"center"}
                >
                  {/* created time */}
                  <Typography pt={0.5} variant="caption" mr={postBelongsCurrentUser ? 2:1}>
                    {getElapsedTime(post?.createdAt)}
                  </Typography>


                  {/* more icon  */}
                  {!postBelongsCurrentUser && (
                    <Tooltip title="more" arrow>
                      <IconButton
                        size="small"
                        aria-label="more"
                        onClick={handleClickMoreVertPost}
                      >
                        <MoreVertRounded
                          color="primary"
                          sx={{ width: 18, height: 17 }}
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
                      setPostWhole={setPostWholeReport}
                      post={post}
                    />
                  </Menu>
                </Box>

                {/* if post edited */}
                {post?.post_edited && (
                  <Box display={"flex"} justifyContent={"flex-end"} mr={4}>
                    <Typography 
                    color={"text.secondary"} 
                    variant="caption"
                    
                    >
                      edited
                    </Typography>
                  </Box>
                )}
              </Stack>
            }
            title={
              <Box display="flex" alignItems="center" mt={1} gap={1}>
                <Typography
                  fontWeight="bold"
                  variant={'body2'}
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
            }
            subheader={
              <Box>
                {/*occupation title */}
                <Typography variant="body2">
                  {CustomDeviceSmallest()
                    ? handleOccupation()
                    : `${post?.post_owner.ownertitle}`}
                </Typography>
                {/* location */}
                <Typography
                  variant="body2"
                  display={"flex"}
                  alignItems={"center"}
                >
                {post?.post_location.state} | {CustomCountryName(post?.post_location.country)}{" "}
                </Typography>
                {/* skills */}
                <Box display={"flex"} mt={0.5}>
                  <AvatarGroup max={post?.post_owner.ownerskills.length}>
                    {/* loop through the skills and their images matched using custom fn */}
                    {post?.post_owner.ownerskills?.map((skill) => (
                      <Tooltip title={skill} key={skill} arrow>
                        <Avatar
                          alt={skill}
                          className={!isDarkMode && 'border'}
                          sx={{ 
                            width: 24,
                             height: 24,
                            }}
                          src={getImageMatch(skill)}
                        />
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </Box>
              </Box>
            }
          />

          <Box mt={1}>
            <CardContent>
              <Box mb={1.5} width={"100%"}>
                <Box mb={1}>
                  {/* post specialization */}
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
                  <GradeOutlined
                    sx={{
                      width: 18,
                      height: 18,
                      color: isDarkMode ? "yellow" : "orange",
                    }}
                  />
                  {/* title of the post */}
                  <Typography variant="body2">
                    {post?.post_title}
                  </Typography>

                  <GradeOutlined
                    sx={{
                      width: 18,
                      height: 18,
                      color: isDarkMode ? "yellow" : "orange",
                    }}
                  />
                </Box>
              </Box>

              <CardActionArea
                onClick={handleFullDescription}
                disabled={!detailsLong}
              >
                <Box display={"flex"} 
                justifyContent={"center"}
                width={"100%"}
                flexDirection={'column'}
                >
                  {/* times added to favorite */}
                  {post?.favorite_count>0 && 
                  <Box 
                  display={'flex'}
                  justifyContent={'center'}
                  >
                  <FormHelperText className={isDarkMode ? 'text-info':'text-success'}>
                  {post?.favorite_count} added this to their favorite
                  </FormHelperText>
                  </Box>}

                  {/* post details */}
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
                </Box>
              </CardActionArea>
            </CardContent>
            <Box 
            px={1}
            display={"flex"} 
            flexDirection={'column'}
            justifyContent={"center"} 
            width={"100%"}>
              {/* image container */}
              <Box
                sx={{
                  width: "100%",
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
                    borderColor: "gray",
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
                  <React.Fragment>
                    {isProcessingPost ? (
                      <CircularProgress size={20} />
                    ) : (
                      <FavoriteRounded
                        sx={{ width: 18, height: 18 }}
                        color={currentUserLiked ? "primary" : undefined}
                      />
                    )}
                  </React.Fragment>
                ),
                count: post_likes,
                title: "like",
                onClick: handlePostLikes,
              },
              {
                icon: (
                  <React.Fragment>
                    {isProcessingPost ? (
                      <CircularProgress size={20} />
                    ) : (
                      <GitHub
                        sx={{ width: 18, height: 18 }}
                        color={currentUserClickedGithub ? "primary" : undefined}
                      />
                    )}
                  </React.Fragment>
                ),
                count: post_github_clicks,
                title: "Github",
                onClick: handleGithubClicks,
              },
              {
                icon: (
                  <React.Fragment>
                    {isProcessingPost ? (
                      <CircularProgress size={20} />
                    ) : (
                      <ForumRounded
                        sx={{ width: 18, height: 18 }}
                        color={currentUserCommented ? "primary" : undefined}
                      />
                    )}
                  </React.Fragment>
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
                    disabled={isProcessingPost || (title==='Github' && !post_github_link)}
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

        {/* show button fetch more if its the last item */}
        {isLastIndex && (
          <Box 
          justifyContent={'center'}
          display={'flex'}
          flexDirection={'column'}
          p={1}
          sx={{ 
            borderTop:isDarkMode && '1px solid',
            borderColor: "divider",
           }}
          >
          <Button 
          startIcon={isFetching ? <CircularProgress size={14}/>:<RefreshRounded/>}
          size="small"
          className="fw-bold"
          onClick={handleFetchMoreData}
          disabled={isFetching}
          >
            {hasMorePosts ? "Load More":"Refresh Now"}
            </Button>

            {/* displayed when no more posts are available from the backend */}
            {!hasMorePosts && (
              <Box 
              justifyContent={'center'}
              display={'flex'}>
              <FormHelperText>
              -- no more posts from the backend --
              </FormHelperText>
              </Box>
            )}
          </Box>
        )}
      </Box>

       {/* alert general of the error message */}
        {errorMessage && (
          <AlertGeneral
          title={'something went wrong!'}
          message={errorMessage}
          isError={true}
          openAlertGeneral={openAlertGeneral}
          setOpenAlertGeneral={setOpenAlertGeneral}
          setErrorMessage={setErrorMessage}
          defaultIcon={<InfoRounded/>}
          />
        )}

      {/* show alert report a post  */}
      {openAlertReport && (
        <AlertReportPost
          openAlertReport={openAlertReport}
          setOpenAlertReport={setOpenAlertReport}
          post={postWholeReport}
          currentUser={user}
        />
      )}

      {/* snackbar showing results, specially card-feed more response */}
      {messageMore && <SnackbarConnect message={messageMore} />}

      {/* alert for showing user mini-profile details by passing the post ownerID */}
      {openMiniProfileAlert && (
        <AlertMiniProfileView
        openAlert={openMiniProfileAlert}
        setOpenAlert={setOpenMiniProfileAlert}
        userId={post.post_owner.ownerId}
      />
      )}
    </React.Fragment>
  );
};

export default CardFeed;
