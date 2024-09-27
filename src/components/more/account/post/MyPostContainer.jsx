import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";
import MyPostCard from "./MyPostCard";
function MyPost() {
  const items = Array.from({ length: 10 }, (_, i) => i);

  return (
    <Box>
      <Grid container>
        {items.map((value, i) => (
          <Grid key={i} item xs={6} sm={4} md={4}>
            <MyPostCard />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default MyPost;
