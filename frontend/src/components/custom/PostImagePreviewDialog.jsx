import { CloseRounded, DownloadRounded, PersonRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Dialog,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { appColors, appGradients } from "../../utils/colors";

/* ─── Reusable pill badge ──────────────────────────────────────────── */
const Pill = ({ label, teal = false }) => (
  <Box
    sx={{
      px: 1.2,
      py: "3px",
      borderRadius: "20px",
      background: teal ? "rgba(20,210,190,0.12)" : "rgba(255,255,255,0.07)",
      border: `1px solid ${teal ? "rgba(20,210,190,0.28)" : appColors.border}`,
      cursor: "default",
      transition: "all 0.2s",
      "&:hover": {
        background: teal ? "rgba(20,210,190,0.2)" : "rgba(255,255,255,0.12)",
      },
    }}
  >
    <Typography sx={{ fontSize: 11, color: teal ? appColors.primary : appColors.textSecondary }}>
      {label}
    </Typography>
  </Box>
);

/* ─── Glass icon button (floating controls) ───────────────────────── */
const GlassBtn = ({ icon, label, onClick }) => (
  <Tooltip title={label} arrow>
    <IconButton
      onClick={onClick}
      size="small"
      sx={{
        width: 36,
        height: 36,
        borderRadius: "10px",
        border: `1px solid ${appColors.border}`,
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)",
        color: appColors.textSecondary,
        transition: "all 0.2s",
        "&:hover": {
          background: "rgba(20,210,190,0.15)",
          borderColor: appColors.primary,
          color: appColors.textPrimary,
        },
      }}
    >
      {icon}
    </IconButton>
  </Tooltip>
);

/* ─── Subtle divider ───────────────────────────────────────────────── */
const Divider = () => (
  <Box sx={{ height: "1px", background: appColors.divider, my: 2 }} />
);

