import { FavoriteRounded, ForumRounded, GitHub, MoreVertRounded, RefreshOutlined, Remove } from "@mui/icons-material";
import { Box, Button, CardActionArea, CircularProgress, FormHelperText, IconButton, Menu, Tooltip } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleShowingSpeedDial } from "../../../redux/AppUI";
import { updateMessageConnectRequest } from "../../../redux/CurrentSnackBar";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import { getImageMatch } from "../../utilities/getImageMatch";
import { PostCardMore } from "./PostCardMore";

export default function UserPostCardDrawer({
  post,
  setPostDetailedData,
  setShowDeleteAlert,
  setDeletePostID,
  setIsPostEditMode,
  setIsPostDetailedDrawer,
  isFavorite=false,
  setIsDeleting=false,
  handleFetchFavorites,
  isLastIndex=false,
  hasMorePosts,
  isFetching=false
}) {

  // more menu
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    // control more option
    const handleClickMoreVertPost = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

  // get redux states
  const { user } = useSelector((state) => state.currentUser);

  // checks whether post belongs to the currently logged in user
  const isMyPost = user?._id === post?.post_owner?.ownerId;

  const dispatch = useDispatch();
  //  update the post-detailed data with the current iterated post
  // will lift-up the state and make the data available to root parent
  const handlePostDetails = () => {
    // set is post detailed drawer true
    setIsPostDetailedDrawer(true)
    // populate the post detailed data
     setPostDetailedData(post);
    // false showing of the speed dial for tabs and small devices
    dispatch(handleShowingSpeedDial(false));
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

  // handle the updating of the post of the current user
  const handleUpdateMyPost = () => {
    // set is edit or update  mode to true
    setIsPostEditMode(true);
     // populate the post detailed data
     setPostDetailedData(post);
    // false showing of the speed dial for tabs and small devices
    dispatch(handleShowingSpeedDial(false));
  };

  // handle deleting of the post belonging to the current user
  const handleDeleteMyPost = () => {
    // show delete alert confirmation in parent component
    setShowDeleteAlert(true);

    // update the current post for deletion
    setDeletePostID(post?._id);
  };


    // handle remove from the favorites
    const handleRemoveFromFavorites=()=>{
        setIsDeleting(true);
        // delete the post by passing userId and postdID for further
        // backend validation
        axios.delete(
            `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/favorite/delete/${user?._id}/${post?._id}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            if (res?.data) {
              // update redux snack notification message
              dispatch(updateMessageConnectRequest(res.data));
              // re-fetch all the favorite posts
              handleFetchFavorites()
            }
          })
          .catch((err) => {
            if (err?.code === "ERR_NETWORK") {
              dispatch(
                updateMessageConnectRequest(
                  "server unreachable"
                )
              );
              return;
            }
            dispatch(updateMessageConnectRequest(err?.response?.data));
          })
          .finally(() => {
            // set is fetching to false
            setIsDeleting(false);
            //set showing delete alert false
    
            setShowDeleteAlert(false);
          });
      }

  return (
    <Card 
    elevation={0}
     className="rounded m-1" 
      sx={{ border:'1px solid',
       color:'divider' }}>
        {/* more icon shown when post belongs to the user
        provides updating and delete features to the post
         */}

        {isMyPost && (
        <Box 
        width={'100'}
        justifyContent={'flex-end'}
        display={'flex'}>
        <IconButton
          size="small"
          aria-label="more"
          onClick={handleClickMoreVertPost}
        >
          <MoreVertRounded
          sx={{ 
            width:15,height:15
           }}
            color="primary"
          />
        </IconButton>
        </Box>
         )}

         {/* is favorite page and is not my post show clear from favorites */}
         {isFavorite && !isMyPost && (
        <Box 
        width={'100'}
        justifyContent={'flex-end'}
        p={1}
        display={'flex'}>
        <Tooltip title='remove'>
        <IconButton
        className="rounded-5"
          onClick={handleRemoveFromFavorites}
        >
          <Remove
          sx={{ 
            border:'1px solid',
            borderColor:'divider',
            width:15,height:15
           }}
            color="primary"
          />
        </IconButton>
        </Tooltip>
        </Box>
         )}
         
        {/* image */}
      <CardContent>
      <CardActionArea onClick={handlePostDetails}>
        <Box
        width={'100'}
        mb={1}
        display={'flex'}
        justifyContent={'center'}>
        <CardMedia
          component="img"
          className="rounded"
          sx={{ maxHeight: 60, maxWidth:60}}
          image={handlePostImagePresent()}
          alt=""
        />
        </Box>
  
          {/* post title */}
          <Box display={"flex"} justifyContent={"center"}>
            <Typography
              variant="caption"
              fontWeight={"bold"}
              textAlign={"center"}
              sx={{ color:'text.primary' }}
            >
              {post?.post_title.substring(0, !CustomDeviceIsSmall() ? 15:undefined)}
            </Typography>
          </Box>
          {/* post subcategory */}
          <Box display={"flex"} justifyContent={"center"} >
            <Typography 
            variant="caption" 
            textAlign={"center"}
            sx={{ color:'text.primary' }}
            >
              {post?.post_category.main?.substring(0, !CustomDeviceIsSmall() ?17:undefined)}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
            sx={{
        overflowX: "auto",
        // Hide scrollbar for Chrome, Safari and Opera
        "&::-webkit-scrollbar": {
          display: "none",
        },
        // Hide scrollbar for IE, Edge and Firefox
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
          >
            {/* post likes */}
            <Box display={"flex"} alignItems={"center"}  gap={"2px"}>
              <FavoriteRounded 
              color="primary"
               sx={{ width: 15, height: 15 }} />{" "}
              <Typography
                fontWeight={"bold"}
                color={"text.secondary"}
                variant="caption"
              >
                {post?.post_liked?.clicks} 
              </Typography>
            </Box>

            {/* github visits */}
            <Box
             mx={1}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={"2px"}
            >
              <GitHub 
              color="primary"
               sx={{ width: 15, height: 15 }} />{" "}
              <Typography
                fontWeight={"bold"}
                color={"text.secondary"}
                variant="caption"
              >
                {post?.post_github?.clicks} 
              </Typography>
            </Box>

            {/* post comments */}
            <Box 
            display={"flex"} 
            alignItems={"center"} 
            gap={"2px"}>
              <ForumRounded color="primary" sx={{ width: 15, height: 15 }} />{" "}
              <Typography
                fontWeight={"bold"}
                color={"text.secondary"}
                variant="caption"
              >
                {post?.post_comments?.count} 
              </Typography>
            </Box>
          </Box>
      </CardActionArea>

       {/* show load more button if is the last index */}
          {isLastIndex && (
            <Box 
            justifyContent={'center'}
            display={'none'}
            flexDirection={'column'}
            mt={1}
            >
            <Button 
            startIcon={isFetching ? <CircularProgress size={14}/>:<RefreshOutlined/>}
            size="small"
            className="fw-bold"
            onClick={handleFetchFavorites}
            disabled={isFetching}
            sx={{ fontSize:'x-small' }}
            >
              Load More
            </Button>
  
            {/* displayed when no more posts are available from the backend */}
            {!hasMorePosts && (
              <Box 
              justifyContent={'center'}
              display={'flex'}>
              <FormHelperText>
              -- no more posts --
              </FormHelperText>
              </Box>
              )}
              </Box>
            )}

        </CardContent>

      {/* delete and update buttons if post belongs to the current user */}
      {/* more options */}
      {isMyPost && (
        <Menu
         anchorEl={anchorEl}
         open={openMenu}
         onClose={handleCloseMenu}
         MenuListProps={{ "aria-labelledby": "more-button" }}
         anchorOrigin={{ vertical: "top", horizontal: "right" }}
         transformOrigin={{ vertical: "top", horizontal: "right" }}
       >
       <PostCardMore 
       handleUpdateMyPost={handleUpdateMyPost} 
       handleDeleteMyPost={handleDeleteMyPost}
       />
       </Menu>
      )}
     
    </Card>
  );
}
