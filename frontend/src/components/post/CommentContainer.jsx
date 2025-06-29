import { Box } from "@mui/material";
import React from "react";
import CommentUser from "./CommentUser";
export default function CommentContainer({ post_comments,postId,setPostDetailedData }) {
  return (
    <Box  >
      <small style={{ fontSize: "small" }}>
        {post_comments?.map((comment) => (
            <CommentUser comment={comment} postId={postId} key={comment?._id} setPostDetailedData={setPostDetailedData} />
          ))}
      </small>
    </Box>
  );
}
