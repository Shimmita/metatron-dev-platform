import { Box, Typography } from "@mui/material";
import React from "react";
import "../../../profile/UserPost.css";
import UserPostCard from "./MyPostCard";

function MyPostContainer() {
  // simulate array number of post
  const items = Array.from({ length: 20 });
  return (
    <Box className="post-card-container">
      {items.length > 0 ? (
        items.map((_, index) => (
          <Box key={index}>
            <UserPostCard />
          </Box>
        ))
      ) : (
        <Box width={"100%"}>
          <Typography
            mt={"8rem"}
            textAlign={"center"}
            fontWeight={"bold"}
            color={"text.secondary"}
            variant="body2"
          >
            No Post Yet
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default MyPostContainer;
