import { RefreshRounded } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleShowingSpeedDial } from "../../redux/AppUI";
import CardFeed from "../custom/CardFeed";
import PostDetailsContainer from "../post/PostDetailsContiner";
const FeedDefaultSearch = () => {
  const [postDetailedData, setPostDetailedData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux states
  const { posts, isPostSearch } = useSelector((state) => state.currentPosts);
  const { currentMode } = useSelector((state) => state.appUI);
  const isDarkMode = currentMode === 'dark';

  useEffect(() => {
    dispatch(handleShowingSpeedDial(false));

    return () => {
      dispatch(handleShowingSpeedDial(true));
    };
  }, [dispatch]);

  const handleRefreshHome = () => {
    navigate('/explore');
  };

  return (
    <Box
      sx={{
        overflow: postDetailedData ? { xs: "visible", lg: "hidden" } : "hidden",
        width: "100%",
      }}
    >
      {postDetailedData ? (
        <Box
          sx={{
            p: { xs: 0.5, sm: 1, lg: 0 },
            border: isDarkMode ? '1px solid' : 'none',
            borderColor: 'divider',
            borderRadius: "8px",
            overflowY: { xs: "visible", lg: "hidden" },
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          <PostDetailsContainer
            postDetailedData={postDetailedData}
            setPostDetailedData={setPostDetailedData}
            isFullPageFocused
          />
        </Box>
      ) : (
        <Box
          sx={{
            overflowY: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {/* Refresh Button HUD */}
          {isPostSearch && (
            <Box my={2} display='flex' justifyContent='center'>
              <Button
                size="small"
                variant="contained"
                startIcon={<RefreshRounded />}
                sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 800 }}
                onClick={handleRefreshHome}
              >
                Clear Search
              </Button>
            </Box>
          )}

          {/* Posts Mapping */}
          {posts?.map((post, index) => (
            <Box key={post._id} mb={index === posts?.length - 1 ? 15 : 3}>
              <CardFeed
                post={post}
                setPostDetailedData={setPostDetailedData}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FeedDefaultSearch;
