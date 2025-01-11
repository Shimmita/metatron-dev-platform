import { Avatar, Box, CardActionArea, Stack, Typography } from "@mui/material";
import React from "react";
import DevLogo from "../../images/dev.jpeg";

const GithubTeamLayout = () => {
  return (
    <CardActionArea>
      <Box display={"flex"} alignItems={"center"} gap={2} mb={2} width={"100%"}>
        {/* avtatar */}
        <Avatar src={DevLogo} alt="" sx={{ width: 34, height: 34 }} />
        <Stack>
          <Typography gutterBottom variant="body2">
            Michael Anderson
          </Typography>
          <Typography gutterBottom variant="body2" color={"text.secondary"}>
            Machine Learning Engineer
          </Typography>
          {/* button visit profile user */}
        </Stack>
      </Box>
    </CardActionArea>
  );
};

export default GithubTeamLayout;
