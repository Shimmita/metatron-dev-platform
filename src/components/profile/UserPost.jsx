import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";
import UserPostCard from "./UserPostCard";

function UserPost() {
  return (
    <Box>
      <Grid container>
        <Grid item xs={6} sm={4} md={3}>
          <UserPostCard />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <UserPostCard />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <UserPostCard />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <UserPostCard />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <UserPostCard />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <UserPostCard />
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserPost;
