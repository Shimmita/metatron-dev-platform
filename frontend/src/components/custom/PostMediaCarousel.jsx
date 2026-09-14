import { ArrowBackIosNewRounded, ArrowForwardIosRounded } from "@mui/icons-material";
import { Box, CardActionArea, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getImageMatch } from "../utilities/getImageMatch";

export const getPostMediaItems = (post) => {
  const freeLogoNames = getImageMatch("", true)[0] || [];
  const uploadedMedia = Array.isArray(post?.post_images)
    ? post.post_images
        .filter((image) => image?.url)
        .map((image, index) => ({
          src: image.url,
          description: image.description || "",
          index: image.position || index + 1,
        }))
    : [];

  if (uploadedMedia.length > 0) {
    return uploadedMedia;
  }

  if (!post?.post_url) {
    return [];
  }

  return [
    {
      src: freeLogoNames.includes(post.post_url)
        ? getImageMatch(post.post_url)
        : post.post_url,
      description: "",
      index: 1,
    },
  ];
};

const PostMediaCarousel = ({
  items = [],
  title = "Post media",
  onImageClick,
  isFocusedLayout = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [items.length]);

  if (!items.length) return null;

  const hasMultipleImages = items.length > 1;
  const activeItem = items[activeIndex] || items[0];
  const goToPrevious = (event) => {
    event.stopPropagation();
    setActiveIndex((current) => (current === 0 ? items.length - 1 : current - 1));
  };
  const goToNext = (event) => {
    event.stopPropagation();
    setActiveIndex((current) => (current + 1) % items.length);
  };

  return (
    <Box px={{ xs: 1.25, sm: 2 }} pb={isFocusedLayout ? 1.5 : 2} width="100%">
      {hasMultipleImages && (
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={1} mb={1}>
          <Typography variant="caption" color="text.secondary" fontWeight={800}>
            {items.length} images attached
          </Typography>
          <Typography variant="caption" color="primary.main" fontWeight={900}>
            {activeIndex + 1} of {items.length}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "rgba(139,111,42,0.14)",
          background: "rgba(0,0,0,0.12)",
        }}
      >
        <CardActionArea
          onClick={() => onImageClick?.(activeItem)}
          sx={{
            width: "100%",
            display: "block",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: isFocusedLayout ? { xs: "4 / 3", md: "16 / 10", lg: "16 / 9" } : "4 / 3",
              maxHeight: isFocusedLayout ? { lg: 360, xl: 390 } : "none",
              overflow: "hidden",
              background: "rgba(0,0,0,0.18)",
            }}
          >
            <Box
              component="img"
              src={activeItem.src}
              alt={`${title} ${activeIndex + 1}`}
              loading="lazy"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: isFocusedLayout ? "contain" : "cover",
                display: "block",
                transition: "opacity 0.18s ease",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                px: 1,
                py: 0.35,
                borderRadius: "8px",
                background: "rgba(3,7,18,0.72)",
                color: "#fff",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <Typography variant="caption" fontWeight={900}>
                {activeIndex + 1}/{items.length}
              </Typography>
            </Box>
          </Box>
        </CardActionArea>

        {hasMultipleImages && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              position: "absolute",
              inset: 0,
              px: { xs: 0.5, sm: 0.75 },
              pointerEvents: "none",
            }}
          >
            <Tooltip title="Previous image" arrow>
              <IconButton
                size="small"
                onClick={goToPrevious}
                sx={{
                  pointerEvents: "auto",
                  color: "#fff",
                  background: "rgba(3,7,18,0.62)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  "&:hover": { background: "rgba(3,7,18,0.82)" },
                }}
              >
                <ArrowBackIosNewRounded sx={{ width: 16, height: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Next image" arrow>
              <IconButton
                size="small"
                onClick={goToNext}
                sx={{
                  pointerEvents: "auto",
                  color: "#fff",
                  background: "rgba(3,7,18,0.62)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  "&:hover": { background: "rgba(3,7,18,0.82)" },
                }}
              >
                <ArrowForwardIosRounded sx={{ width: 16, height: 16 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Box>

      {activeItem.description && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 0.75,
            lineHeight: 1.45,
          }}
        >
          {activeItem.description}
        </Typography>
      )}

      {hasMultipleImages && (
        <Stack direction="row" justifyContent="center" spacing={0.75} mt={1}>
          {items.map((item, index) => (
            <Box
              key={`${item.src}-dot-${index}`}
              component="button"
              type="button"
              aria-label={`Show image ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              sx={{
                width: index === activeIndex ? 18 : 7,
                height: 7,
                p: 0,
                border: 0,
                borderRadius: 999,
                cursor: "pointer",
                background: index === activeIndex ? "primary.main" : "rgba(255,255,255,0.22)",
                transition: "width 0.18s ease, background 0.18s ease",
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default PostMediaCarousel;
