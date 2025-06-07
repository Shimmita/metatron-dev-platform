import { FavoriteRounded, ForumRounded, GitHub } from "@mui/icons-material";
import { Box, Button, CardActionArea } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleShowingSpeedDial } from "../../../redux/AppUI";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import { getImageMatch } from "../../utilities/getImageMatch";

export default function UserPostCardDrawer({
  post,
  setPostDetailedData,
  setShowDeleteAlert,
  setDeletePostID,
  deletePostID,
  setIsPostEditMode,
  setIsPostDetailedDrawer
}) {
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

  return (
    <Card elevation={0} className="rounded"  sx={{ border:'1px solid', color:'divider' }}>
      <CardActionArea onClick={handlePostDetails}>
        <CardMedia
          component="img"
          className="rounded"
          sx={{ height: 100}}
          image={handlePostImagePresent()}
          alt="image"
        />
        <CardContent>
          {/* post title */}
          <Box display={"flex"} justifyContent={"center"}>
            <Typography
              variant="body2"
              fontWeight={"bold"}
              textAlign={"center"}
              sx={{ color:'text.primary' }}
            >
              {post?.post_title}
            </Typography>
          </Box>
          {/* post subcategory */}
          <Box display={"flex"} justifyContent={"center"} mt={1}>
            <Typography 
            variant="caption" 
            textAlign={"center"}
            sx={{ color:'text.primary' }}
            >
              {post?.post_category.main?.substring(0, 20)}
            </Typography>
          </Box>
          <Box
            mt={1}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
            sx={{ 
              borderTop:'1px solid',
              borderBottom:'1px solid',
              color:'divider'
             }}
          >
            {/* post likes */}
            <Box display={"flex"} alignItems={"center"} gap={"4px"}>
              <FavoriteRounded color="info" sx={{ width: 15, height: 15 }} />{" "}
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
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={"4px"}
            >
              <GitHub color="info" sx={{ width: 15, height: 15 }} />{" "}
              <Typography
                fontWeight={"bold"}
                color={"text.secondary"}
                variant="caption"
              >
                {post?.post_github?.clicks}
              </Typography>
            </Box>

            {/* post comments */}
            <Box display={"flex"} alignItems={"center"} gap={"4px"}>
              <ForumRounded color="info" sx={{ width: 15, height: 15 }} />{" "}
              <Typography
                fontWeight={"bold"}
                color={"text.secondary"}
                variant="caption"
              >
                {post?.post_comments?.count}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>

      {/* delete and update buttons if post belongs to the current user */}
      {isMyPost && (
        <Box display={"flex"} justifyContent={"center"} mb={1} width={"100%"}>
          <Box
            width={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={CustomDeviceIsSmall() ? 2 : 5}
          >
            {/* update button */}
            <Button
              sx={{
                fontSize: "x-small",
                fontWeight: "bold",
                borderRadius: 2,
                textTransform: "lowercase",
              }}
              size="small"
              onClick={handleUpdateMyPost}
              disabled={deletePostID}
              disableElevation
              color="success"
            >
              update
            </Button>
            {/* delete button */}
            <Button
            disableElevation
              sx={{
                fontSize: "x-small",
                fontWeight: "bold",
                borderRadius: 2,
                textTransform: "lowercase",
              }}
              size="small"
              disabled={deletePostID}
              onClick={handleDeleteMyPost}
              color="warning"
            >
              delete
            </Button>
          </Box>
        </Box>
      )}
    </Card>
  );
}
