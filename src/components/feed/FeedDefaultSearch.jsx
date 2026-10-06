import { ArticleRounded, RefreshRounded, SearchRounded } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
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
  const { posts } = useSelector((state) => state.currentPosts);
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
            px: { xs: 1, sm: 1.25, lg: 0 },
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          <Box
            sx={{
              mt: { xs: 1.5, md: 2 },
              mb: 1.5,
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.10)",
              background: isDarkMode
                ? "linear-gradient(135deg, rgba(5,5,5,0.96), rgba(18,18,18,0.92) 58%, rgba(214,178,94,0.12))"
                : "rgba(255,255,255,0.92)",
              p: { xs: 1.25, sm: 1.5 },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1.5}>
              <Box minWidth={0}>
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <SearchRounded sx={{ color: "primary.main", fontSize: 18 }} />
                  <Typography variant="body1" fontWeight={900}>
                    Search Results
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Focused posts matching the current technical query.
                </Typography>
              </Box>
              <Button
                size="small"
                variant="contained"
                startIcon={<RefreshRounded />}
                sx={{ flexShrink: 0 }}
                onClick={handleRefreshHome}
              >
                Clear
              </Button>
            </Stack>
          </Box>

          {/* Posts Mapping */}
          {posts?.map((post, index) => (
            <Box key={post._id} mb={index === posts?.length - 1 ? 15 : 3}>
              <CardFeed
                post={post}
                setPostDetailedData={setPostDetailedData}
              />
            </Box>
          ))}

          {(!posts || posts.length === 0) && (
            <Box
              sx={{
                minHeight: 260,
                borderRadius: "8px",
                border: "1px solid rgba(214,178,94,0.16)",
                background: isDarkMode ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.88)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 2,
              }}
            >
              <Stack alignItems="center" spacing={1} maxWidth={360}>
                <ArticleRounded sx={{ color: "primary.main", fontSize: 32 }} />
                <Typography variant="body2" fontWeight={900}>
                  No matching posts yet
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Try another search or return to Explore for live platform signals.
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FeedDefaultSearch;
