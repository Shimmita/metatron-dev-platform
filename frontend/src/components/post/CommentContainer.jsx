import { ForumRounded } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import CommentUser from "./CommentUser";
export default function CommentContainer({ post_comments,postId,setPostDetailedData }) {
  const commentsCount = post_comments?.length || 0;

  return (
    <Box
      sx={{
        overflow: "visible",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        sx={{
          px: 1,
          py: 1,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <ForumRounded sx={{ color: "primary.main", fontSize: 18 }} />
          <Typography fontWeight={900} variant="body2">
            Discussion
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
        </Typography>
      </Stack>

      {commentsCount > 0 ? (
        <Stack
          spacing={0}
          sx={{
            mt: 0,
          }}
        >
          {post_comments?.map((comment) => (
            <CommentUser comment={comment} postId={postId} key={comment?._id} setPostDetailedData={setPostDetailedData} />
          ))}
        </Stack>
      ) : (
        <Box sx={{ px: 2, py: 3, textAlign: "center" }}>
          <Typography variant="body2" fontWeight={800}>
            No comments yet
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Start the discussion with a clear insight or question.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
