import { Box } from "@mui/material";
import React from "react";
import CommentUser from "./CommentUser";
export default function CommentContainer({ post_comments }) {
  return (
    <Box>
      
      <small style={{ fontSize: "small" }}>
        {post_comments &&
          post_comments?.map((comment, index) => (
            <CommentUser comment={comment} key={index} />
          ))}
      </small>
    </Box>
  );
}
