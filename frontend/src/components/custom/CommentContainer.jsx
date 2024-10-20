import { Box, Typography } from "@mui/material";
import React, { lazy } from "react";
import devImage from "../../images/dev.jpeg";
const UserComment = lazy(() => import("./UserComment"));

export default function CommentContainer({ mode }) {
  // array simulation of user comments
  const comments = Array.from({ length: 10 });
  return (
    <Box>
      <small style={{ fontSize: "small" }}>
        {comments.length > 0 ? (
          comments.map((_, index) => (
            <UserComment image={devImage} key={index} />
          ))
        ) : (
          <Box mt={5}>
            <Typography
              textAlign={"center"}
              variant="body2"
              color={"text.secondary"}
            >
              No Comments
            </Typography>
          </Box>
        )}
      </small>
    </Box>
  );
}
