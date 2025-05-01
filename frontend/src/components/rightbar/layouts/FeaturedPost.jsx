import { FavoriteRounded, Flag, ForumRounded, GitHub } from "@mui/icons-material";
import {
  Avatar,
  Box,
  CardActionArea,
  Divider,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getImageMatch } from "../../utilities/getImageMatch";

function FeaturedPost({ post }) {
  const navigate=useNavigate()

    // navigate to post details routed page, alse close the drawer notification
    const handleNavigatePostDetailsRoute = () => {
     ;
  
      // navigate
      navigate("posts/details/" + post?._id);
    };

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
   
  return (
    <Box mb={2}>
      <Tooltip title="view this post" arrow>
      <CardActionArea onClick={handleNavigatePostDetailsRoute}>
    <Box display={'flex'} justifyContent={'space-around'} alignItems={'center'}>
      {/* image preview of the post */}
      <Box>
    <Avatar alt="" src={handlePostImagePresent()} variant="rounded" sx={{ width:125, height:125 }}/>
      </Box>

          <Stack gap={1} justifyContent={'center'}>
          <Typography variant="body2" fontWeight={'bold'} textAlign={'center'}>{post?.post_title}</Typography>
          <Typography variant="body2"  textAlign={'center'}>  {post?.post_category.main}
          </Typography>
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            gap={1}
            pr={1}
          >
          
            <Box
              sx={{
                pe: 1,
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                color: "text.secondary",
                "& svg": {
                  m: 1,
                },
              }}
            >
              {/* likes count */}
              <FavoriteRounded sx={{ width: 14, height: 14 }} />
              <Typography variant="caption">
                {post?.post_liked?.clicks}{" "}
              </Typography>

              {/* divider */}
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                className="px-1"
                component={"div"}
              />

              {/* github counts */}
              <GitHub sx={{ width: 14, height: 14 }} />
              <Typography variant="caption">
                {" "}
                {post?.post_github?.clicks}{" "}
              </Typography>

              {/* divider */}
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                className="px-1"
                component={"div"}
              />

              {/* comments count */}
              <ForumRounded sx={{ width: 14, height: 14 }} />
              <Typography variant="caption" className="pe-1">
                {post?.post_comments?.count}
              </Typography>

              {/* divider */}
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                className="px-1"
                component={"div"}
              />

              {/* flags or number reports */}
              <Flag sx={{ width: 14, height: 14 }} />
              <Typography variant="caption" className="pe-1">
                {post?.report_count}
              </Typography>
            </Box>
            </Box>
          </Stack>
    </Box>
    </CardActionArea>
    <Divider className="p-1"/>
    </Tooltip>
    </Box>


  );
}

export default React.memo(FeaturedPost);
