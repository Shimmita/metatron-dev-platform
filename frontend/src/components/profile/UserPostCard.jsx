import { FavoriteRounded, ForumRounded, GitHub } from "@mui/icons-material";
import { Box, Button, CardActionArea, Stack, Divider } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleShowingSpeedDial } from "../../redux/AppUI";
import { getImageMatch } from "../utilities/getImageMatch";

export default function UserPostCard({
  post,
  setPostDetailedData,
  setShowDeleteAlert,
  setDeletePostID,
  deletePostID,
  setIsPostEditMode,
}) {
  const { user } = useSelector((state) => state.currentUser);
  const isMyPost = user?._id === post?.post_owner?.ownerId;
  const dispatch = useDispatch();

  const handlePostDetails = async () => {
    await setPostDetailedData(post);
    dispatch(handleShowingSpeedDial(false));
  };

  const handlePostImagePresent = () => {
    const arrayFreeLogoName = getImageMatch("", true)[0];
    if (arrayFreeLogoName?.includes(post?.post_url)) {
      return getImageMatch(post?.post_url);
    }
    return post?.post_url;
  };

  return (
    <Card 
      elevation={0} 
      sx={{ 
        mt: 1,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) => `0 12px 30px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}`,
          borderColor: "primary.main",
        }
      }}
    >
      <CardActionArea onClick={handlePostDetails} sx={{ p: 0.5 }}>
        <CardMedia
          component="img"
          sx={{ 
            height: 140, 
            borderRadius: "10px",
            objectFit: "cover",
            filter: "brightness(0.9)",
          }}
          image={handlePostImagePresent()}
          alt={post?.post_title}
        />
        <CardContent sx={{ px: 1, pb: 1 }}>
          {/* Title & Category Stack */}
          <Stack spacing={0.5} alignItems="center">
            <Typography
              variant="body2"
              fontWeight={700}
              textAlign="center"
              sx={{ color: "text.primary", lineHeight: 1.3 }}
            >
              {post?.post_title}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: "primary.main", 
                textTransform: "uppercase", 
                fontWeight: 600,
                letterSpacing: "0.05em"
              }}
            >
              {post?.post_category?.main}
            </Typography>
          </Stack>

          <Divider sx={{ my: 1.5, opacity: 0.1 }} />

          {/* Stats Row */}
          <Box
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            width="100%"
          >
            <StatItem icon={<FavoriteRounded sx={{ fontSize: 16 }} />} value={post?.post_liked?.clicks} color="#EF4444" />
            <StatItem icon={<GitHub sx={{ fontSize: 16 }} />} value={post?.post_github?.clicks} color="text.primary" />
            <StatItem icon={<ForumRounded sx={{ fontSize: 16 }} />} value={post?.post_comments?.count} color="info.main" />
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Admin Actions */}
      {isMyPost && (
        <Box 
          sx={{ 
            p: 1, 
            pt: 0, 
            display: "flex", 
            justifyContent: "center", 
            gap: 1 
          }}
        >
          <Button
            size="small"
            disabled={!!deletePostID}
            onClick={(e) => {
              e.stopPropagation();
              setIsPostEditMode(true);
              handlePostDetails();
            }}
            sx={{ 
              fontSize: "0.7rem", 
              color: "primary.main",
              "&:hover": { background: "rgba(20,210,190,0.08)" }
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            disabled={!!deletePostID}
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteAlert(true);
              setDeletePostID(post?._id);
            }}
            sx={{ 
              fontSize: "0.7rem", 
              color: "warning.main",
              "&:hover": { background: "rgba(245,158,11,0.08)" }
            }}
          >
            Delete
          </Button>
        </Box>
      )}
    </Card>
  );
}

// Internal Helper for cleaner stats
const StatItem = ({ icon, value, color }) => (
  <Box display="flex" alignItems="center" gap="5px">
    <Box sx={{ color: color, display: "flex" }}>{icon}</Box>
    <Typography fontWeight={600} color="text.secondary" variant="caption">
      {value || 0}
    </Typography>
  </Box>
);