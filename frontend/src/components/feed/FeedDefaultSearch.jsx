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
  const { currentMode, isDefaultSpeedDial } = useSelector((state) => state.appUI);
  const isDarkMode = currentMode === 'dark';

  /* ─── THE FIX: Wrap dispatch in useEffect ─── */
  useEffect(() => {
    // Only hide it if it's currently showing
    if (isDefaultSpeedDial) {
      dispatch(handleShowingSpeedDial(false));
    }

    // OPTIONAL: Bring it back when the user leaves this page
    return () => {
      dispatch(handleShowingSpeedDial(true));
    };
  }, [dispatch]); // Empty dependency array means this runs once on mount

  const handleRefreshHome = () => {
    navigate('/explore');
  };

  return (
    <Box sx={{ height: '85vh', overflow: 'hidden' }}>
      {postDetailedData ? (
        <Box
          sx={{
            height: "85vh",
            p: 1,
            border: isDarkMode ? '1px solid' : 'none',
            borderColor: 'divider',
            overflowY: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          <PostDetailsContainer
            postDetailedData={postDetailedData}
            setPostDetailedData={setPostDetailedData}
          />
        </Box>
      ) : (
        <Box
          sx={{
            height: "85vh",
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