/* ─── Section label ────────────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <Typography
    sx={{
      fontSize: 9.5,
      letterSpacing: "0.16em",
      color: appColors.textMuted,
      textTransform: "uppercase",
      mb: 1,
    }}
  >
    {children}
  </Typography>
);

/* ══════════════════════════════════════════════════════════════════════
   PostImagePreviewDialog
   Props:
     openImagePreview, handleCloseImagePreview, handleDownloadImage,
     postImageSrc, post, details, detailsLong, popupMeta, categoryTags
══════════════════════════════════════════════════════════════════════ */
export default function PostImagePreviewDialog({
  openImagePreview,
  handleCloseImagePreview,
  handleDownloadImage,
  postImageSrc,
  post,
  details,
  detailsLong,
  popupMeta = [],
  categoryTags = [],
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));   // extra fine‑tuning

  /* ── Responsive image height ── */
  const imageHeight = isSmall ? "45vh" : isMobile ? "55vh" : "100%";

  return (
    <Dialog
      open={openImagePreview}
      onClose={handleCloseImagePreview}
      fullScreen
      PaperProps={{
        sx: {
          background: appColors.bgDark,                // deep, consistent base
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          boxShadow: "none",
          m: 0,
          borderRadius: 0,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* ════ IMAGE AREA ─────────────────────────────────────────── */}
        <Box
          sx={{
            flex: isMobile ? "none" : 1.65,
            width: isMobile ? "100%" : "auto",
            height: imageHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 1.5, sm: 2, md: 4 },
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ambient glow (hidden on small screens for performance) */}
          {!isSmall && postImageSrc && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${postImageSrc})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(70px) saturate(0.3)",
                opacity: 0.12,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Actual image */}
          {postImageSrc ? (
            <Box
              component="img"
              src={postImageSrc}
              alt={post?.post_title || "Post image"}
              sx={{
                position: "relative",
                zIndex: 1,
                maxWidth: "100%",
                maxHeight: "100%",
                borderRadius: "16px",
                objectFit: "contain",
                boxShadow: `0 32px 80px rgba(0,0,0,0.65), 0 0 30px ${appColors.glow}`,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.015)",
                },
              }}
            />
          ) : (
            <Typography
              sx={{
                color: appColors.textMuted,
                fontSize: 14,
                textAlign: "center",
              }}
            >
              No image available
            </Typography>
          )}
        </Box>

        {/* ════ DETAILS PANEL ──────────────────────────────────────── */}
        <Box
          sx={{
            width: isMobile ? "100%" : 400,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            borderLeft: isMobile ? "none" : `1px solid ${appColors.border}`,
            borderTop: isMobile ? `1px solid ${appColors.border}` : "none",
            background: `linear-gradient(180deg, ${appColors.bgCard}, rgba(255,255,255,0.01))`,
            backdropFilter: "blur(30px)",
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: 3 },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(20,210,190,0.2)",
              borderRadius: 2,
            },
          }}
        >
          {/* Header */}
          <Box sx={{ px: { xs: 2, md: 2.5 }, pt: 2.5, pb: 0 }}>
            {/* Eyebrow */}
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
              <Box
                sx={{
                  width: 14,
                  height: 1.5,
                  bgcolor: appColors.primary,
                  borderRadius: 1,
                }}
              />
              <Typography
                sx={{
                  fontSize: 9.5,
                  letterSpacing: "0.18em",
                  color: appColors.primary,
                  textTransform: "uppercase",
                }}
              >
                Post Preview
              </Typography>
            </Box>

            {/* Title */}
            <Typography
              sx={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 17,
                fontWeight: 700,
                color: appColors.textPrimary,
                lineHeight: 1.3,
                letterSpacing: "0.01em",
              }}
            >
              {post?.post_title || "Untitled"}
            </Typography>

            {/* Description */}
            {details && (
              <Typography
                sx={{
                  mt: 1.2,
                  fontSize: 12.5,
                  color: appColors.textSecondary,
                  lineHeight: 1.75,
                }}
              >
                {detailsLong ? `${details.slice(0, 200)}…` : details}
              </Typography>
            )}

            {/* Meta tags */}
            {popupMeta.length > 0 && (
              <Box display="flex" gap={0.7} flexWrap="wrap" mt={1.5}>
                {popupMeta.map((item) => (
                  <Pill key={item} label={item} teal />
                ))}
              </Box>
            )}
          </Box>

          <Divider />

          {/* Author */}
          <Box sx={{ px: { xs: 2, md: 2.5 } }}>
            <SectionLabel>Author</SectionLabel>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar
                src={post?.post_owner?.owneravatar}
                alt={post?.post_owner?.ownername}
                sx={{
                  width: 42,
                  height: 42,
                  border: `1.5px solid rgba(20,210,190,0.35)`,
                  boxShadow: `0 0 0 3px rgba(20,210,190,0.08)`,
                }}
              >
                <PersonRounded />
              </Avatar>
              <Box minWidth={0}>
                <Typography
                  sx={{
                    fontFamily: "'Inter', 'Poppins', sans-serif",
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: appColors.textPrimary,
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {post?.post_owner?.ownername || "Unknown"}
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: appColors.textSecondary, mt: 0.2 }}>
                  {post?.post_owner?.ownertitle || ""}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Category tags */}
          {categoryTags.length > 0 && (
            <>
              <Divider />
              <Box sx={{ px: { xs: 2, md: 2.5 } }}>
                <SectionLabel>Related topics</SectionLabel>
                <Box display="flex" gap={0.7} flexWrap="wrap">
                  {categoryTags.map((tag) => (
                    <Pill key={tag} label={`#${tag}`} />
                  ))}
                </Box>
              </Box>
            </>
          )}

          {/* Flexible space to push buttons to bottom on mobile */}
          <Box flex={1} />

          {/* Bottom action buttons (only on mobile) */}
          {isMobile && (
            <Box
              display="flex"
              gap={1}
              sx={{
                px: 2,
                py: 2,
                borderTop: `1px solid ${appColors.divider}`,
                mt: 2,
              }}
            >
              <Box
                component="button"
                onClick={handleDownloadImage}
                sx={{
                  flex: 1,
                  py: 1.2,
                  borderRadius: "10px",
                  border: `1px solid ${appColors.border}`,
                  background: "rgba(255,255,255,0.05)",
                  color: appColors.textSecondary,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.8,
                  transition: "all 0.2s",
                  "&:hover": {
                    background: "rgba(20,210,190,0.1)",
                    borderColor: "rgba(20,210,190,0.35)",
                    color: appColors.primary,
                  },
                }}
              >
                <DownloadRounded sx={{ width: 16, height: 16 }} />
                Download
              </Box>
              <Box
                component="button"
                onClick={handleCloseImagePreview}
                sx={{
                  flex: 1,
                  py: 1.2,
                  borderRadius: "10px",
                  border: "1px solid rgba(239,68,68,0.25)",
                  background: "rgba(239,68,68,0.08)",
                  color: "rgba(239,68,68,0.9)",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.8,
                  transition: "all 0.2s",
                  "&:hover": {
                    background: "rgba(239,68,68,0.16)",
                    borderColor: "rgba(239,68,68,0.5)",
                    color: "#EF4444",
                  },
                }}
              >
                <CloseRounded sx={{ width: 16, height: 16 }} />
                Close
              </Box>
            </Box>
          )}
        </Box>

        {/* ════ FLOATING CONTROLS (desktop only) ════════════════════ */}
        {!isMobile && (
          <Box
            sx={{
              position: "absolute",
              top: 20,
              right: 416, // detail panel width (400) + 16px padding
              display: "flex",
              gap: 1,
              zIndex: 10,
            }}
          >
            <GlassBtn
              icon={<DownloadRounded sx={{ width: 18, height: 18 }} />}
              label="Download"
              onClick={handleDownloadImage}
            />
            <GlassBtn
              icon={<CloseRounded sx={{ width: 18, height: 18 }} />}
              label="Close"
              onClick={handleCloseImagePreview}
            />
          </Box>
        )}
      </Box>
    </Dialog>
  );
}